const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');

// Upload multiple images
router.post('/multiple', auth, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'No files uploaded' 
            });
        }

        const imageUrls = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
            originalname: file.originalname
        }));

        res.status(200).json({
            success: true,
            count: imageUrls.length,
            images: imageUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Error uploading files: ' + error.message
        });
    }
});

// Upload single image
router.post('/single', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded' 
            });
        }

        const imageData = {
            url: req.file.path,
            public_id: req.file.filename,
            originalname: req.file.originalname
        };

        res.status(200).json({
            success: true,
            image: imageData
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Error uploading file: ' + error.message
        });
    }
});

// Error handling middleware
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size is too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
    
    if (error.message === 'Invalid file type. Only JPEG and PNG files are allowed.') {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }

    next(error);
});

module.exports = router;
