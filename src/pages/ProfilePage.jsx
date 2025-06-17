// client/src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner';

/**
 * @component ProfilePage
 * @description Displays the authenticated user's profile information.
 */
const ProfilePage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <p className="text-center text-red-500 text-xl mt-10">You need to be logged in to view your profile.</p>;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">My Profile</h2>
            <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">User ID:</span>
                    <span className="text-gray-800 break-all">{user._id}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-700">Role:</span>
                    <span className="text-gray-800 capitalize">{user.role.replace('_', ' ')}</span>
                </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600">
                <p>This is a basic profile view. More details can be added here.</p>
            </div>
        </div>
    );
};

export default ProfilePage;
