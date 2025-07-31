use anyhow::Context;
use sqlx::Connection;

pub struct RepositoryImpl {
    conn: sqlx::SqliteConnection,
}

impl RepositoryImpl {
    pub async fn new(sqlite_file_path: std::path::PathBuf) -> anyhow::Result<Self> {
        let database_url = "sqlite://".to_string()
            + sqlite_file_path
                .to_str()
                .ok_or(anyhow::anyhow!("failed to convert database path to string"))?;
        let mut conn = sqlx::SqliteConnection::connect(&database_url)
            .await
            .with_context(|| {
                format!(
                    "failed to connect to database at {}",
                    sqlite_file_path.display()
                )
            })?;

        sqlx::migrate!().run(&mut conn).await?;

        Ok(RepositoryImpl { conn })
    }

    pub async fn save_message(&mut self, message: &str) -> anyhow::Result<()> {
        sqlx::query!("INSERT INTO messages (content) VALUES (?)", message)
            .execute(&mut self.conn)
            .await?;

        Ok(())
    }
}
