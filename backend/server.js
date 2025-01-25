process.env.NODE_NO_WARNINGS = '1';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/authRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import carRoutes from './routes/carRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { verifyToken } from './middleware/auth.js';
import { EsewaInitiatePayment, handlePaymentSuccess, handlePaymentFailure } from './controllers/esewa.controller.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Mongoose
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// eSewa payment routes
app.post('/api/payments/initiate', verifyToken, EsewaInitiatePayment);
app.get('/api/payments/success', handlePaymentSuccess);
app.get('/api/payments/failure', handlePaymentFailure);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Check if port is in use before starting server
const server = app.listen(PORT)
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  })
  .on('listening', () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
