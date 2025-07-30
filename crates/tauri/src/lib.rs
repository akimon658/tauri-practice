use tauri::Manager;

#[tauri::command]
#[specta::specta]
fn speak(text: &str) -> Result<(), String> {
    voice::speak(text)
        .map_err(|e| format!("Failed to speak: {}", e))
        .map(|_| ())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> anyhow::Result<()> {
    let specta_builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![speak])
        .error_handling(tauri_specta::ErrorHandlingMode::Throw);

    specta_builder.export(
        specta_typescript::Typescript::default(),
        "../../ui/api/bindings.gen.ts",
    )?;

    Ok(tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            match app.get_webview_window("main") {
                Some(w) => {
                    w.open_devtools();
                }
                None => {
                    eprintln!("Failed to open devtools: main window not found");
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![speak])
        .run(tauri::generate_context!())?)
}
