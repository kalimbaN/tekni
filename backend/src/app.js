const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./utils/logger');
import locationRoutes from './routes/location.routes.js';

// Import routes
const authRoutes = require('./routes/auth.routes');

const app = express();

// CORS configuration - allow multiple origins including Codespaces
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tekni-4.onrender.com',
  /\.app\.github\.dev$/,      // Allows all Codespaces URLs
  /\.preview\.app\.github\.dev$/  // Allows preview URLs
];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this after your auth routes
app.use('/api/locations', locationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Tekni API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error middleware (must be last)
app.use(errorMiddleware);

module.exports = app;