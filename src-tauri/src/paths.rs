//! Lexical validation and point-in-time filesystem observations ONLY.
//! Checks can race with filesystem replacement. They are not durable operation-time
//! authorization. Phase 1 must resolve traversal/open-time containment before use.
use crate::error::{AppError, AppResult, ErrorCode};
use std::{
    fs,
    path::{Component, Path, PathBuf},
};

#[derive(Debug, Clone)]
pub struct RelativePath(PathBuf);

impl RelativePath {
    pub fn new(path: &Path) -> AppResult<Self> {
        let mut normalized = PathBuf::new();
        for component in path.components() {
            match component {
                Component::Prefix(_) | Component::RootDir => {
                    return Err(AppError::new(
                        ErrorCode::AbsolutePathNotAllowed,
                        "Only relative child paths are accepted.",
                    ))
                }
                Component::ParentDir => {
                    return Err(AppError::new(
                        ErrorCode::ParentTraversal,
                        "Parent traversal is not accepted.",
                    ))
                }
                Component::CurDir => {}
                Component::Normal(name) => {
                    validate_name(name)?;
                    normalized.push(name);
                }
            }
        }
        if normalized.as_os_str().is_empty() {
            return Err(AppError::new(
                ErrorCode::InvalidInput,
                "Use the explicit root selector.",
            ));
        }
        Ok(Self(normalized))
    }

    pub fn as_path(&self) -> &Path {
        &self.0
    }
}

#[derive(Debug)]
pub enum PathSelector {
    Root,
    Relative(RelativePath),
}

fn validate_name(name: &std::ffi::OsStr) -> AppResult<()> {
    if name.as_encoded_bytes().contains(&0) {
        return Err(AppError::new(
            ErrorCode::InvalidInput,
            "Path contains a null byte.",
        ));
    }
    #[cfg(windows)]
    {
        let text = name.to_str().ok_or_else(|| {
            AppError::new(
                ErrorCode::UnsupportedPath,
                "Unsupported Windows path encoding.",
            )
        })?;
        let stem = text.split('.').next().unwrap_or("").to_ascii_uppercase();
        let reserved = matches!(
            stem.as_str(),
            "CON" | "PRN" | "AUX" | "NUL" | "CONIN$" | "CONOUT$"
        ) || ["COM", "LPT"].iter().any(|prefix| {
            stem.strip_prefix(prefix).is_some_and(|n| {
                matches!(
                    n,
                    "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "¹" | "²" | "³"
                )
            })
        });
        if text.contains([':', '<', '>', '"', '|', '?', '*'])
            || text.ends_with(['.', ' '])
            || text.chars().any(|c| c.is_control())
            || reserved
        {
            return Err(AppError::new(
                ErrorCode::UnsupportedPath,
                "Unsupported Windows path spelling.",
            ));
        }
    }
    Ok(())
}

fn reject_link(metadata: &fs::Metadata) -> AppResult<()> {
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;
        reject_reparse_attributes(metadata.file_attributes())?;
    }
    if metadata.file_type().is_symlink() {
        return Err(AppError::new(
            ErrorCode::LinkNotAllowed,
            "Links are not accepted.",
        ));
    }
    Ok(())
}

#[cfg(windows)]
fn reject_reparse_attributes(attributes: u32) -> AppResult<()> {
    // FILE_ATTRIBUTE_REPARSE_POINT, including junctions and cloud placeholders.
    if attributes & 0x400 != 0 {
        Err(AppError::new(
            ErrorCode::LinkNotAllowed,
            "Reparse points are not accepted.",
        ))
    } else {
        Ok(())
    }
}

pub(crate) fn observe_root(selected: &Path) -> AppResult<PathBuf> {
    if !selected.is_absolute() {
        return Err(AppError::new(
            ErrorCode::InvalidInput,
            "A fully qualified root is required.",
        ));
    }
    // Reject unsupported input syntax before any filesystem probe. Ancestor aliases
    // are resolved only for this explicit root candidate, not for child requests.
    for component in selected.components() {
        match component {
            Component::ParentDir => {
                return Err(AppError::new(
                    ErrorCode::ParentTraversal,
                    "Parent traversal is not accepted.",
                ))
            }
            Component::Normal(name) => validate_name(name)?,
            #[cfg(windows)]
            Component::Prefix(prefix) if !matches!(prefix.kind(), std::path::Prefix::Disk(_)) => {
                return Err(AppError::new(
                    ErrorCode::UnsupportedPath,
                    "UNC and device roots are not supported.",
                ))
            }
            _ => {}
        }
    }
    let metadata = fs::symlink_metadata(selected)?;
    reject_link(&metadata)?;
    if !metadata.is_dir() {
        return Err(AppError::new(
            ErrorCode::NotDirectory,
            "The root must be a directory.",
        ));
    }
    Ok(fs::canonicalize(selected)?)
}

