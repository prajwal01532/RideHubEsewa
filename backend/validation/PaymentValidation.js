import { body } from 'express-validator';

export const paymentValidation = [
  body('orderId', 'Order ID is required').notEmpty(),
  body('amount', 'Amount is required').notEmpty(),
  body('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  body('paymentMethod', 'Payment method is required').notEmpty(),
  body('paymentMethod', 'Invalid payment method')
    .isIn(['COD', 'ESEWA', 'CARD'])
];

export const cardPaymentValidation = [
  body('orderId', 'Order ID is required').notEmpty(),
  body('cardDetails.cardNumber', 'Card number is required').notEmpty(),
  body('cardDetails.cardNumber', 'Invalid card number').isCreditCard(),
  body('cardDetails.expiryMonth', 'Expiry month is required').notEmpty(),
  body('cardDetails.expiryMonth', 'Invalid expiry month').isInt({ min: 1, max: 12 }),
  body('cardDetails.expiryYear', 'Expiry year is required').notEmpty(),
  body('cardDetails.expiryYear', 'Invalid expiry year').isInt({ min: new Date().getFullYear() }),
  body('cardDetails.cvv', 'CVV is required').notEmpty(),
  body('cardDetails.cvv', 'Invalid CVV').isLength({ min: 3, max: 4 }).isNumeric()
];