#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dirs_next::config_dir;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;
#[derive(Serialize, Deserialize, Clone)]
struct Note {
    id: String,
    title: String,
    body: String,
}

fn data_file_path() -> PathBuf {
    let mut dir = config_dir().expect("could not get config directory");
    dir.push("astro-notes");
    dir.push("notes.json");
    dir
}

#[tauri::command]
fn load_notes() -> Vec<Note> {
    let path = data_file_path();
    if let Ok(s) = fs::read_to_string(&path) {
        serde_json::from_str(&s).unwrap_or_default()
    } else {
        vec![]
    }
}

#[tauri::command]
fn new_note() -> Note {
    let mut notes = load_notes();
    let note = Note {
        id: Uuid::new_v4().to_string(),
        title: "".into(),
        body: "".into(),
    };
    notes.insert(0, note.clone());
    save_all(&notes);
    note
}

#[tauri::command]
fn save_note(note: Note) {
    let mut notes = load_notes();
    // replace or insert
    notes.retain(|n| n.id != note.id);
    notes.insert(0, note);
    save_all(&notes);
}

#[tauri::command]
fn delete_note(id: String) {
    let mut notes = load_notes();
    notes.retain(|n| n.id != id);
    save_all(&notes);
}

fn save_all(notes: &Vec<Note>) {
    let path = data_file_path();
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let _ = fs::write(path, serde_json::to_string_pretty(notes).unwrap());
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            load_notes,
            new_note,
            save_note,
            delete_note
        ])
        // .menu(tauri::Menu::os_default("AstroNotes"))
        .run(tauri::generate_context!())
        .expect("error while running Tauri app");
}
