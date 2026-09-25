//! No workers, scheduler, or production job registry. Progress is advisory;
//! Phase 1 must retain terminal status and reject late updates to terminal jobs.
use crate::{
    contracts::JobId,
    error::{AppError, AppResult, ErrorCode},
};
use serde::{Deserialize, Serialize};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum JobState {
    Queued,
    Running,
    CancellationRequested,
    Cancelled,
    Completed,
    Failed,
}

/// Decimal strings on the wire avoid JavaScript integer precision loss.
#[derive(Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct JobProgress {
    job_id: JobId,
    sequence: String,
    stage: String,
    completed: String,
    total: Option<String>,
    state: JobState,
}

impl JobProgress {
    pub fn new(
        job_id: JobId,
        sequence: u64,
        stage: &str,
        completed: u64,
        total: Option<u64>,
        state: JobState,
    ) -> AppResult<Self> {
        if stage.is_empty() || total.is_some_and(|total| completed > total) {
            return Err(AppError::new(
                ErrorCode::InvalidInput,
                "Invalid progress observation.",
            ));
        }
        Ok(Self {
            job_id,
            sequence: sequence.to_string(),
            stage: stage.to_owned(),
            completed: completed.to_string(),
            total: total.map(|n| n.to_string()),
            state,
        })
    }
}

/// A request only. Workers must acknowledge cancellation at bounded work
/// boundaries; an OS call already in progress may delay acknowledgement.
#[derive(Debug, Clone, Default)]
pub struct CancellationToken(Arc<AtomicBool>);
impl CancellationToken {
    pub fn request(&self) {
        self.0.store(true, Ordering::Release);
    }
    pub fn is_requested(&self) -> bool {
        self.0.load(Ordering::Acquire)
    }
    pub fn check(&self) -> AppResult<()> {
        if self.is_requested() {
            Err(AppError::new(
                ErrorCode::Cancelled,
                "Cancellation was requested.",
            ))
        } else {
            Ok(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cancellation_is_shared_and_idempotent() {
        let token = CancellationToken::default();
        let worker = token.clone();
        assert!(worker.check().is_ok());
        token.request();
        token.request();
        assert_eq!(worker.check().unwrap_err().code, ErrorCode::Cancelled);
        assert_ne!(JobState::CancellationRequested, JobState::Cancelled);
    }

    #[test]
    fn progress_preserves_large_counts_and_unknown_totals() {
        let progress = JobProgress::new(
            JobId::try_from("fixture-job".to_owned()).unwrap(),
            u64::MAX,
            "fixture",
            0,
            None,
            JobState::Queued,
        )
        .unwrap();
        let wire = serde_json::to_value(progress).unwrap();
        assert_eq!(wire["sequence"], u64::MAX.to_string());
        assert!(wire["total"].is_null());
        assert!(JobProgress::new(
            JobId::try_from("fixture-job".to_owned()).unwrap(),
            0,
            "fixture",
            2,
            Some(1),
            JobState::Running
        )
        .is_err());
    }
}
