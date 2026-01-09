diesel::table! {
    #[sql_name = "User"]
    users (id) {
        id -> Text,
        name -> Nullable<Text>,
        email -> Nullable<Text>,
        #[sql_name = "emailVerified"]
        email_verified -> Nullable<Timestamp>,
        image -> Nullable<Text>,
        role -> Text,
        #[sql_name = "inkPoints"]
        ink_points -> Int4,
        #[sql_name = "termsAcceptedAt"]
        terms_accepted_at -> Nullable<Timestamp>,
        #[sql_name = "onboardingCompletedAt"]
        onboarding_completed_at -> Nullable<Timestamp>,
        #[sql_name = "newsletterOptInAt"]
        newsletter_opt_in_at -> Nullable<Timestamp>,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
        #[sql_name = "updatedAt"]
        updated_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Account"]
    accounts (id) {
        id -> Text,
        #[sql_name = "userId"]
        user_id -> Text,
        #[sql_name = "type"]
        type_ -> Text,
        provider -> Text,
        #[sql_name = "providerAccountId"]
        provider_account_id -> Text,
        refresh_token -> Nullable<Text>,
        access_token -> Nullable<Text>,
        expires_at -> Nullable<Int4>,
        token_type -> Nullable<Text>,
        scope -> Nullable<Text>,
        id_token -> Nullable<Text>,
        session_state -> Nullable<Text>,
    }
}

diesel::table! {
    #[sql_name = "Session"]
    sessions (id) {
        id -> Text,
        #[sql_name = "sessionToken"]
        session_token -> Text,
        #[sql_name = "userId"]
        user_id -> Text,
        expires -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "VerificationToken"]
    verification_tokens (identifier, token) {
        identifier -> Text,
        token -> Text,
        expires -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Thread"]
    threads (id) {
        id -> Text,
        title -> Nullable<Text>,
        #[sql_name = "userId"]
        user_id -> Nullable<Text>,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
        #[sql_name = "updatedAt"]
        updated_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Message"]
    messages (id) {
        id -> Text,
        #[sql_name = "threadId"]
        thread_id -> Text,
        role -> Text,
        content -> Text,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Product"]
    products (id) {
        id -> Text,
        name -> Text,
        description -> Text,
        price -> Numeric,
        #[sql_name = "pointPrice"]
        point_price -> Int4,
        image -> Nullable<Text>,
        category -> Text,
        #[sql_name = "isRare"]
        is_rare -> Bool,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
        #[sql_name = "updatedAt"]
        updated_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Order"]
    orders (id) {
        id -> Text,
        #[sql_name = "userId"]
        user_id -> Text,
        #[sql_name = "productId"]
        product_id -> Text,
        status -> Text,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Marginalia"]
    marginalia (id) {
        id -> Text,
        content -> Text,
        tags -> Array<Text>,
        #[sql_name = "userId"]
        user_id -> Text,
        likes -> Int4,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "Embedding"]
    embeddings (id) {
        id -> Text,
        slug -> Text,
        content -> Text,
        metadata -> Jsonb,
        locale -> Text,
        #[sql_name = "contentType"]
        content_type -> Text,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "NewsletterSubscription"]
    newsletter_subscriptions (id) {
        id -> Text,
        email -> Text,
        status -> Text,
        #[sql_name = "userId"]
        user_id -> Nullable<Text>,
        #[sql_name = "confirmTokenHash"]
        confirm_token_hash -> Nullable<Text>,
        #[sql_name = "unsubscribeTokenHash"]
        unsubscribe_token_hash -> Nullable<Text>,
        #[sql_name = "confirmedAt"]
        confirmed_at -> Nullable<Timestamp>,
        #[sql_name = "unsubscribedAt"]
        unsubscribed_at -> Nullable<Timestamp>,
        #[sql_name = "createdAt"]
        created_at -> Timestamp,
        #[sql_name = "updatedAt"]
        updated_at -> Timestamp,
    }
}

diesel::joinable!(accounts -> users (user_id));
diesel::joinable!(sessions -> users (user_id));
diesel::joinable!(threads -> users (user_id));
diesel::joinable!(messages -> threads (thread_id));
diesel::joinable!(orders -> users (user_id));
diesel::joinable!(orders -> products (product_id));
diesel::joinable!(marginalia -> users (user_id));
diesel::joinable!(newsletter_subscriptions -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    users,
    accounts,
    sessions,
    verification_tokens,
    threads,
    messages,
    products,
    orders,
    marginalia,
    embeddings,
    newsletter_subscriptions,
);
