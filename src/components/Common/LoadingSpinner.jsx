// client/src/components/Common/LoadingSpinner.jsx
import React from 'react';

/**
 * @component LoadingSpinner
 * @description A simple animated loading spinner.
 * @param {Object} props
 * @param {string} [props.color='border-blue-500'] - Tailwind class for border color.
 * @param {string} [props.size='h-12 w-12'] - Tailwind classes for height and width.
 */
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
