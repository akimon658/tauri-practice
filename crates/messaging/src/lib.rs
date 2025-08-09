pub struct MessagingService {
    repository: repository::RepositoryImpl,
}

impl MessagingService {
    pub fn new(repository: repository::RepositoryImpl) -> Self {
        MessagingService { repository }
    }

    pub async fn get_messages(&self) -> anyhow::Result<Vec<model::Message>> {
        self.repository.get_messages().await
    }

    pub async fn send_message(&self, message: &str) -> anyhow::Result<String> {
        self.repository.save_message(message, false).await?;

        let response = message.to_string();

        Ok(response)
    }
}
