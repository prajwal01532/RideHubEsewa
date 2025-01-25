const cloudinary = require('../config/cloudinary');

const deleteImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

const deleteMultipleImages = async (public_ids) => {
    try {
        const result = await cloudinary.api.delete_resources(public_ids);
        return result;
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    deleteImage,
    deleteMultipleImages
};
