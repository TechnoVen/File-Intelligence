//! Test-owned temporary data only. Never use HOME, Documents, system Trash, or an
//! environment-selected temporary parent. Cargo's repository target is the parent.
use std::{
    fs,
    path::{Path, PathBuf},
};

pub struct Fixture {
    directory: tempfile::TempDir,
}
impl Fixture {
    pub fn new() -> Self {
        let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let parent = manifest.join("target");
        // Cargo creates target. Reject redirected storage instead of following it.
        let metadata =
            fs::symlink_metadata(&parent).expect("repository target directory must exist");
        assert!(!metadata.file_type().is_symlink());
        #[cfg(windows)]
        {
            use std::os::windows::fs::MetadataExt;
            assert_eq!(metadata.file_attributes() & 0x400, 0);
        }
        assert_eq!(
            fs::canonicalize(&parent).unwrap(),
            fs::canonicalize(&manifest).unwrap().join("target")
        );
        let directory = tempfile::Builder::new()
            .prefix("fi-fixture-")
            .tempdir_in(&parent)
            .unwrap();
        for name in ["authorized", "outside", "app-state"] {
            fs::create_dir(directory.path().join(name)).unwrap();
        }
        Self { directory }
    }
    pub fn path(&self) -> &Path {
        self.directory.path()
    }
    pub fn root(&self) -> PathBuf {
        self.path().join("authorized")
    }
    pub fn outside(&self) -> PathBuf {
        self.path().join("outside")
    }
    pub fn file(&self, relative: &str) {
        let relative = crate::paths::RelativePath::new(Path::new(relative)).unwrap();
        let path = self.path().join(relative.as_path());
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, b"synthetic fixture content").unwrap();
    }
    pub fn directory_link(&self, target: &Path, link: &Path) {
        assert!(target.starts_with(self.path()) && link.starts_with(self.path()));
        #[cfg(unix)]
        std::os::unix::fs::symlink(target, link).unwrap();
        #[cfg(windows)]
        std::os::windows::fs::symlink_dir(target, link).expect(
            "Windows link safety test requires symlink privilege; failure is not a skipped pass",
        );
    }
}

#[test]
fn cleanup_does_not_follow_a_fixture_link() {
    let survivor = Fixture::new();
    let victim = Fixture::new();
    // Both endpoints are test-owned, even though they have different lifetimes.
    #[cfg(unix)]
    std::os::unix::fs::symlink(survivor.root(), victim.root().join("link")).unwrap();
    #[cfg(windows)]
    std::os::windows::fs::symlink_dir(survivor.root(), victim.root().join("link"))
        .expect("Windows symlink privilege required");
    let removed_path = victim.path().to_owned();
    drop(victim);
    assert!(!removed_path.exists());
    assert!(survivor.root().is_dir());
}
