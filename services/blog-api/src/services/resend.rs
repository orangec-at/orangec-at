use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct EmailParams {
    pub from: String,
    pub to: String,
    pub subject: String,
    pub html: String,
}

pub async fn send_email(params: EmailParams) -> Result<(), Box<dyn std::error::Error>> {
    let api_key = std::env::var("RESEND_API_KEY")
        .map_err(|_| "RESEND_API_KEY not set")?;
    
    let client = reqwest::Client::new();
    let response = client
        .post("https://api.resend.com/emails")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&serde_json::json!({
            "from": params.from,
            "to": params.to,
            "subject": params.subject,
            "html": params.html,
        }))
        .send()
        .await?;
    
    if !response.status().is_success() {
        return Err(format!("Resend API error: {}", response.status()).into());
    }
    
    Ok(())
}
