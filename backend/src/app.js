const express = require('express');
const cors = require('cors');
const { CLIENT_URL } = require('./config/env');
const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
// const technicianRoutes = require('./routes/technician.routes');
// const jobRoutes = require('./routes/job.routes');
// const paymentRoutes = require('./routes/payment.routes');
// const reviewRoutes = require('./routes/review.routes');
// const notificationRoutes = require('./routes/notification.routes');
// const adminRoutes = require('./routes/admin.routes');
// const profileRoutes = require('./routes/profile.routes');

const app = express();

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Tekni API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/technicians', technicianRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/profile', profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error middleware (must be last)
app.use(errorMiddleware);

module.exports = app;