/// The caller must supply a currently active analysis grant, not frontend paths.
pub(crate) fn observe_existing(
    canonical_root: &Path,
    selector: &PathSelector,
) -> AppResult<PathBuf> {
    let metadata = fs::symlink_metadata(canonical_root)?;
    reject_link(&metadata)?;
    if !metadata.is_dir() {
        return Err(AppError::new(
            ErrorCode::NotDirectory,
            "The root must be a directory.",
        ));
    }
    if fs::canonicalize(canonical_root)? != canonical_root {
        return Err(AppError::new(
            ErrorCode::OutsideRoot,
            "The root location changed.",
        ));
    }
    let mut candidate = canonical_root.to_path_buf();
    if let PathSelector::Relative(relative) = selector {
        for component in relative.as_path().components() {
            candidate.push(component);
            let metadata = fs::symlink_metadata(&candidate)?;
            reject_link(&metadata)?;
            if !metadata.is_dir() && !metadata.is_file() {
                return Err(AppError::new(
                    ErrorCode::UnsupportedPath,
                    "Only regular files and directories are supported.",
                ));
            }
        }
    }
    let canonical = fs::canonicalize(candidate)?;
    ensure_contained(canonical_root, &canonical)?;
    Ok(canonical)
}

fn ensure_contained(root: &Path, candidate: &Path) -> AppResult<()> {
    candidate.strip_prefix(root).map(|_| ()).map_err(|_| {
        AppError::new(
            ErrorCode::OutsideRoot,
            "The path is outside the authorized root.",
        )
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::Fixture;

    #[test]
    fn lexical_paths_reject_traversal_and_implicit_root() {
        for value in ["../outside/file", "nested/../file"] {
            assert_eq!(
                RelativePath::new(Path::new(value)).unwrap_err().code,
                ErrorCode::ParentTraversal
            );
        }
        for value in ["", ".", "./"] {
            assert!(RelativePath::new(Path::new(value)).is_err());
        }
        assert_eq!(
            RelativePath::new(Path::new("./nested//file"))
                .unwrap()
                .as_path(),
            Path::new("nested/file")
        );
    }

    #[test]
    fn component_containment_rejects_sibling_prefix() {
        let fixture = Fixture::new();
        assert!(ensure_contained(&fixture.root(), &fixture.root()).is_ok());
        assert_eq!(
            ensure_contained(&fixture.root(), &fixture.outside())
                .unwrap_err()
                .code,
            ErrorCode::OutsideRoot
        );
        assert_eq!(
            ensure_contained(&fixture.root(), &fixture.path().join("authorized-other"))
                .unwrap_err()
                .code,
            ErrorCode::OutsideRoot
        );
        assert_eq!(
            RelativePath::new(&fixture.outside().join("file"))
                .unwrap_err()
                .code,
            ErrorCode::AbsolutePathNotAllowed
        );
        assert_eq!(
            RelativePath::new(&fixture.root()).unwrap_err().code,
            ErrorCode::AbsolutePathNotAllowed
        );
    }

    #[test]
    fn existing_nested_root_and_missing_paths() {
        let fixture = Fixture::new();
        fixture.file("authorized/nested/file");
        let root = observe_root(&fixture.root()).unwrap();
        assert_eq!(observe_existing(&root, &PathSelector::Root).unwrap(), root);
        for path in ["nested", "nested/file", "./nested//file"] {
            let selector = PathSelector::Relative(RelativePath::new(Path::new(path)).unwrap());
            assert!(observe_existing(&root, &selector)
                .unwrap()
                .starts_with(&root));
        }
        for path in ["missing", "missing/child", "nested/missing"] {
            let selector = PathSelector::Relative(RelativePath::new(Path::new(path)).unwrap());
            assert_eq!(
                observe_existing(&root, &selector).unwrap_err().code,
                ErrorCode::NotFound
            );
            assert!(!fixture.root().join(path).exists());
        }
        assert_eq!(
            observe_root(&fixture.root().join("nested/file"))
                .unwrap_err()
                .code,
            ErrorCode::NotDirectory
        );
    }

    #[test]
    fn unicode_names_are_preserved() {
        let fixture = Fixture::new();
        fixture.file("authorized/Ärea/notes.txt");
        let root = observe_root(&fixture.root()).unwrap();
        let path = PathSelector::Relative(RelativePath::new(Path::new("Ärea/notes.txt")).unwrap());
        assert!(observe_existing(&root, &path).is_ok());
    }

    #[cfg(unix)]
    #[test]
    fn denied_directory_access_is_a_structured_error() {
        use std::os::unix::fs::PermissionsExt;
        let fixture = Fixture::new();
        fixture.file("authorized/denied/file");
        let root = observe_root(&fixture.root()).unwrap();
        let directory = fixture.root().join("denied");
        let original = fs::metadata(&directory).unwrap().permissions();
        fs::set_permissions(&directory, fs::Permissions::from_mode(0o000)).unwrap();
        let selector = PathSelector::Relative(RelativePath::new(Path::new("denied/file")).unwrap());
        let result = observe_existing(&root, &selector);
        // Restore before asserting, so a failing test still cleans its own fixture.
        fs::set_permissions(&directory, original).unwrap();
        assert_eq!(
            result
                .expect_err("permission test must run without root bypass privileges")
                .code,
            ErrorCode::PermissionDenied
        );
    }

    #[cfg(unix)]
    #[test]
    fn non_unicode_names_are_preserved_lexically() {
        use std::{ffi::OsStr, os::unix::ffi::OsStrExt};
        let name = OsStr::from_bytes(b"file-\xff");
        let relative = RelativePath::new(Path::new(name)).unwrap();
        assert_eq!(relative.as_path().as_os_str().as_bytes(), name.as_bytes());
    }

    // APFS rejects this synthetic filename with EILSEQ. Disk-level preservation is
    // exercised on Linux, not silently skipped or claimed as validated on macOS.
    #[cfg(target_os = "linux")]
    #[test]
    fn non_unicode_names_are_preserved_on_linux_filesystems() {
        use std::{ffi::OsStr, os::unix::ffi::OsStrExt};
        let fixture = Fixture::new();
        let name = OsStr::from_bytes(b"file-\xff");
        fs::write(fixture.root().join(name), b"synthetic").unwrap();
        let root = observe_root(&fixture.root()).unwrap();
        let path = PathSelector::Relative(RelativePath::new(Path::new(name)).unwrap());
        assert_eq!(
            observe_existing(&root, &path).unwrap().file_name().unwrap(),
            name
        );
    }

    #[test]
    fn links_inside_outside_dangling_and_loop_are_rejected() {
        let fixture = Fixture::new();
        for (name, target) in [
            ("escape", fixture.outside()),
            ("inside", fixture.root()),
            ("dangling", fixture.path().join("missing")),
            ("loop", fixture.root().join("loop")),
        ] {
            fixture.directory_link(&target, &fixture.root().join(name));
            let root = observe_root(&fixture.root()).unwrap();
            let selector = PathSelector::Relative(RelativePath::new(Path::new(name)).unwrap());
            assert_eq!(
                observe_existing(&root, &selector).unwrap_err().code,
                ErrorCode::LinkNotAllowed
            );
        }
        assert_eq!(
            observe_root(&fixture.root().join("inside"))
                .unwrap_err()
                .code,
            ErrorCode::LinkNotAllowed
        );
        let selector =
            PathSelector::Relative(RelativePath::new(Path::new("escape/child")).unwrap());
        assert_eq!(
            observe_existing(&observe_root(&fixture.root()).unwrap(), &selector)
                .unwrap_err()
                .code,
            ErrorCode::LinkNotAllowed
        );
    }

    #[cfg(windows)]
    #[test]
    fn windows_special_forms_are_rejected_before_probing() {
        for path in [
            r"C:\outside",
            r"C:relative",
            r"\rooted",
            r"\\server\share\file",
            r"\\?\C:\device",
        ] {
            assert_eq!(
                RelativePath::new(Path::new(path)).unwrap_err().code,
                ErrorCode::AbsolutePathNotAllowed
            );
        }
        for path in ["file:stream", "NUL", "CON.txt", "trailing.", "trailing "] {
            assert!(RelativePath::new(Path::new(path)).is_err());
        }
        for path in [r"\\server\share", r"\\?\C:\device"] {
            assert_eq!(
                observe_root(Path::new(path)).unwrap_err().code,
                ErrorCode::UnsupportedPath
            );
        }
        assert_eq!(
            reject_reparse_attributes(0x400).unwrap_err().code,
            ErrorCode::LinkNotAllowed
        );
        assert!(reject_reparse_attributes(0x10).is_ok());
    }
}
