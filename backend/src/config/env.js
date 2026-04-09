require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Mobile Money (to be added later)
  MTN_API_KEY: process.env.MTN_API_KEY,
  AIRTEL_API_KEY: process.env.AIRTEL_API_KEY,
};