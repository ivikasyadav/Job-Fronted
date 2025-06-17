import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-6xl font-extrabold text-blue-600 mb-4">404</h2>
            <p className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</p>
            <p className="text-lg text-gray-600 mb-8">
                The page you are looking for does not exist.
            </p>
            <button
                onClick={() => window.location.href = '/'} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;
