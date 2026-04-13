const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration (safe + flexible)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tekni-4.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.app.github.dev') ||
      origin.endsWith('.preview.app.github.dev')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ✅ Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import Routes
const authRoutes = require('./routes/auth.routes');
const locationRoutes = require('./routes/location.routes');
const categoryRoutes = require('./routes/category.routes');
const listingRoutes = require('./routes/listing.routes');

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/listings', listingRoutes);

// ✅ Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Tekni API',
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 Handler (VERY IMPORTANT)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;