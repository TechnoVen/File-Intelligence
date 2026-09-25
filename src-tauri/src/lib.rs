mod commands;
pub mod contracts;
pub mod error;
pub mod jobs;
pub mod paths;
pub mod roots;

#[cfg(test)]
mod test_support;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::get_foundation_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
