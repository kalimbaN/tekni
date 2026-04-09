require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('❌ Cannot start server: Database connection failed');
      process.exit(1);
    }

    // Start server - CRITICAL: Bind to '0.0.0.0' for Render deployment
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();