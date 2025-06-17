// client/src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * @component HomePage
 * @description The landing page for the Job Portal.
 * Guides users to login/signup or to their dashboard if already authenticated.
 * @param {Object} props
 * @param {Function} props.setCurrentPage - Function to change the current page.
 */
const HomePage = ({ setCurrentPage }) => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-down">
                Welcome to the Job Portal!
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl animate-fade-in">
                Your ultimate destination for finding and posting jobs.
                Whether you're looking for your next career move or seeking top talent,
                we've got you covered.
            </p>

            {!user ? (
                <div className="flex space-x-6 animate-fade-in-up">
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setCurrentPage('signup')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Sign Up
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <p className="text-lg text-gray-700 mb-4">
                        You are logged in as <span className="font-semibold text-blue-600">{user.email}</span> (Role: <span className="font-semibold text-blue-600">{user.role.replace('_', ' ')}</span>).
                    </p>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

            {/* Simple animations for visual appeal (add to index.css if needed) */}
            <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out 0.2s forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out 0.4s forwards; }
      `}</style>
        </div>
    );
};

export default HomePage;
