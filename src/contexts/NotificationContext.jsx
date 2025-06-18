import React, { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = uuidv4();
        const newNotification = { id, message, type };

        setNotifications(prev => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications(prev =>
                prev.filter(notification => notification.id !== id)
            );
        }, duration);
    }, []);


    const removeNotification = useCallback((id) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
        );
    }, []);

    const value = {
        notifications,
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
