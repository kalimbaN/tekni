const express = require('express');
const cors = require('cors');
const { CLIENT_URL } = require('./config/env');

const app = express();

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Tekni API' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/technicians', require('./routes/technician.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/profile', require('./routes/profile.routes'));

// Error handler
const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);

module.exports = app;