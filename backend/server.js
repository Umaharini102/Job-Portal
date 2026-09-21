const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
// Parses single or comma-separated CLIENT_URL values and strips trailing slashes
const rawClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim()).filter(Boolean)
  : [];

const localOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://job-portal-gin9yb0ra-umaharini102.vercel.app',
];

const normalizedAllowedOrigins = [...localOrigins, ...rawClientUrls].map((url) =>
  url.replace(/\/+$/, '')
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');

      // Check exact match in configured allowed origins
      if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Automatically permit any Vercel deployment preview or production domain
      if (
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin.includes('umaharini102') ||
        normalizedOrigin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      // In non-production environments or if CLIENT_URL is set to '*', permit origin
      if (process.env.NODE_ENV !== 'production' || process.env.CLIENT_URL === '*') {
        return callback(null, true);
      }

      // Allow preview / branch subdomains if the root domain is configured
      const isAllowedDomain = rawClientUrls.some((allowed) => {
        try {
          const allowedHost = new URL(allowed).hostname;
          const originHost = new URL(origin).hostname;
          return originHost === allowedHost || originHost.endsWith(`.${allowedHost}`);
        } catch {
          return false;
        }
      });

      if (isAllowedDomain) {
        return callback(null, true);
      }

      console.warn(`[CORS Blocked] Origin "${origin}" is not in the allowed list:`, normalizedAllowedOrigins);
      return callback(new Error(`CORS policy: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint
app.get('/', (req, res) => {
  const mongoose = require('mongoose');
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    message: 'JobConnect REST API Server is online',
    database: dbState,
    health: '/api/health',
    companies: '/api/companies',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    status: 'healthy',
    database: dbState,
    timestamp: new Date().toISOString(),
    service: 'JobConnect API',
  });
});

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[JobConnect Server] running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
