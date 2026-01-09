use bigdecimal::BigDecimal;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};

use crate::schema::*;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::Role"]
pub enum Role {
    #[db_rename = "USER"]
    USER,
    #[db_rename = "ADMIN"]
    ADMIN,
}

impl Default for Role {
    fn default() -> Self {
        Role::USER
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::NewsletterStatus"]
pub enum NewsletterStatus {
    #[db_rename = "PENDING"]
    PENDING,
    #[db_rename = "ACTIVE"]
    ACTIVE,
    #[db_rename = "UNSUBSCRIBED"]
    UNSUBSCRIBED,
}

impl Default for NewsletterStatus {
    fn default() -> Self {
        NewsletterStatus::PENDING
    }
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub email_verified: Option<NaiveDateTime>,
    pub image: Option<String>,
    pub role: Role,
    pub ink_points: i32,
    pub terms_accepted_at: Option<NaiveDateTime>,
    pub onboarding_completed_at: Option<NaiveDateTime>,
    pub newsletter_opt_in_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub id: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Role,
    pub ink_points: i32,
}

#[derive(Debug, AsChangeset)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub name: Option<String>,
    pub ink_points: Option<i32>,
    pub terms_accepted_at: Option<NaiveDateTime>,
    pub onboarding_completed_at: Option<NaiveDateTime>,
    pub newsletter_opt_in_at: Option<Option<NaiveDateTime>>,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = newsletter_subscriptions)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct NewsletterSubscription {
    pub id: String,
    pub email: String,
    pub status: NewsletterStatus,
    pub user_id: Option<String>,
    pub confirm_token_hash: Option<String>,
    pub unsubscribe_token_hash: Option<String>,
    pub confirmed_at: Option<NaiveDateTime>,
    pub unsubscribed_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = newsletter_subscriptions)]
pub struct NewNewsletterSubscription {
    pub id: String,
    pub email: String,
    pub status: NewsletterStatus,
    pub user_id: Option<String>,
    pub confirm_token_hash: Option<String>,
    pub unsubscribe_token_hash: Option<String>,
}

#[derive(Debug, AsChangeset)]
#[diesel(table_name = newsletter_subscriptions)]
pub struct UpdateNewsletterSubscription {
    pub status: Option<NewsletterStatus>,
    pub user_id: Option<Option<String>>,
    pub confirm_token_hash: Option<Option<String>>,
    pub unsubscribe_token_hash: Option<Option<String>>,
    pub confirmed_at: Option<Option<NaiveDateTime>>,
    pub unsubscribed_at: Option<Option<NaiveDateTime>>,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = threads)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Thread {
    pub id: String,
    pub title: Option<String>,
    pub user_id: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = threads)]
pub struct NewThread {
    pub id: String,
    pub title: Option<String>,
    pub user_id: Option<String>,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = messages)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Message {
    pub id: String,
    pub thread_id: String,
    pub role: String,
    pub content: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = messages)]
pub struct NewMessage {
    pub id: String,
    pub thread_id: String,
    pub role: String,
    pub content: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = products)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: BigDecimal,
    pub point_price: i32,
    pub image: Option<String>,
    pub category: String,
    pub is_rare: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = orders)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Order {
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub status: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = orders)]
pub struct NewOrder {
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub status: String,
}

#[derive(Debug, Queryable, Selectable, Serialize)]
#[diesel(table_name = marginalia)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Marginalia {
    pub id: String,
    pub content: String,
    pub tags: Vec<String>,
    pub user_id: String,
    pub likes: i32,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = marginalia)]
pub struct NewMarginalia {
    pub id: String,
    pub content: String,
    pub tags: Vec<String>,
    pub user_id: String,
}
