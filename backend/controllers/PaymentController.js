import { PaymentService } from '../services/PaymentService.js';
import Payment from '../models/Payment.js';
import { Order } from '../models/order.js';

export const initiatePayment = async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    // Verify order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ 
        message: `Order not found. OrderId: ${orderId}, UserId: ${userId}. Make sure the order exists and belongs to the current user.` 
      });
    }

    // Verify amount matches order amount
    if (order.totalAmount !== amount) {
      return res.status(400).json({ message: 'Payment amount does not match order amount' });
    }

    let paymentResponse;
    switch (paymentMethod) {
      case 'COD':
        paymentResponse = await PaymentService.createCODPayment(orderId, userId, amount);
        break;
      case 'ESEWA':
        paymentResponse = await PaymentService.initiateEsewaPayment(orderId, userId, amount);
        break;
      case 'CARD':
        return res.status(400).json({ 
          message: 'For card payments, please use the /payment/card/process endpoint' 
        });
      default:
        return res.status(400).json({ message: 'Invalid payment method' });
    }

    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyEsewaPayment = async (req, res) => {
  const { oid, amt, refId } = req.query;

  if (!oid || !amt || !refId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const verificationResponse = await PaymentService.verifyEsewaTransaction(oid, amt, refId);
    res.status(200).json(verificationResponse);
  } catch (error) {
    console.error('eSewa Verification Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const processCardPayment = async (req, res) => {
  const { orderId, cardDetails } = req.body;
  const userId = req.user.id;

  try {
    // Validate card details
    if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryMonth || 
        !cardDetails.expiryYear || !cardDetails.cvv) {
      return res.status(400).json({ message: 'Invalid card details' });
    }

    // Get order details
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ 
        message: `Order not found. OrderId: ${orderId}, UserId: ${userId}. Make sure the order exists and belongs to the current user.` 
      });
    }

    // Add amount to card details
    cardDetails.amount = order.totalAmount;

    const paymentResponse = await PaymentService.processCardPayment(orderId, userId, cardDetails);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Card Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user.id;

  try {
    const payment = await Payment.findOne({ _id: paymentId, userId })
      .select('-paymentDetails.cardDetails')
      .populate('orderId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
        order: payment.orderId
      }
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({ message: error.message });
  }
};