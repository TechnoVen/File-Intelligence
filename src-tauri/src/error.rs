use serde::{Deserialize, Serialize};
use std::{fmt, io};

pub type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ErrorCode {
    InvalidInput,
    RootNotAuthorized,
    RootRevoked,
    OutsideRoot,
    ParentTraversal,
    AbsolutePathNotAllowed,
    LinkNotAllowed,
    UnsupportedPath,
    NotFound,
    NotDirectory,
    PermissionDenied,
    Cancelled,
    IoError,
    InternalError,
}

/// Public messages are deliberately path-free. OS error strings are not wire data.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AppError {
    pub code: ErrorCode,
    pub message: String,
}

impl AppError {
    pub fn new(code: ErrorCode, message: &str) -> Self {
        Self {
            code,
            message: message.to_owned(),
        }
    }
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        let (code, message) = match error.kind() {
            io::ErrorKind::NotFound => (ErrorCode::NotFound, "The requested path does not exist."),
            io::ErrorKind::PermissionDenied => (ErrorCode::PermissionDenied, "Access was denied."),
            io::ErrorKind::NotADirectory => (
                ErrorCode::NotDirectory,
                "A path component is not a directory.",
            ),
            _ => (ErrorCode::IoError, "Filesystem observation failed."),
        };
        Self::new(code, message)
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}
impl std::error::Error for AppError {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn io_errors_are_classified_without_leaking_paths() {
        let error = AppError::from(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "private path",
        ));
        assert_eq!(error.code, ErrorCode::PermissionDenied);
        assert!(!error.message.contains("private"));
        let fixture: serde_json::Value =
            serde_json::from_str(include_str!("../../tests/fixtures/ipc-contracts.json")).unwrap();
        assert_eq!(serde_json::to_value(error).unwrap(), fixture["error"]);
    }
}
