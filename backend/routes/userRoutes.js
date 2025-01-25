import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, userController.getProfile);

// Update user profile
router.put('/profile', verifyToken, userController.updateProfile);

// Get account settings
router.get('/settings', verifyToken, userController.getSettings);

// Update account settings
router.put('/settings', verifyToken, userController.updateSettings);

// Delete user account
router.post('/delete-account', verifyToken, userController.deleteAccount);

export default router;