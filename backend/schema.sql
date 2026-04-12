-- ============================================
-- TEKNI PLATFORM - COMPLETE WORKING SCHEMA
-- Copy this entire file and run it
-- ============================================

-- Drop everything in correct order
DROP TABLE IF EXISTS ad_clicks CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS business_profiles CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS fulfillments CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS listing_responses CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS category_pricing CASCADE;
DROP TABLE IF EXISTS category_rules CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS main_categories CASCADE;
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS daily_analytics CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS email_verifications CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('commission_agent', 'service_provider', 'individual_seller', 'buyer')),
    province_id INT,
    district_id INT,
    sector_id INT,
    village_id INT,
    location_details TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    login_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'regional_admin', 'content_moderator', 'customer_support', 'financial_admin', 'verification_officer', 'user')),
    assigned_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, role)
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    cover_image_url VARCHAR(255),
    professional_title VARCHAR(100),
    years_experience DECIMAL(3,1),
    hourly_rate DECIMAL(10,2),
    service_radius_km INT,
    services_offered TEXT[],
    business_name VARCHAR(255),
    business_registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    province_id INT,
    district_id INT,
    sector_id INT,
    village_id INT,
    location_details TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    total_transactions INT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    response_rate INT DEFAULT 0,
    response_time_hours INT DEFAULT 0,
    id_card_url VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP,
    notification_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(3) DEFAULT 'RWF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    device_info TEXT,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- LOCATION HIERARCHY
-- ============================================

CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    name_fr VARCHAR(100),
    code VARCHAR(10) UNIQUE,
    capital VARCHAR(100),
    area_km2 DECIMAL(10,2),
    population INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    province_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    code VARCHAR(10) UNIQUE,
    capital VARCHAR(100),
    area_km2 DECIMAL(10,2),
    population INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
    UNIQUE(province_id, name)
);

CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    code VARCHAR(10),
    area_km2 DECIMAL(10,2),
    population INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    UNIQUE(district_id, name)
);

CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    sector_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    UNIQUE(sector_id, name)
);

-- ============================================
-- CATEGORIES & PRICING
-- ============================================

CREATE TABLE main_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    cover_image VARCHAR(255),
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    main_category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (main_category_id) REFERENCES main_categories(id) ON DELETE CASCADE,
    UNIQUE(main_category_id, slug)
);

CREATE TABLE category_rules (
    id SERIAL PRIMARY KEY,
    main_category_id INT NOT NULL,
    subcategory_id INT,
    auto_close_trigger VARCHAR(50) NOT NULL CHECK (auto_close_trigger IN ('item_sold', 'max_applicants', 'slots_full', 'time_limit', 'service_accepted', 'response_timeout')),
    auto_close_value INT,
    success_criteria VARCHAR(50) NOT NULL CHECK (success_criteria IN ('item_sold', 'job_filled', 'booking_made', 'service_completed', 'tender_awarded', 'position_filled', 'project_completed')),
    requires_fulfillment_confirmation BOOLEAN DEFAULT TRUE,
    fulfillment_deadline_days INT,
    max_responses_allowed INT,
    response_timeout_hours INT,
    default_duration_days INT NOT NULL,
    max_duration_days INT,
    allows_featured BOOLEAN DEFAULT TRUE,
    allows_urgent BOOLEAN DEFAULT TRUE,
    allows_top_placement BOOLEAN DEFAULT TRUE,
    commission_percentage DECIMAL(5,2) DEFAULT 0,
    commission_fixed DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (main_category_id) REFERENCES main_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    UNIQUE(main_category_id, subcategory_id)
);

