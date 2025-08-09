#[derive(serde::Serialize, specta::Type)]
pub struct Message {
    pub id: u32,
    pub content: String,
    pub by_zundamon: bool,
}
