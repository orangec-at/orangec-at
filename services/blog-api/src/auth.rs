use axum::http::{HeaderMap, HeaderValue};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SupabaseClaims {
    pub sub: String,
    pub email: Option<String>,
    pub role: Option<String>,
    pub exp: usize,
    pub iat: Option<usize>,
}

#[derive(thiserror::Error, Debug)]
pub enum AuthError {
    #[error("missing Authorization header")]
    MissingAuthorization,

    #[error("invalid Authorization header")]
    InvalidAuthorization,

    #[error("missing SUPABASE_JWT_SECRET")]
    MissingJwtSecret,

    #[error("invalid token")]
    InvalidToken,
}

pub fn bearer_token(headers: &HeaderMap) -> Result<String, AuthError> {
    let value: &HeaderValue = headers
        .get(axum::http::header::AUTHORIZATION)
        .ok_or(AuthError::MissingAuthorization)?;

    let value = value.to_str().map_err(|_| AuthError::InvalidAuthorization)?;
    let value = value.trim();

    let Some(rest) = value.strip_prefix("Bearer ") else {
        return Err(AuthError::InvalidAuthorization);
    };

    let token = rest.trim();
    if token.is_empty() {
        return Err(AuthError::InvalidAuthorization);
    }

    Ok(token.to_string())
}

pub fn verify_supabase_jwt(token: &str) -> Result<SupabaseClaims, AuthError> {
    let secret = std::env::var("SUPABASE_JWT_SECRET").map_err(|_| AuthError::MissingJwtSecret)?;

    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;

    let data = decode::<SupabaseClaims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map_err(|_| AuthError::InvalidToken)?;

    Ok(data.claims)
}

#[derive(thiserror::Error, Debug)]
pub enum InternalAuthError {
    #[error("missing INTERNAL_API_KEY")]
    MissingConfig,

    #[error("missing internal api key")]
    MissingKey,

    #[error("invalid internal api key")]
    InvalidKey,
}

pub fn verify_internal_api_key(headers: &HeaderMap) -> Result<(), InternalAuthError> {
    let expected = std::env::var("INTERNAL_API_KEY").map_err(|_| InternalAuthError::MissingConfig)?;

    let value: &HeaderValue = headers
        .get("x-internal-api-key")
        .ok_or(InternalAuthError::MissingKey)?;

    let value = value.to_str().map_err(|_| InternalAuthError::InvalidKey)?;

    if value != expected {
        return Err(InternalAuthError::InvalidKey);
    }

    Ok(())
}
