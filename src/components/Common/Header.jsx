import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Header = ({ user, logout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Job Portal
                </Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        {user ? (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Profile ({user.role === 'job_poster' ? 'Poster' : 'Applicant'})
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/"
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out px-3 py-2 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
                                    >
                                        Signup
                                    </Link>
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
