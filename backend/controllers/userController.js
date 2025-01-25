import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, nationality, mobileNumber } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName,
                lastName,
                nationality,
                mobileNumber
            },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Get account settings
export const getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('email notifications preferredCurrency language');
        
        res.status(200).json({
            success: true,
            settings: {
                email: user.email,
                notifications: user.notifications || {
                    email: true,
                    sms: true,
                    promotions: true
                },
                preferredCurrency: user.preferredCurrency || 'NPR',
                language: user.language || 'en'
            }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account settings'
        });
    }
};

// Update account settings
export const updateSettings = async (req, res) => {
    try {
        const { notifications, preferredCurrency, language } = req.body;
        
        // Validate settings
        if (notifications && typeof notifications !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid notifications format'
            });
        }

        if (preferredCurrency && !['NPR', 'USD', 'EUR'].includes(preferredCurrency)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid currency'
            });
        }

        if (language && !['en', 'ne'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                notifications,
                preferredCurrency,
                language
            },
            { new: true }
        ).select('email notifications preferredCurrency language');

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings: {
                email: user.email,
                notifications: user.notifications,
                preferredCurrency: user.preferredCurrency,
                language: user.language
            }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update account settings'
        });
    }
};

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        
        // Verify password
        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Delete user
        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
}; 