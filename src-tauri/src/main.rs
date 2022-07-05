#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use arboard::{Clipboard, ImageData};

#[tauri::command]
fn copy_image_to_clipboard(height: usize, width: usize, bytes: Vec<u8>) {
  let mut ctx = Clipboard::new().unwrap();

  let img_data = ImageData { width, height, bytes: bytes.into() };
  ctx.set_image(img_data).unwrap();
}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .invoke_handler(tauri::generate_handler![copy_image_to_clipboard])
    .run(context)
    .expect("error while running tauri application");
}
