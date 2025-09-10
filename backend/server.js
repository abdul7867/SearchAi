import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestTracker } from './middleware/requestTracker.js';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';
import userRoutes from './routes/users.js';
import historyRoutes from './routes/history.js';
import collectionRoutes from './routes/collections.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.log('⚠️ Running in development mode without all required env vars');
  }
}

console.log('🔧 Environment Configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT || 5000);
console.log('- CORS_ORIGIN:', process.env.CORS_ORIGIN || 'Not set');
console.log('- MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('- JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('- Gemini API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Enhanced CORS configuration
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
                     (origin && origin.match(/^https:\/\/perpexclone.*\.vercel\.app$/));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      console.log('✅ Vercel pattern allowed: https://perpexclone*.vercel.app');
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
app.use('/api/', limiter);

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
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    message: 'AI Search Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: 'Connected', // Will be updated based on actual connection
      cors: process.env.CORS_ORIGIN ? 'Configured' : 'Default',
      gemini: process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'
    }
  };
  
  res.status(200).json(healthCheck);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/collections', collectionRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const dbConnection = await connectDB();
    if (dbConnection) {
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️ MongoDB connection failed, running in test mode');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      if (!dbConnection) {
        console.log('🔧 Note: Some features may not work without database connection');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
