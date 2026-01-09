use lettre::{
    message::header::ContentType,
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};

pub struct EmailConfig {
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_user: String,
    pub smtp_pass: String,
    pub from_email: String,
    pub from_name: String,
}

impl EmailConfig {
    pub fn from_env() -> Result<Self, String> {
        Ok(Self {
            smtp_host: std::env::var("SMTP_HOST")
                .unwrap_or_else(|_| "smtp.gmail.com".to_string()),
            smtp_port: std::env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".to_string())
                .parse()
                .unwrap_or(587),
            smtp_user: std::env::var("SMTP_USER")
                .map_err(|_| "SMTP_USER not set")?,
            smtp_pass: std::env::var("SMTP_PASS")
                .map_err(|_| "SMTP_PASS not set")?,
            from_email: std::env::var("EMAIL_FROM")
                .unwrap_or_else(|_| "noreply@example.com".to_string()),
            from_name: std::env::var("EMAIL_FROM_NAME")
                .unwrap_or_else(|_| "Midnight Archives".to_string()),
        })
    }
}

pub struct EmailService {
    mailer: AsyncSmtpTransport<Tokio1Executor>,
    from_email: String,
    from_name: String,
}

impl EmailService {
    pub fn new(config: EmailConfig) -> Result<Self, String> {
        let creds = Credentials::new(config.smtp_user, config.smtp_pass);

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&config.smtp_host)
            .map_err(|e| format!("Failed to create SMTP transport: {}", e))?
            .port(config.smtp_port)
            .credentials(creds)
            .build();

        Ok(Self {
            mailer,
            from_email: config.from_email,
            from_name: config.from_name,
        })
    }

    pub fn from_env() -> Result<Self, String> {
        let config = EmailConfig::from_env()?;
        Self::new(config)
    }

    pub async fn send_magic_link(
        &self,
        to_email: &str,
        magic_link_url: &str,
        locale: &str,
    ) -> Result<(), String> {
        let (subject, body) = self.magic_link_template(magic_link_url, locale);

        let from = format!("{} <{}>", self.from_name, self.from_email);

        let email = Message::builder()
            .from(from.parse().map_err(|e| format!("Invalid from address: {}", e))?)
            .to(to_email.parse().map_err(|e| format!("Invalid to address: {}", e))?)
            .subject(subject)
            .header(ContentType::TEXT_HTML)
            .body(body)
            .map_err(|e| format!("Failed to build email: {}", e))?;

        self.mailer
            .send(email)
            .await
            .map_err(|e| format!("Failed to send email: {}", e))?;

        Ok(())
    }

    fn magic_link_template(&self, magic_link_url: &str, locale: &str) -> (String, String) {
        let is_ko = locale == "ko";

        let subject = if is_ko {
            "심야 서고 로그인 링크"
        } else {
            "Sign in to Midnight Archives"
        };

        let title = if is_ko { "심야 서고" } else { "Midnight Archives" };
        let greeting = if is_ko {
            "안녕하세요, 서고지기님."
        } else {
            "Hello, dear visitor."
        };
        let instruction = if is_ko {
            "아래 버튼을 클릭하여 로그인하세요."
        } else {
            "Click the button below to sign in."
        };
        let button_text = if is_ko { "로그인하기" } else { "Sign In" };
        let expiry_notice = if is_ko {
            "이 링크는 24시간 후 만료됩니다."
        } else {
            "This link expires in 24 hours."
        };
        let ignore_notice = if is_ko {
            "로그인을 요청하지 않으셨다면 이 이메일을 무시하세요."
        } else {
            "If you didn't request this, please ignore this email."
        };

        let body = format!(
            r#"<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Georgia', serif; background-color: #f4f1ea; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #e5e2db; border-radius: 8px; padding: 40px;">
    <h1 style="font-size: 24px; color: #1c1917; margin: 0 0 24px; font-weight: normal;">{title}</h1>
    <p style="color: #44403c; line-height: 1.6; margin: 0 0 16px;">{greeting}</p>
    <p style="color: #44403c; line-height: 1.6; margin: 0 0 32px;">{instruction}</p>
    <a href="{magic_link_url}" style="display: inline-block; background: #1c1917; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 14px;">{button_text}</a>
    <p style="color: #78716c; font-size: 13px; margin: 32px 0 8px;">{expiry_notice}</p>
    <p style="color: #a8a29e; font-size: 12px; margin: 0;">{ignore_notice}</p>
  </div>
</body>
</html>"#
        );

        (subject.to_string(), body)
    }
}
