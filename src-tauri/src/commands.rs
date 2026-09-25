use crate::{contracts::FoundationStatus, error::AppResult};

/// No filesystem access, root discovery, jobs, or application-state writes.
#[tauri::command]
pub fn get_foundation_status() -> AppResult<FoundationStatus> {
    Ok(FoundationStatus::current())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn status_matches_shared_wire_fixture() {
        let fixture: serde_json::Value =
            serde_json::from_str(include_str!("../../tests/fixtures/ipc-contracts.json")).unwrap();
        assert_eq!(
            serde_json::to_value(get_foundation_status().unwrap()).unwrap(),
            fixture["status"]
        );
    }

    #[test]
    fn application_boundary_allows_only_foundation_status() {
        let capability: serde_json::Value =
            serde_json::from_str(include_str!("../capabilities/default.json")).unwrap();
        assert_eq!(
            capability["permissions"],
            serde_json::json!([
                "foundation-status",
                "core:webview:allow-internal-toggle-devtools"
            ])
        );
        assert_eq!(capability["windows"], serde_json::json!(["main"]));
        let permission = include_str!("../permissions/foundation.toml");
        assert!(permission.contains("commands.allow = [\"get_foundation_status\"]"));
        let composition = include_str!("lib.rs");
        assert!(composition.contains("generate_handler![commands::get_foundation_status]"));
        assert!(!composition.contains(".plugin("));
        let config: serde_json::Value =
            serde_json::from_str(include_str!("../tauri.conf.json")).unwrap();
        let csp = config["app"]["security"]["csp"].as_str().unwrap();
        assert!(csp.contains("script-src 'self'"));
        assert!(csp.contains("connect-src ipc: http://ipc.localhost"));
        assert!(!csp.contains("unsafe-eval"));
    }

    #[test]
    fn production_frontend_imports_do_not_reference_prototype() {
        for source in [
            include_str!("../../src/routes/+page.svelte"),
            include_str!("../../src/lib/ipc/client.ts"),
            include_str!("../../src/lib/ipc/contracts.ts"),
        ] {
            for line in source
                .lines()
                .filter(|line| line.trim_start().starts_with("import "))
            {
                assert!(!line.contains("reference/"));
                assert!(!line.contains("plugin-fs"));
            }
        }
    }
}
