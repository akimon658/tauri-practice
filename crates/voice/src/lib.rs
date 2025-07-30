use anyhow::Context;
use voicevox_core::blocking::{Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile};

const VVORT: &str = const_format::concatcp!(
    "../../voicevox_core/onnxruntime/lib/",
    Onnxruntime::LIB_VERSIONED_FILENAME,
);
const OJT_DIC: &str = "../../voicevox_core/dict/open_jtalk_dic_utf_8-1.11";
const VVM: &str = "../../voicevox_core/models/vvms/0.vvm";
const TARGET_CHARACTER_NAME: &str = "ずんだもん";
const TARGET_STYLE_NAME: &str = "ノーマル";

pub fn speak(text: &str) -> anyhow::Result<(), anyhow::Error> {
    let synth = {
        let ort = Onnxruntime::load_once().filename(VVORT).perform()?;
        let ojt = OpenJtalk::new(OJT_DIC)?;

        Synthesizer::builder(ort).text_analyzer(ojt).build()?
    };

    synth.load_voice_model(&VoiceModelFile::open(VVM)?)?;

    let style_id = synth
        .metas()
        .into_iter()
        .filter(|character| character.name == TARGET_CHARACTER_NAME)
        .flat_map(|character| character.styles)
        .find(|style| style.name == TARGET_STYLE_NAME)
        .with_context(|| {
            format!("could not find \"{TARGET_CHARACTER_NAME} ({TARGET_STYLE_NAME})\"")
        })?
        .id;
    let wav = synth.tts(text, style_id).perform()?;
    let stream_handle = rodio::OutputStreamBuilder::open_default_stream()?;
    let file = std::io::Cursor::new(wav);
    let _sink = rodio::play(&stream_handle.mixer(), file)?;

    std::thread::sleep(std::time::Duration::from_secs(5));

    Ok(())
}
