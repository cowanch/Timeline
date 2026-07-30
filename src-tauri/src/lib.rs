use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let new_item = MenuItem::with_id(app, "new", "New", true, None::<&str>)?;
      let open_item = MenuItem::with_id(app, "open", "Open...", true, None::<&str>)?;
      let save_item = MenuItem::with_id(app, "save", "Save", true, None::<&str>)?;
      let save_as_item =
        MenuItem::with_id(app, "save-as", "Save As...", true, None::<&str>)?;
      let separator = PredefinedMenuItem::separator(app)?;
      let quit_item = PredefinedMenuItem::quit(app, None)?;

      let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
          &new_item,
          &open_item,
          &save_item,
          &save_as_item,
          &separator,
          &quit_item,
        ],
      )?;

      let menu = Menu::with_items(app, &[&file_menu])?;
      app.set_menu(menu)?;

      app.on_menu_event(|app, event| {
        let event_id = event.id().0.as_str();
        let payload = match event_id {
          "new" => "document-new",
          "open" => "document-open",
          "save" => "document-save",
          "save-as" => "document-save-as",
          _ => return,
        };
        let _ = app.emit(payload, ());
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
