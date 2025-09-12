import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Normalize the frontend URL by removing trailing slash
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');

// CORS configuration with multiple allowed origins and flexible handling
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        frontendUrl || 'https://taskhub-rose.vercel.app',
        'https://taskhub-rose.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173', // Vite dev server
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ];
      
      // Remove trailing slashes and check
      const normalizedOrigin = origin.replace(/\/$/, '');
      const isAllowed = allowedOrigins.some(allowed => {
        if (!allowed) return false;
        return allowed.replace(/\/$/, '') === normalizedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    credentials: true, // Enable if you need to send cookies/auth headers
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false
  })
);

// Morgan logging middleware
app.use(morgan("dev"));

// Handle preflight requests explicitly
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected successfully."))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

// Health check route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub API",
    status: "running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for monitoring
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: "ok",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use("/api-v1", routes);

// 404 Not Found middleware (must be after all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: "Not Found"
  });
});

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.error('Error Message:', err.message);
  
  // CORS error handling
  if (err.message && err.message.includes('not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: err.message
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      error: 'Resource already exists'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'Authentication failed'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${frontendUrl || 'Not set'}`);
});