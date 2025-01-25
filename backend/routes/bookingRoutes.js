import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';
import { EsewaInitiatePayment, handlePaymentSuccess, handlePaymentFailure } from '../controllers/esewa.controller.js';

const router = express.Router();

// Get all bookings for a user
router.get('/', verifyToken, bookingController.getBookings);

// Get a single booking
router.get('/:id', verifyToken, bookingController.getBooking);

// Create a new booking
router.post('/', verifyToken, bookingController.createBooking);

// Cancel booking
router.patch('/:id/cancel', verifyToken, bookingController.cancelBooking);

// Payment routes
router.post('/payments/initiate', verifyToken, EsewaInitiatePayment);
router.get('/payments/success', handlePaymentSuccess);
router.get('/payments/failure', handlePaymentFailure);

export default router;