CREATE TABLE category_pricing (
    id SERIAL PRIMARY KEY,
    main_category_id INT,
    subcategory_id INT,
    pricing_type VARCHAR(50) NOT NULL CHECK (pricing_type IN ('listing_fee', 'lead_fee', 'premium_visibility', 'commission')),
    fee_amount DECIMAL(10,2) NOT NULL,
    duration_days INT,
    is_optional BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (main_category_id) REFERENCES main_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ============================================
-- LISTINGS & RESPONSES
-- ============================================

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    main_category_id INT NOT NULL,
    subcategory_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images TEXT[],
    videos TEXT[],
    documents TEXT[],
    custom_fields JSONB DEFAULT '{}',
    province_id INT NOT NULL,
    district_id INT NOT NULL,
    sector_id INT,
    village_id INT,
    location_details TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    service_radius_km INT,
    duration_days INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    auto_close_at TIMESTAMP,
    response_deadline TIMESTAMP,
    max_responses INT,
    current_responses INT DEFAULT 0,
    max_leads INT,
    current_leads INT DEFAULT 0,
    price DECIMAL(10,2),
    negotiable BOOLEAN DEFAULT FALSE,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    assigned_to INT,
    completed_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'active', 'pending_closure', 'fulfilled', 'expired', 'cancelled', 'closed_auto')),
    fulfillment_status VARCHAR(50) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'confirmed', 'failed', 'not_applicable')),
    fulfilled_at TIMESTAMP,
    fulfillment_confirmed_by INT,
    success_outcome VARCHAR(100),
    success_value DECIMAL(10,2),
    visibility_level VARCHAR(50) DEFAULT 'basic' CHECK (visibility_level IN ('basic', 'featured', 'top_placement', 'urgent')),
    featured_expires_at TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    is_top_placement BOOLEAN DEFAULT FALSE,
    has_urgent_badge BOOLEAN DEFAULT FALSE,
    listing_fee_paid BOOLEAN DEFAULT FALSE,
    listing_fee_amount DECIMAL(10,2),
    premium_fees JSONB,
    total_paid DECIMAL(10,2),
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    flagged_count INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (main_category_id) REFERENCES main_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (sector_id) REFERENCES sectors(id),
    FOREIGN KEY (village_id) REFERENCES villages(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (fulfillment_confirmed_by) REFERENCES users(id)
);

CREATE TABLE listing_responses (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    responder_id INT NOT NULL,
    message TEXT,
    proposed_price DECIMAL(10,2),
    proposed_date DATE,
    custom_data JSONB,
    attachments TEXT[],
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn', 'completed', 'cancelled')),
    contact_unlocked BOOLEAN DEFAULT FALSE,
    contact_unlocked_at TIMESTAMP,
    messages_exchanged INT DEFAULT 0,
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    rating_given BOOLEAN DEFAULT FALSE,
    rating_value INT,
    rating_review TEXT,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES users(id)
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    lead_fee_paid BOOLEAN DEFAULT FALSE,
    lead_fee_amount DECIMAL(10,2),
    provider_contact TEXT,
    contact_unlocked_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contact_unlocked', 'refunded', 'completed', 'expired')),
    is_refunded BOOLEAN DEFAULT FALSE,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    refunded_by INT,
    message_exchanged BOOLEAN DEFAULT FALSE,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (refunded_by) REFERENCES users(id)
);

CREATE TABLE fulfillments (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    response_id INT,
    lead_id INT,
    fulfillment_type VARCHAR(50) NOT NULL CHECK (fulfillment_type IN ('item_sold', 'job_filled', 'booking_made', 'service_completed', 'tender_awarded', 'position_filled', 'project_completed')),
    evidence TEXT,
    evidence_images TEXT[],
    evidence_documents TEXT[],
    final_amount DECIMAL(10,2),
    tekni_commission DECIMAL(10,2),
    commission_rate DECIMAL(5,2),
    payout_amount DECIMAL(10,2),
    payout_status VARCHAR(50) DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
    status VARCHAR(50) DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'disputed', 'cancelled')),
    verified_by INT,
    verified_at TIMESTAMP,
    verification_notes TEXT,
    is_disputed BOOLEAN DEFAULT FALSE,
    dispute_reason TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (response_id) REFERENCES listing_responses(id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- ============================================
-- PAYMENTS & FINANCIALS
-- ============================================

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    listing_id INT,
    lead_id INT,
    fulfillment_id INT,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('listing_fee', 'lead_fee', 'premium_boost', 'commission', 'payout', 'refund', 'subscription')),
    amount DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card', 'mobile_money', 'bank_transfer', 'cash', 'wallet')),
    payment_reference VARCHAR(255),
    payment_provider VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    metadata JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (fulfillment_id) REFERENCES fulfillments(id)
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    pending_balance DECIMAL(10,2) DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'RWF',
    is_active BOOLEAN DEFAULT TRUE,
    last_transaction_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INT NOT NULL,
    transaction_id INT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credit', 'debit', 'hold', 'release')),
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2),
    balance_after DECIMAL(10,2),
    description TEXT,
    reference VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    wallet_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bank_transfer', 'mobile_money', 'paypal')),
    account_details JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    processed_by INT,
    processed_at TIMESTAMP,
    rejection_reason TEXT,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- ============================================
