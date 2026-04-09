const { query, transaction } = require('../config/db');

const UserModel = {
  // Create a new user
  create: async (userData) => {
    const { email, phone, password_hash, full_name, user_type } = userData;
    const result = await query(
      `INSERT INTO users (email, phone, password_hash, full_name, user_type, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, phone, full_name, user_type, is_verified, created_at`,
      [email, phone, password_hash, full_name, user_type, false, true]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // Find user by phone
  findByPhone: async (phone) => {
    const result = await query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await query(
      `SELECT id, email, phone, full_name, user_type, is_verified, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update user
  update: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, phone, full_name, user_type, is_verified`,
      [id, ...values]
    );
    return result.rows[0];
  },

  // Delete user (soft delete - set inactive)
  delete: async (id) => {
    const result = await query(
      `UPDATE users SET is_active = false, updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    return result.rows[0];
  },

  // Get user with roles
  findWithRoles: async (email) => {
    const result = await query(
      `SELECT u.*, 
              COALESCE(ARRAY_AGG(r.role) FILTER (WHERE r.role IS NOT NULL), ARRAY[]::text[]) as roles
       FROM users u
       LEFT JOIN user_roles r ON u.id = r.user_id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email]
    );
    return result.rows[0];
  },

  // Assign role to user (FIXED - removed ON CONFLICT)
  assignRole: async (userId, role, assignedBy) => {
    // First check if role already exists
    const check = await query(
      `SELECT * FROM user_roles WHERE user_id = $1 AND role = $2`,
      [userId, role]
    );
    
    if (check.rows.length > 0) {
      return check.rows[0]; // Role already assigned
    }
    
    const result = await query(
      `INSERT INTO user_roles (user_id, role, assigned_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, role, assignedBy]
    );
    return result.rows[0];
  },

  // Get all users (with pagination)
  findAll: async (limit = 50, offset = 0) => {
    const result = await query(
      `SELECT id, email, phone, full_name, user_type, is_verified, is_active, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },
};

module.exports = UserModel;