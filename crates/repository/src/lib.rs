use anyhow::Context;

pub struct RepositoryImpl {
    pool: sqlx::SqlitePool,
}

impl RepositoryImpl {
    pub async fn new(sqlite_file_path: std::path::PathBuf) -> anyhow::Result<Self> {
        let database_url = "sqlite://".to_string()
            + sqlite_file_path
                .to_str()
                .ok_or(anyhow::anyhow!("failed to convert database path to string"))?;
        let pool = sqlx::SqlitePool::connect(&database_url)
            .await
            .with_context(|| {
                format!(
                    "failed to connect to database at {}",
                    sqlite_file_path.display()
                )
            })?;

        sqlx::migrate!().run(&pool).await?;

        Ok(RepositoryImpl { pool })
    }

    pub async fn save_message(&self, message: &str, by_zundamon: bool) -> anyhow::Result<()> {
        sqlx::query!(
            "INSERT INTO messages (content, by_zundamon) VALUES (?, ?)",
            message,
            by_zundamon
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
