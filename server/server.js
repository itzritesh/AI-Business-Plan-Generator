import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import pitchRoutes from './routes/pitchRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import validationRoutes from './routes/validationRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Console Logger middleware for developer observability
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/pitch', pitchRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/validation', validationRoutes);

// Base Check route
app.get('/', (req, res) => {
  res.json({ message: 'AI Business Plan Generator & Startup Coach API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5014;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-business-plan';

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
    
    app.listen(PORT, () => {
      console.log(`Server is running in development mode on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed! Please check if your MongoDB instance is running.');
    console.error(error.message);
    
    // In local dev we can attempt starting the server anyway, but standard practice is logging the crash
    console.log('Starting Express server without DB link for offline/mock sandbox testing...');
    app.listen(PORT, () => {
      console.log(`Offline sandbox server listening on port ${PORT}`);
    });
  }
};

startServer();
