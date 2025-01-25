const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ridehub_vehicles',
        format: async (req, file) => {
            if (file.mimetype === 'image/jpeg') return 'jpg';
            if (file.mimetype === 'image/png') return 'png';
            return 'jpg'; // default format
        },
        public_id: (req, file) => {
            // Generate a unique public_id
            return `vehicle_${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        }
    }
});

// Configure multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
