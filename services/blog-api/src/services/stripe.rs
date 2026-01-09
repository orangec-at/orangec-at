use stripe::{
    CheckoutSession, CheckoutSessionMode, Client, CreateCheckoutSession, CreateCheckoutSessionLineItems,
    CreateCheckoutSessionLineItemsPriceData, CreateCheckoutSessionLineItemsPriceDataProductData,
    CreateCheckoutSessionLineItemsPriceDataRecurring, CreateCheckoutSessionLineItemsPriceDataRecurringInterval,
    Currency,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCheckoutSessionParams {
    pub customer_email: String,
    pub user_id: String,
    pub product_id: String,
    pub product_name: String,
    pub unit_amount: i64,
    pub success_url: String,
    pub cancel_url: String,
    pub is_subscription: bool,
}

pub async fn create_checkout_session(params: CreateCheckoutSessionParams) -> Result<String, anyhow::Error> {
    let stripe_key = std::env::var("STRIPE_SECRET_KEY")
        .map_err(|_| anyhow::anyhow!("STRIPE_SECRET_KEY not set"))?;

    let client = Client::new(stripe_key);

    let mut session_params = CreateCheckoutSession::new();
    session_params.customer_email = Some(&params.customer_email);
    session_params.success_url = Some(&params.success_url);
    session_params.cancel_url = Some(&params.cancel_url);
    session_params.mode = Some(if params.is_subscription {
        CheckoutSessionMode::Subscription
    } else {
        CheckoutSessionMode::Payment
    });

    let mut metadata: HashMap<String, String> = HashMap::new();
    metadata.insert("userId".to_string(), params.user_id);
    metadata.insert("productId".to_string(), params.product_id);
    session_params.metadata = Some(metadata);

    let recurring = if params.is_subscription {
        Some(CreateCheckoutSessionLineItemsPriceDataRecurring {
            interval: CreateCheckoutSessionLineItemsPriceDataRecurringInterval::Month,
            interval_count: None,
        })
    } else {
        None
    };

    let line_item = CreateCheckoutSessionLineItems {
        quantity: Some(1),
        price_data: Some(CreateCheckoutSessionLineItemsPriceData {
            currency: Currency::USD,
            product: None,
            product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                description: None,
                images: None,
                metadata: None,
                name: params.product_name,
                tax_code: None,
            }),
            recurring,
            tax_behavior: None,
            unit_amount: Some(params.unit_amount),
            unit_amount_decimal: None,
        }),
        ..Default::default()
    };

    session_params.line_items = Some(vec![line_item]);

    let session = CheckoutSession::create(&client, session_params).await?;
    let url = session
        .url
        .ok_or_else(|| anyhow::anyhow!("Stripe session missing url"))?;

    Ok(url)
}
