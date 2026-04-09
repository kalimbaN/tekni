const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'tekni_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tekni_db',
  max: 20,              // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  logger.info('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
  process.exit(-1);
});

// Test function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now');
    logger.info(`📅 Database time: ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Query helper (with error handling)
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Executed query: ${text} - Duration: ${duration}ms`);
    return result;
  } catch (err) {
    logger.error(`Query error: ${err.message}`);
    logger.error(`Failed query: ${text}`);
    throw err;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
};