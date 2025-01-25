import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        // Ensure response data is properly formatted
        if (response.data && !response.data.hasOwnProperty('success')) {
            response.data = {
                success: true,
                data: response.data
            };
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Vehicle API functions
export const addVehicle = async (vehicleData) => {
    try {
        const response = await api.post('/vehicles', vehicleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getVehiclesByType = async (type) => {
    try {
        const response = await api.get(`/vehicles/${type.toLowerCase()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message };
    }
};

export const getVehicleById = async (id) => {
    try {
        const response = await api.get(`/vehicles/details/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateVehicleStatus = async (vehicleId, status) => {
    try {
        const response = await api.patch(`/vehicles/${vehicleId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message };
    }
};

// eSewa payment functions
export const esewaPayment = {
    initiatePayment: async (amount, bookingId) => {
        try {
            const response = await api.post('/payments/initiate', {
                amount,
                bookingId
            });

            if (response.data.success && response.data.url) {
                return {
                    success: true,
                    url: response.data.url
                };
            } else {
                throw new Error(response.data.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to initiate payment');
        }
    },

    handlePaymentSuccess: async (params) => {
        try {
            const response = await api.get('/payments/success', { params });
            return response.data;
        } catch (error) {
            console.error('Payment success verification error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to verify payment');
        }
    },

    handlePaymentFailure: async (params) => {
        try {
            const response = await api.get('/payments/failure', { params });
            return response.data;
        } catch (error) {
            console.error('Payment failure handling error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to handle payment failure');
        }
    }
};

export default api;
