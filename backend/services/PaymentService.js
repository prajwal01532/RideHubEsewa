import Payment from '../models/Payment.js';
import axios from 'axios';
import crypto from 'crypto';
import { Order } from '../models/order.js';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class PaymentService {
  // COD Payment
  static async createCODPayment(orderId, userId, amount) {
    try {
      await Order.findByIdAndUpdate(orderId, { status: 'Processing' });

      const payment = new Payment({
        orderId,
        userId,
        amount,
        paymentMethod: 'COD',
        status: 'PENDING',
        paymentDetails: {
          initiatedAt: new Date(),
          deliveryNote: 'Cash to be collected on delivery'
        }
      });

      await payment.save();
      return { success: true, paymentId: payment._id };
    } catch (error) {
      throw new Error(`COD payment creation failed: ${error.message}`);
    }
  }

  // eSewa Payment
  static async initiateEsewaPayment(orderId, userId, amount) {
    try {
      const transactionId = crypto.randomBytes(16).toString('hex');
      
      const payment = new Payment({
        orderId,
        userId,
        amount,
        paymentMethod: 'ESEWA',
        status: 'PENDING',
        transactionId,
        paymentDetails: {
          initiatedAt: new Date()
        }
      });

      await payment.save();

      // Generate signature for eSewa API v2
      const signatureString = `total_amount=${amount},transaction_uuid=${transactionId},product_code=EPAYTEST`;
      const signature = crypto
        .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(signatureString)
        .digest('base64');

      // eSewa payment parameters for API v2
      const esewaParams = {
        amount: amount,
        failure_url: `${process.env.FRONTEND_URL}/payment/failure`,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        tax_amount: "0",
        total_amount: amount,
        transaction_uuid: transactionId
      };

      return {
        success: true,
        paymentId: payment._id,
        transactionId,
        esewaParams,
        redirectUrl: process.env.ESEWA_PAYMENT_URL
      };
    } catch (error) {
      throw new Error(`eSewa payment initiation failed: ${error.message}`);
    }
  }

  // Card Payment
  static async processCardPayment(orderId, userId, cardDetails) {
    try {
      const currentDate = new Date();
      const expiry = new Date(cardDetails.expiryYear, cardDetails.expiryMonth - 1);
      
      if (expiry < currentDate) {
        throw new Error('Card has expired');
      }

      const payment = new Payment({
        orderId,
        userId,
        amount: cardDetails.amount,
        paymentMethod: 'CARD',
        status: 'PENDING',
        paymentDetails: {
          initiatedAt: new Date(),
          last4: cardDetails.cardNumber.slice(-4),
          cardType: this.getCardType(cardDetails.cardNumber)
        }
      });

      await payment.save();

      try {
        // Create payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(cardDetails.amount * 100),
          currency: 'usd',
          payment_method_data: {
            type: 'card',
            card: {
              number: cardDetails.cardNumber,
              exp_month: cardDetails.expiryMonth,
              exp_year: cardDetails.expiryYear,
              cvc: cardDetails.cvv,
            },
          },
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          }
        });

        if (paymentIntent.status === 'succeeded') {
          payment.status = 'COMPLETED';
          payment.paymentDetails.transactionId = paymentIntent.id;
          payment.paymentDetails.completedAt = new Date();
          await payment.save();

          await Order.findByIdAndUpdate(orderId, { status: 'Processing' });

          return { 
            success: true, 
            paymentId: payment._id,
            transactionId: paymentIntent.id 
          };
        } else {
          throw new Error('Payment failed');
        }
      } catch (stripeError) {
        payment.status = 'FAILED';
        payment.paymentDetails.error = stripeError.message;
        payment.paymentDetails.failedAt = new Date();
        await payment.save();

        if (stripeError.type === 'StripeCardError') {
          throw new Error(`Card error: ${stripeError.message}`);
        } else {
          throw new Error('Payment processing failed');
        }
      }
    } catch (error) {
      throw new Error(`Card payment failed: ${error.message}`);
    }
  }

  // Helper method to get card type
  static getCardType(cardNumber) {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type;
      }
    }
    return 'unknown';
  }

  // Verify payment status
  static async verifyPayment(paymentId, type) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      switch (type) {
        case 'esewa':
          return this.verifyEsewaPayment(payment.transactionId, payment.amount, payment.paymentDetails.esewaRefId);
        case 'stripe':
          return this.checkStripePaymentStatus(payment.paymentDetails.transactionId);
        default:
          throw new Error('Invalid payment type');
      }
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  // Verify eSewa Payment
  static async verifyEsewaPayment(transactionId, amount, refId) {
    try {
      // Generate verification signature
      const verifySignatureString = `total_amount=${amount},transaction_uuid=${transactionId},product_code=EPAYTEST,transaction_code=${refId}`;
      const verifySignature = crypto
        .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(verifySignatureString)
        .digest('base64');

      // Call eSewa verification API
      const verifyResponse = await axios.post(process.env.ESEWA_VERIFY_URL, {
        transaction_code: refId,
        transaction_uuid: transactionId,
        signature: verifySignature
      });

      if (verifyResponse.data.status === "COMPLETE") {
        // Update payment status
        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
          throw new Error('Payment not found');
        }

        payment.status = 'COMPLETED';
        payment.paymentDetails.completedAt = new Date();
        payment.paymentDetails.esewaRefId = refId;
        await payment.save();

        // Update order status
        await Order.findByIdAndUpdate(payment.orderId, { status: 'Confirmed' });

        return {
          success: true,
          message: 'Payment verified successfully',
          paymentId: payment._id
        };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      throw new Error(`eSewa payment verification failed: ${error.message}`);
    }
  }

  // Check Stripe payment status
  static async checkStripePaymentStatus(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return { success: paymentIntent.status === 'succeeded' };
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }
}
