// server.js
// Entry point for the backend API server. Loads routes and error handlers.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());             // Allow frontend to call
app.use(express.json());     // Parse JSON bodies

// Routes
const couponsRoutes = require('./routes/coupons');
app.use('/api/coupons', couponsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Simple error handler - returns JSON with message
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Coupon backend listening on port ${PORT}`);
});
