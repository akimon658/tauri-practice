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

        // Replace this with actual message processing logic
        let response = message.to_string();

        self.repository.save_message(&response, true).await?;

        Ok(response)
    }

    pub async fn delete_all_messages(&self) -> anyhow::Result<()> {
        self.repository.delete_all_messages().await
    }
}
