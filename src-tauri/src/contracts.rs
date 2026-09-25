//! Backend-owned vocabulary. Lifecycle enums are provisional, not executable state
//! machines or a persistence schema. Deserialized states confer no authority.
use crate::error::{AppError, AppResult, ErrorCode};
use serde::{Deserialize, Serialize};

macro_rules! identifier {
    ($name:ident) => {
        #[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
        #[serde(try_from = "String", into = "String")]
        pub struct $name(String);
        impl TryFrom<String> for $name {
            type Error = AppError;
            fn try_from(value: String) -> AppResult<Self> {
                if value.is_empty()
                    || value.len() > 128
                    || !value
                        .bytes()
                        .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
                {
                    return Err(AppError::new(
                        ErrorCode::InvalidInput,
                        "Invalid identifier.",
                    ));
                }
                Ok(Self(value))
            }
        }
        impl From<$name> for String {
            fn from(value: $name) -> Self {
                value.0
            }
        }
        impl $name {
            pub fn as_str(&self) -> &str {
                &self.0
            }
        }
    };
}

// IDs are references, not capabilities. Durable ID allocation is deferred.
identifier!(RootId);
identifier!(JobId);
identifier!(ProposalId);
identifier!(OperationId);
identifier!(TransactionId);

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct FoundationStatus {
    pub contract_version: u32,
    pub phase: Phase,
    pub capabilities: Capabilities,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum Phase {
    Foundation,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Capabilities {
    pub root_selection: bool,
    pub scanning: bool,
    pub proposal_generation: bool,
    pub execution: bool,
    pub local_ai: bool,
}

impl FoundationStatus {
    pub fn current() -> Self {
        Self {
            contract_version: 1,
            phase: Phase::Foundation,
            capabilities: Capabilities {
                root_selection: false,
                scanning: false,
                proposal_generation: false,
                execution: false,
                local_ai: false,
            },
        }
    }
}

/// Provisional review vocabulary only; approval applies to one proposal revision.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ProposalState {
    Draft,
    AwaitingReview,
    Approved,
    Rejected,
    Invalidated,
}

/// Provisional vocabulary: an enum value is NOT proof of a durable write.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum JournalState {
    IntentPrepared,
    IntentDurable,
    OutcomeRecorded,
}

/// No transition engine, executor, or mutation capability exists in Phase 0B.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum TransactionState {
    Planned,
    IntentDurable,
    Applying,
    Verifying,
    Completed,
    Failed,
    RecoveryRequired,
}

/// No recovery operations or persistence implementation exist in Phase 0B.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RecoveryState {
    Required,
    Assessing,
    RollbackPlanned,
    RollingBack,
    Restored,
    Blocked,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identifiers_reject_invalid_wire_values() {
        for input in ["\"\"", "\"../file\"", "\"a b\""] {
            assert!(serde_json::from_str::<RootId>(input).is_err());
        }
        let id: RootId = serde_json::from_str("\"root-fixture\"").unwrap();
        assert_eq!(id.as_str(), "root-fixture");
    }

    #[test]
    fn provisional_lifecycles_have_explicit_wire_names() {
        assert_eq!(
            serde_json::to_value(JournalState::IntentDurable).unwrap(),
            "intent_durable"
        );
        assert_eq!(
            serde_json::to_value(ProposalState::AwaitingReview).unwrap(),
            "awaiting_review"
        );
        assert_eq!(
            serde_json::to_value(TransactionState::RecoveryRequired).unwrap(),
            "recovery_required"
        );
        assert_eq!(
            serde_json::to_value(RecoveryState::Blocked).unwrap(),
            "blocked"
        );
    }
}
