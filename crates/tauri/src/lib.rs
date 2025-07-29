use std::io::Write as _;
use std::{fs::File, io::BufReader};

use const_format::concatcp;

use anyhow::Context as _;
use voicevox_core::{
    blocking::{Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile},
    CharacterMeta, StyleMeta,
};

fn play(wav: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let tempfile = tempfile::Builder::new().suffix(".wav").tempfile()?;
    (&tempfile).write_all(wav)?;
    let tempfile = &tempfile.into_temp_path();
    // Get an output stream handle to the default physical sound device.
    // Note that the playback stops when the stream_handle is dropped.
    let stream_handle =
        rodio::OutputStreamBuilder::open_default_stream().expect("open default audio stream");

    // Load a sound from a file, using a path relative to Cargo.toml
    let file = BufReader::new(File::open(tempfile).unwrap());
    // Note that the playback stops when the sink is dropped
    let sink = rodio::play(&stream_handle.mixer(), file).unwrap();

    // The sound plays in a separate audio thread,
    // so we need to keep the main thread alive while it's playing.
    std::thread::sleep(std::time::Duration::from_secs(5));
    Ok(())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn speak(text: &str) -> String {
    // ダウンローダーにて`onnxruntime`としてダウンロードできるもの
    const VVORT: &str = concatcp!(
        "../../voicevox_core/onnxruntime/lib/",
        Onnxruntime::LIB_VERSIONED_FILENAME,
    );

    // ダウンローダーにて`dict`としてダウンロードできるもの
    const OJT_DIC: &str = "../../voicevox_core/dict/open_jtalk_dic_utf_8-1.11";

    // ダウンローダーにて`models`としてダウンロードできるもの
    const VVM: &str = "../../voicevox_core/models/vvms/0.vvm";

    const TARGET_CHARACTER_NAME: &str = "ずんだもん";
    const TARGET_STYLE_NAME: &str = "ノーマル";

    let synth = {
        let ort = Onnxruntime::load_once().filename(VVORT).perform().unwrap();
        let ojt = OpenJtalk::new(OJT_DIC).unwrap();
        Synthesizer::builder(ort)
            .text_analyzer(ojt)
            .build()
            .unwrap()
    };

    dbg!(synth.is_gpu_mode());

    synth
        .load_voice_model(&VoiceModelFile::open(VVM).unwrap())
        .unwrap();

    let StyleMeta { id: style_id, .. } = synth
        .metas()
        .into_iter()
        .filter(|CharacterMeta { name, .. }| name == TARGET_CHARACTER_NAME)
        .flat_map(|CharacterMeta { styles, .. }| styles)
        .find(|StyleMeta { name, .. }| name == TARGET_STYLE_NAME)
        .with_context(|| {
            format!("could not find \"{TARGET_CHARACTER_NAME} ({TARGET_STYLE_NAME})\"")
        })
        .unwrap();

    eprintln!("Synthesizing");
    let wav = &synth.tts(text, style_id).perform().unwrap();

    eprintln!("Playing the WAV");
    play(wav).unwrap();
    format!("Speaking: {}", text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![speak])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
