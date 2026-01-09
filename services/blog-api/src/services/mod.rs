pub mod db;
pub mod stripe;
pub mod resend;
pub mod email;

pub use db::DbPool;

use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<DbPool>,
}

impl AppState {
    pub fn new() -> Self {
        let pool = db::establish_pool();
        Self {
            db: Arc::new(pool),
        }
    }
}
