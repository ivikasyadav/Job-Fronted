import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';
import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateRequired
} from '../../utils/validation';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('job_applicant');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

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

        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            valid = false;
        } else {
            setPasswordError('');
        }

        const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
        if (confirmPasswordValidation) {
            setConfirmPasswordError(confirmPasswordValidation);
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        const roleValidation = validateRequired(role, 'Role');
        if (roleValidation) {
            setRoleError(roleValidation);
            valid = false;
        } else {
            setRoleError('');
        }

        if (!valid) {
            addNotification('Please correct the errors in the form.', 'error');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, role);
            navigate('/dashboard'); 
        } catch (err) {
           
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${passwordError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="********"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(validatePassword(e.target.value));
                            setConfirmPasswordError(validateConfirmPassword(e.target.value, confirmPassword));
                        }}
                        required
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordError(validateConfirmPassword(password, e.target.value));
                        }}
                        required
                    />
                    {confirmPasswordError && (
                        <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">
                        Register as:
                    </label>
                    <select
                        id="role"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${roleError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            setRoleError(validateRequired(e.target.value, 'Role'));
                        }}
                        required
                    >
                        <option value="job_applicant">Job Applicant</option>
                        <option value="job_poster">Job Poster</option>
                    </select>
                    {roleError && <p className="text-red-500 text-xs mt-1">{roleError}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                >
                    Login
                </button>
            </p>
        </div>
    );
};

export default Signup;
