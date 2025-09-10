import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { requestTracker } from '../middleware/requestTracker.js';
import authRoutes from '../routes/auth.js';
import searchRoutes from '../routes/search.js';
import userRoutes from '../routes/users.js';
import historyRoutes from '../routes/history.js';
import collectionRoutes from '../routes/collections.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Running in production mode with missing env vars - some features may not work');
  } else {
    console.log('⚠️ Running in development mode without all required env vars');
  }
}

const app = express();

// Security middleware
app.use(helmet());

// Enhanced CORS configuration for Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173'
    ].filter(Boolean); // Remove any undefined values
    
    // Check if origin matches allowed origins or Vercel preview deployments
    const isAllowed = allowedOrigins.includes(origin) || 
                     (origin && origin.match(/^https:\/\/.*\.vercel\.app$/));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      console.log('✅ Vercel pattern allowed: https://*.vercel.app');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request tracking middleware (must be before routes)
app.use(requestTracker);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Search Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      search: '/api/search',
      users: '/api/users',
      history: '/api/history',
      collections: '/api/collections'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    message: 'AI Search Backend is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    services: {
      database: 'Connected', // Will be updated based on actual connection
      cors: process.env.CORS_ORIGIN ? 'Configured' : 'Default',
      gemini: process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'
    }
  };
  
  res.status(200).json(healthCheck);
});

// API routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/users', userRoutes);
app.use('/history', historyRoutes);
app.use('/collections', collectionRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database connection
let dbConnected = false;
const initializeDatabase = async () => {
  try {
    const dbConnection = await connectDB();
    if (dbConnection) {
      console.log('✅ MongoDB connected successfully');
      dbConnected = true;
    } else {
      console.log('⚠️ MongoDB connection failed, running in test mode');
    }
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
  }
};

// Initialize database on first request
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await initializeDatabase();
  }
  next();
});

// Export the Express app for Vercel
export default app;