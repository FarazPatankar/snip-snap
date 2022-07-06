#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;
use arboard::{Clipboard, ImageData};
use image::{DynamicImage, ImageBuffer};

#[tauri::command]
fn copy_image_to_clipboard(height: usize, width: usize, bytes: Vec<u8>) {
  let mut ctx = Clipboard::new().unwrap();

  let img_data = ImageData { width, height, bytes: bytes.into() };
  ctx.set_image(img_data).unwrap();
}

fn ensure_dir_exists(path: &str) {
  if !fs::metadata(path).is_ok() {
    println!("Creating& directory: {}", path);
    fs::create_dir(path).unwrap();
  }
}

fn save_image(img: &DynamicImage, path: &str) {
  img.save(path).unwrap();
}

#[tauri::command]
fn save_image_from_clipboard(app_handle: tauri::AppHandle, cache_dir_path: String) -> Result<String, String> {
  let config = app_handle.config();
  let identifier = &config.tauri.bundle.identifier;

  let mut ctx = Clipboard::new().unwrap();
  let response = ctx.get_image();
  if response.is_err() {
    Err("Clipboard does not contain an image".into())
  } else {
    let image = response.unwrap();

    let imgbuf = ImageBuffer::from_raw(
      image.width as u32,
      image.height as u32,
      image.bytes.into_owned(),
    ).unwrap();
    let imgbuf = DynamicImage::ImageRgba8(imgbuf);

    // Create directory if it does not already exist
    let directory = cache_dir_path + identifier;
    ensure_dir_exists(&directory);

    // Save image to disk
    let filepath = directory + "/temp-snip-snap.png";
    save_image(&imgbuf, &filepath);

    return Ok(filepath);
  }
}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .invoke_handler(tauri::generate_handler![copy_image_to_clipboard, save_image_from_clipboard])
    .run(context)
    .expect("error while running tauri application");
}
