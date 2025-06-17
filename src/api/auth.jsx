// client/src/api/auth.js
import api from './index';

/**
 * @function register
 * @description Registers a new user.
 * @param {Object} userData - User registration data (email, password, role).
 * @returns {Promise<Object>} - User data and JWT token.
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function login
 * @description Logs in a user.
 * @param {Object} credentials - User login credentials (email, password).
 * @returns {Promise<Object>} - User data and JWT token.
 */
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getProfile
 * @description Fetches the authenticated user's profile.
 * @returns {Promise<Object>} - User profile data.
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
