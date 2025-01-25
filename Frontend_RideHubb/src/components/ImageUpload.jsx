import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess, multiple = false, maxImages = 5 }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        if (multiple && files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Create preview URLs
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreview(previewUrls);
        setSelectedFiles(files);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFiles.length) {
            setError('Please select files to upload');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            
            if (multiple) {
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });
            } else {
                formData.append('image', selectedFiles[0]);
            }

            const endpoint = multiple ? '/api/upload/multiple' : '/api/upload/single';
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Clean up preview URLs
            preview.forEach(url => URL.revokeObjectURL(url));
            
            setSelectedFiles([]);
            setPreview([]);
            onUploadSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error uploading images');
        } finally {
            setLoading(false);
        }
    };

    const removePreview = (index) => {
        URL.revokeObjectURL(preview[index]);
        setPreview(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    multiple={multiple}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                    {multiple 
                        ? `You can upload up to ${maxImages} images` 
                        : 'Upload a single image'}
                </p>
            </div>

            {/* Preview Section */}
            {preview.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {preview.map((url, index) => (
                        <div key={index} className="relative">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                            />
                            <button
                                onClick={() => removePreview(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm mb-4">
                    {error}
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={loading || !selectedFiles.length}
                className={`w-full py-2 px-4 rounded ${
                    loading || !selectedFiles.length
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default ImageUpload;
