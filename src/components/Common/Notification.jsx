
import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';

const Notification = ({ id, message, type }) => {
    const { removeNotification } = useNotifications();

    let bgColor;
    let borderColor;
    let textColor = "text-white"; 

    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            borderColor = 'border-green-600';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            borderColor = 'border-red-600';
            break;
        case 'info':
            bgColor = 'bg-blue-500';
            borderColor = 'border-blue-600';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            borderColor = 'border-yellow-600';
            textColor = "text-gray-800"; 
            break;
        default:
            bgColor = 'bg-gray-700';
            borderColor = 'border-gray-800';
    }

    return (
        <div
            className={`fixed top-4 right-4 ${bgColor} ${borderColor} border rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 z-50`}
        >
            <div className="flex items-center justify-between">
                <p className={`font-semibold ${textColor}`}>{message}</p>
                <button
                    onClick={() => removeNotification(id)}
                    className={`ml-4 ${textColor} hover:opacity-75 focus:outline-none`}
                    aria-label="Close notification"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Notification;
