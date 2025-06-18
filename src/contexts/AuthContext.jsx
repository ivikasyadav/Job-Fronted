import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login, register, getProfile } from '../api/auth.jsx';
import { useNotifications } from '../hooks/useNotifications.jsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotifications();

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const profile = await getProfile(); 
                setUser(profile);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            addNotification('Session expired or invalid. Please log in again.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({ _id: data._id, email: data.email, role: data.role });
            addNotification('Login successful!', 'success');
            return data;
        } catch (error) {
            const errorMsg = error?.response?.data?.error || error.message || 'Login failed';
            addNotification(`Login failed: ${errorMsg}`, 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email, password, role) => {
        setLoading(true);
        try {
            const data = await register({ email, password, role });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({ _id: data._id, email: data.email, role: data.role });
            addNotification('Registration successful! You are now logged in.', 'success');
            return data;
        } catch (error) {
            const errorMsg = error?.response?.data?.error || error.message || 'Registration failed';
            addNotification(`Registration failed: ${errorMsg}`, 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        addNotification('Logged out successfully.', 'info');
    };

    const isAuthenticated = !!user && !!token;

    const authContextValue = {
        user,
        token,
        loading,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
