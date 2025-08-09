use tauri::Manager;

struct AppState {
    messaging_service: messaging::MessagingService,
}

#[tauri::command]
#[specta::specta]
async fn get_messages(state: tauri::State<'_, AppState>) -> Result<Vec<model::Message>, String> {
    let service = &state.messaging_service;

    service
        .get_messages()
        .await
        .map_err(|e| format!("Failed to get messages: {}", e))
}

#[tauri::command]
#[specta::specta]
async fn send_message(state: tauri::State<'_, AppState>, message: &str) -> Result<String, String> {
    let service = &state.messaging_service;

    service
        .send_message(message)
        .await
        .map_err(|e| format!("Failed to send message: {}", e))
}

#[tauri::command]
#[specta::specta]
async fn delete_all_messages(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let service = &state.messaging_service;

    service
        .delete_all_messages()
        .await
        .map_err(|e| format!("Failed to delete all messages: {}", e))
}

#[tauri::command]
#[specta::specta]
async fn speak(text: &str) -> Result<(), String> {
    voice::speak(text)
        .await
        .map_err(|e| format!("Failed to speak: {}", e))
        .map(|_| ())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> anyhow::Result<()> {
    let specta_builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![
            get_messages,
            send_message,
            delete_all_messages,
            speak,
        ])
        .typ::<model::Message>()
        .error_handling(tauri_specta::ErrorHandlingMode::Throw);

    specta_builder.export(
        specta_typescript::Typescript::default(),
        "../../ui/api/bindings.gen.ts",
    )?;

    tauri::Builder::default()
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

            tauri::async_runtime::block_on(async || -> anyhow::Result<()> {
                let sqlite_file_path = if cfg!(debug_assertions) {
                    std::env::current_dir()?.join("../../data")
                } else {
                    app.path().data_dir()?
                }
                .join("db.sqlite");
                let repository = repository::RepositoryImpl::new(sqlite_file_path).await?;
                let messaging_service = messaging::MessagingService::new(repository);

                app.manage(AppState { messaging_service });

                Ok(())
            }())?;

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_messages,
            send_message,
            delete_all_messages,
            speak
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