-- REVIEWS & NOTIFICATIONS
-- ============================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    listing_id INT,
    response_id INT,
    fulfillment_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    response_text TEXT,
    responded_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'flagged', 'hidden', 'deleted')),
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewee_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (response_id) REFERENCES listing_responses(id),
    FOREIGN KEY (fulfillment_id) REFERENCES fulfillments(id),
    UNIQUE(reviewer_id, reviewee_id, listing_id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_response', 'response_accepted', 'listing_closed', 'payment_received', 'lead_unlocked', 'fulfillment_verified', 'system_alert', 'promotion')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    action_url VARCHAR(500),
    image_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SYSTEM TABLES
-- ============================================

CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_user_id INT,
    reported_listing_id INT,
    reported_review_id INT,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    evidence TEXT[],
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    resolved_by INT,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (reported_listing_id) REFERENCES listings(id),
    FOREIGN KEY (reported_review_id) REFERENCES reviews(id),
    FOREIGN KEY (resolved_by) REFERENCES users(id)
);

CREATE TABLE daily_analytics (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    new_users INT DEFAULT 0,
    active_users INT DEFAULT 0,
    verified_users INT DEFAULT 0,
    new_listings INT DEFAULT 0,
    active_listings INT DEFAULT 0,
    completed_listings INT DEFAULT 0,
    total_transactions INT DEFAULT 0,
    total_volume DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) DEFAULT 0,
    total_leads INT DEFAULT 0,
    paid_leads INT DEFAULT 0,
    ad_impressions INT DEFAULT 0,
    ad_clicks INT DEFAULT 0,
    ad_revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(main_category_id, subcategory_id);
CREATE INDEX idx_responses_listing ON listing_responses(listing_id);
CREATE INDEX idx_responses_responder ON listing_responses(responder_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================

INSERT INTO provinces (name, name_fr, code) VALUES
('Kigali City', 'Ville de Kigali', 'KG'),
('Southern Province', 'Province du Sud', 'SO'),
('Western Province', 'Province de l''Ouest', 'OU'),
('Northern Province', 'Province du Nord', 'NO'),
('Eastern Province', 'Province de l''Est', 'ES')
ON CONFLICT (name) DO NOTHING;

-- Insert default super admin (CHANGE THIS PASSWORD HASH!)
INSERT INTO users (email, phone, password_hash, full_name, user_type, is_verified, is_active)
VALUES ('admin@tekni.com', '+250788888888', '$2b$10$YourHashedPasswordHere', 'System Administrator', 'commission_agent', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role, assigned_by)
SELECT id, 'super_admin', id FROM users WHERE email = 'admin@tekni.com'
ON CONFLICT DO NOTHING;

INSERT INTO main_categories (name, slug, icon, display_order, is_featured) VALUES
('Services', 'services', '🔧', 1, true),
('Used Items', 'used-items', '📱', 2, true),
('Properties', 'properties', '🏠', 3, true),
('Tenders', 'tenders', '📢', 4, false),
('Jobs', 'jobs', '💼', 5, true),
('Event Spaces', 'event-spaces', '🎉', 6, false),
('Volunteers', 'volunteers', '🤝', 7, false),
('Artists & Creators', 'artists', '🎨', 8, false),
('Business Profiles & Ads', 'business', '📣', 9, false)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- DONE
-- ============================================
SELECT '✅ Database schema created successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as provinces FROM provinces;
SELECT COUNT(*) as categories FROM main_categories;

