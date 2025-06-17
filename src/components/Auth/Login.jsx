import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';
import { validateEmail, validateRequired } from '../../utils/validation';

const Login = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { addNotification } = useNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;

        const emailValidation = validateEmail(email);
        if (emailValidation) {
            setEmailError(emailValidation);
            valid = false;
        } else {
            setEmailError('');
        }

        const passwordValidation = validateRequired(password, 'Password');
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!valid) {
            addNotification('Please correct the errors in the form.', 'error');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="your@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(validateEmail(e.target.value)); 
                        }}
                        required
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="********"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(validateRequired(e.target.value, 'Password')); // Real-time validation
                        }}
                        required
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                    onClick={() => setCurrentPage('signup')}
                    className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default Login;
