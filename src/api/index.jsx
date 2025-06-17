// client/src/api/index.js
import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Adjust if your backend port is different
    withCredentials: true, // If you're using cookies (though JWT is usually in headers)
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add Bearer token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('token'); // Clear invalid token
            // In a real app with a router, you'd do: window.location.href = '/login';
            // For this app, we'll let the AuthContext handle the user state change
        }
        return Promise.reject(error);
    }
);

export default api;
