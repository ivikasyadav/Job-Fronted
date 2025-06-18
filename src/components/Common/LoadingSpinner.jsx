import React from 'react';

const LoadingSpinner = ({ color = 'border-blue-500', size = 'h-12 w-12' }) => {
    return (
        <div className="flex justify-center items-center h-full min-h-[200px]">
            <div
                className={`animate-spin rounded-full ${size} border-t-4 border-r-4 ${color} border-solid`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
