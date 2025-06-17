// client/src/components/Common/Header.jsx
import React from 'react';

/**
 * @component Header
 * @description Renders the application's header with navigation links.
 * Shows different links based on user authentication status and role.
 * @param {Object} props
 * @param {Object|null} props.user - The authenticated user object, or null if not logged in.
 * @param {Function} props.logout - Function to log out the user.
 * @param {Function} props.setCurrentPage - Function to change the current page in App.jsx.
 */
const Header = ({ user, logout, setCurrentPage }) => {
    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => setCurrentPage('home')}>
                    Job Portal
                </h1>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        {user ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => setCurrentPage('dashboard')}
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setCurrentPage('profile')}
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Profile ({user.role === 'job_poster' ? 'Poster' : 'Applicant'})
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button
                                        onClick={() => setCurrentPage('home')}
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setCurrentPage('login')}
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setCurrentPage('signup')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
                                    >
                                        Signup
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
