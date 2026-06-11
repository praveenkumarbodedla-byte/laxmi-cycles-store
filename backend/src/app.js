const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const cycleRoutes = require('./routes/cycles');
const enquiryRoutes = require('./routes/enquiries');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect to MongoDB
connectDB();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://laxmicycles.vercel.app',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    // Check if it is a local localhost environment
    const isLocalhost = origin.startsWith('http://localhost') || 
                        origin.startsWith('http://127.0.0.1') ||
                        origin.startsWith('https://localhost') ||
                        origin.startsWith('https://127.0.0.1');

    // Check for standard private network IP ranges for local development connection
    const isPrivateIP = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);

    if (isLocalhost || isPrivateIP || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Request Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Laxmi Cycles API is running 🚀', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/cycles', cycleRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
