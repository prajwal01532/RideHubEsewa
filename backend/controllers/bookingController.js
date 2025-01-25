import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import Bike from '../models/Bike.js';

// Get all bookings for a user
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings'
        });
    }
};

// Get a single booking
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking'
        });
    }
};

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { 
            vehicleId, 
            vehicleType, 
            startDate, 
            endDate, 
            requiresDriver, 
            message,
            totalAmount 
        } = req.body;

        // Find vehicle based on type
        const Model = vehicleType === 'car' ? Car : Bike;
        const vehicle = await Model.findById(vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            vehicle: vehicleId,
            vehicleType,
            vehicleName: vehicle.name,
            startDate,
            endDate,
            requiresDriver,
            message,
            totalAmount,
            paymentStatus: 'pending',
            status: 'pending'
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create booking'
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Only allow cancellation of pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel a non-pending booking'
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking'
        });
    }
};