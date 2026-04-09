-- ============================================
-- DROP EXISTING TABLES (fresh start)
-- ============================================
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    user_type VARCHAR(50) CHECK (user_type IN ('commission_agent', 'service_provider', 'individual_seller', 'buyer')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER_ROLES TABLE (for admin team)
-- ============================================
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'regional_admin', 'content_moderator', 'customer_support', 'financial_admin', 'verification_officer', 'user')),
    assigned_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- USER_PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    bio TEXT,
    location_district VARCHAR(50),
    location_sector VARCHAR(50),
    avatar_url VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0,
    total_transactions INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INSERT DEFAULT SUPER ADMIN
-- ============================================
-- Note: Replace 'hashed_password_here' with actual bcrypt hash
INSERT INTO users (email, phone, password_hash, full_name, user_type, is_verified, is_active)
VALUES ('admin@tekni.com', '+250788888888', 'hashed_password_here', 'System Administrator', 'commission_agent', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Assign super admin role
INSERT INTO user_roles (user_id, role, assigned_by)
SELECT id, 'super_admin', id FROM users WHERE email = 'admin@tekni.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
SELECT '✅ Users table' as status, COUNT(*) as count FROM users
UNION ALL
SELECT '✅ User Roles table', COUNT(*) FROM user_roles
UNION ALL
SELECT '✅ User Profiles table', COUNT(*) FROM user_profiles
UNION ALL
SELECT '✅ Sessions table', COUNT(*) FROM sessions;