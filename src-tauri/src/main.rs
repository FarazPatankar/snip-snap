#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{fs, sync::Arc};
use arboard::{Clipboard, ImageData};
use image::{DynamicImage, ImageBuffer};
use tauri::Config;

fn get_active_image_directory(config: Arc<Config>, directory: &str) -> String {
  let identifier = &config.tauri.bundle.identifier;

  return directory.to_owned() + identifier
}

fn get_active_image_path(directory: &str) -> String {
  return directory.to_owned() + "/active-image.png";
}

fn ensure_dir_exists(path: &str) {
  if !fs::metadata(path).is_ok() {
    fs::create_dir(path).unwrap();
  }
}

#[tauri::command]
fn get_image_path(app_handle: tauri::AppHandle, cache_dir_path: String) -> String {
  let directory = get_active_image_directory(app_handle.config(), &cache_dir_path);
  ensure_dir_exists(&directory);

  let active_image_path = get_active_image_path(&directory);

  return active_image_path;
}

#[tauri::command]
fn copy_image_to_clipboard(image_path: String) {
  let img = image::open(image_path).unwrap();

  let mut ctx = Clipboard::new().unwrap();

  let img_data = ImageData { width: img.width() as usize, height:img.height() as usize, bytes: img.as_bytes().into() };
  ctx.set_image(img_data).unwrap();
}

fn save_image(img: &DynamicImage, path: &str) {
  img.save(path).unwrap();
}

#[tauri::command]
fn save_image_from_clipboard(app_handle: tauri::AppHandle, cache_dir_path: String) -> Result<String, String> {
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

    let directory = get_active_image_directory(app_handle.config(), &cache_dir_path);
    ensure_dir_exists(&directory);

    let active_image_path = get_active_image_path(&directory);
    save_image(&imgbuf, &active_image_path);

    return Ok(active_image_path);
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
    .invoke_handler(tauri::generate_handler![copy_image_to_clipboard, save_image_from_clipboard, get_image_path])
    .run(context)
    .expect("error while running tauri application");
}
