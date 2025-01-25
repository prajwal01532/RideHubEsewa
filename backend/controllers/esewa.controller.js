import { EsewaPaymentGateway, EsewaCheckStatus } from 'esewajs';
import Booking from '../models/Booking.js';

const EsewaInitiatePayment = async (req, res) => {
  const { amount, bookingId } = req.body;
  try {
    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Convert both amounts to numbers for comparison
    const bookingAmount = parseFloat(booking.totalAmount);
    const requestAmount = parseFloat(amount);

    // Verify amount matches booking amount (with some tolerance for floating point)
    if (Math.abs(bookingAmount - requestAmount) > 0.01) {
      return res.status(400).json({ 
        success: false, 
        message: "Amount mismatch",
        expected: bookingAmount,
        received: requestAmount
      });
    }

    // Prepare eSewa parameters
    const params = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: bookingId,
      scd: process.env.MERCHANT_ID,
      su: process.env.SUCCESS_URL,
      fu: process.env.FAILURE_URL
    };

    // Create form data
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Redirect URL for eSewa payment
    const esewaUrl = process.env.ESEWAPAYMENT_URL + '?' + formData.toString();

    // Update booking status to pending payment
    booking.paymentStatus = 'pending';
    await booking.save();

    return res.status(200).json({
      success: true,
      url: esewaUrl
    });

  } catch (error) {
    console.error('Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const handlePaymentSuccess = async (req, res) => {
  const { oid, amt, refId } = req.query;
  
  try {
    // Find the booking
    const booking = await Booking.findById(oid);
    if (!booking) {
      console.error('Booking not found:', oid);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=booking_not_found`);
    }

    // Update booking status
    booking.paymentStatus = 'completed';
    booking.paymentReference = refId;
    booking.status = 'confirmed';
    await booking.save();

    // Redirect to success page
    return res.redirect(`${process.env.FRONTEND_URL}/payment/success?bookingId=${oid}`);

  } catch (error) {
    console.error('Success handler error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=server_error`);
  }
};

const handlePaymentFailure = async (req, res) => {
  const { oid } = req.query;
  
  try {
    // Find and update booking status
    const booking = await Booking.findById(oid);
    if (booking) {
      booking.paymentStatus = 'failed';
      await booking.save();
    }
    
    // Redirect to failure page
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=payment_failed`);
  } catch (error) {
    console.error('Failure handler error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=server_error`);
  }
};

export { EsewaInitiatePayment, handlePaymentSuccess, handlePaymentFailure };