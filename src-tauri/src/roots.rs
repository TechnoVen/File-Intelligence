//! In-memory analysis authorization only. No root discovery, persistence, mutation
//! permissions, or IPC exposure. Future user confirmation must bind to the resolved
//! candidate. Root IDs are never accepted as authority without registry lookup.
use crate::{
    contracts::RootId,
    error::{AppError, AppResult, ErrorCode},
    paths::{self, PathSelector},
};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

#[derive(Debug, Default)]
pub struct MasterRootConfig {
    selected: Option<PathBuf>,
}
impl MasterRootConfig {
    pub fn selected(&self) -> Option<&Path> {
        self.selected.as_deref()
    }
    /// Configuration only; no filesystem access and no analysis permission.
    pub fn set(&mut self, candidate: &RootCandidate) {
        self.selected = Some(candidate.resolved.clone());
    }
    pub fn clear(&mut self) {
        self.selected = None;
    }
}

#[derive(Debug)]
pub struct RootCandidate {
    selected: PathBuf,
    resolved: PathBuf,
}
impl RootCandidate {
    pub fn prepare(selected: &Path) -> AppResult<Self> {
        Ok(Self {
            selected: selected.to_owned(),
            resolved: paths::observe_root(selected)?,
        })
    }
    pub fn selected(&self) -> &Path {
        &self.selected
    }
    pub fn resolved(&self) -> &Path {
        &self.resolved
    }
}

#[derive(Debug)]
struct AnalysisRootGrant {
    candidate: RootCandidate,
    revision: u64,
    active: bool,
}

#[derive(Debug, Default)]
pub struct RootRegistry {
    grants: HashMap<RootId, AnalysisRootGrant>,
}

/// Point-in-time observation, not permission for a later filesystem operation.
#[derive(Debug)]
pub struct ExistingPathObservation {
    root_id: RootId,
    grant_revision: u64,
    path: PathBuf,
}
impl ExistingPathObservation {
    pub fn root_id(&self) -> &RootId {
        &self.root_id
    }
    pub fn grant_revision(&self) -> u64 {
        self.grant_revision
    }
    pub fn path(&self) -> &Path {
        &self.path
    }
}

impl RootRegistry {
    /// Trusted backend use only after explicit approval of the resolved candidate.
    /// Phase 0B calls this in synthetic tests, never from a production command.
    /// An ID cannot be reused even after revocation within this registry.
    pub fn authorize_analysis(&mut self, id: RootId, candidate: RootCandidate) -> AppResult<()> {
        if self.grants.contains_key(&id) {
            return Err(AppError::new(
                ErrorCode::InvalidInput,
                "Root identifier already used.",
            ));
        }
        if paths::observe_root(candidate.selected())? != candidate.resolved {
            return Err(AppError::new(
                ErrorCode::OutsideRoot,
                "The selected root changed; prepare it again.",
            ));
        }
        self.grants.insert(
            id,
            AnalysisRootGrant {
                candidate,
                revision: 1,
                active: true,
            },
        );
        Ok(())
    }

    pub fn revoke(&mut self, id: &RootId) -> AppResult<()> {
        let grant = self.grants.get_mut(id).ok_or_else(|| {
            AppError::new(ErrorCode::RootNotAuthorized, "Root is not authorized.")
        })?;
        if grant.active {
            grant.active = false;
            grant.revision += 1;
        }
        Ok(())
    }

    pub fn observe(
        &self,
        id: &RootId,
        selector: &PathSelector,
    ) -> AppResult<ExistingPathObservation> {
        let grant = self.grants.get(id).ok_or_else(|| {
            AppError::new(ErrorCode::RootNotAuthorized, "Root is not authorized.")
        })?;
        if !grant.active {
            return Err(AppError::new(
                ErrorCode::RootRevoked,
                "Root authorization was revoked.",
            ));
        }
        if paths::observe_root(grant.candidate.selected())? != grant.candidate.resolved {
            return Err(AppError::new(
                ErrorCode::OutsideRoot,
                "The selected root location changed.",
            ));
        }
        Ok(ExistingPathObservation {
            root_id: id.clone(),
            grant_revision: grant.revision,
            path: paths::observe_existing(grant.candidate.resolved(), selector)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{paths::RelativePath, test_support::Fixture};

    fn id() -> RootId {
        RootId::try_from("fixture-root".to_owned()).unwrap()
    }

    #[test]
    fn master_configuration_does_not_authorize_analysis() {
        let fixture = Fixture::new();
        let mut config = MasterRootConfig::default();
        assert!(config.selected().is_none());
        config.set(&RootCandidate::prepare(&fixture.root()).unwrap());
        let registry = RootRegistry::default();
        assert_eq!(
            registry
                .observe(&id(), &PathSelector::Root)
                .unwrap_err()
                .code,
            ErrorCode::RootNotAuthorized
        );
        config.clear();
        assert!(config.selected().is_none());
        assert!(!fixture.root().join("00_Inbox").exists());
    }

    #[test]
    fn grant_is_required_and_revocation_prevents_reuse() {
        let fixture = Fixture::new();
        let mut registry = RootRegistry::default();
        registry
            .authorize_analysis(id(), RootCandidate::prepare(&fixture.root()).unwrap())
            .unwrap();
        let observation = registry.observe(&id(), &PathSelector::Root).unwrap();
        assert_eq!(observation.root_id(), &id());
        assert_eq!(observation.grant_revision(), 1);
        registry.revoke(&id()).unwrap();
        registry.revoke(&id()).unwrap();
        assert_eq!(
            registry
                .observe(&id(), &PathSelector::Root)
                .unwrap_err()
                .code,
            ErrorCode::RootRevoked
        );
        assert!(registry
            .authorize_analysis(id(), RootCandidate::prepare(&fixture.root()).unwrap())
            .is_err());
    }

    #[test]
    fn disappeared_root_and_replaced_child_are_rechecked() {
        let fixture = Fixture::new();
        fixture.file("authorized/child/file");
        let mut registry = RootRegistry::default();
        registry
            .authorize_analysis(id(), RootCandidate::prepare(&fixture.root()).unwrap())
            .unwrap();
        let selector = PathSelector::Relative(RelativePath::new(Path::new("child/file")).unwrap());
        assert!(registry.observe(&id(), &selector).is_ok());
        std::fs::rename(
            fixture.root().join("child"),
            fixture.path().join("old-child"),
        )
        .unwrap();
        fixture.directory_link(&fixture.outside(), &fixture.root().join("child"));
        assert_eq!(
            registry.observe(&id(), &selector).unwrap_err().code,
            ErrorCode::LinkNotAllowed
        );
        std::fs::rename(fixture.root(), fixture.path().join("old-root")).unwrap();
        assert_eq!(
            registry
                .observe(&id(), &PathSelector::Root)
                .unwrap_err()
                .code,
            ErrorCode::NotFound
        );
    }

    #[test]
    fn candidate_replaced_with_a_link_cannot_be_authorized() {
        let fixture = Fixture::new();
        let candidate = RootCandidate::prepare(&fixture.root()).unwrap();
        std::fs::rename(fixture.root(), fixture.path().join("original-root")).unwrap();
        fixture.directory_link(&fixture.outside(), &fixture.root());
        let mut registry = RootRegistry::default();
        assert_eq!(
            registry
                .authorize_analysis(id(), candidate)
                .unwrap_err()
                .code,
            ErrorCode::LinkNotAllowed
        );
        assert_eq!(
            registry
                .observe(&id(), &PathSelector::Root)
                .unwrap_err()
                .code,
            ErrorCode::RootNotAuthorized
        );
    }
}
