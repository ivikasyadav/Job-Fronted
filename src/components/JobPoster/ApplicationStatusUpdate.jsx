// client/src/components/JobPoster/ApplicationStatusUpdate.jsx
import React, { useState, useEffect } from 'react';
import { getApplicationById, updateApplicationStatus } from '../../api/applications';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';
import { validateRequired } from '../../utils/validation';

/**
 * @component ApplicationStatusUpdate
 * @description Form to update the status of a specific job application.
 * @param {Object} props
 * @param {string} props.applicationId - The ID of the application to update.
 * @param {Function} props.onSuccess - Callback on successful status update.
 * @param {Function} props.onCancel - Callback to cancel the update process.
 */
const ApplicationStatusUpdate = ({ applicationId, onSuccess, onCancel }) => {
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusError, setStatusError] = useState('');

    const applicationStatuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

    // Fetch application details on component mount
    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            try {
                const fetchedApp = await getApplicationById(applicationId);
                setApplication(fetchedApp);
                setNewStatus(fetchedApp.status); // Set initial status from fetched data
            } catch (err) {
                addNotification(`Failed to load application details: ${err}`, 'error');
                onCancel(); // Go back if application not found or error
            } finally {
                setLoading(false);
            }
        };

        if (applicationId) {
            fetchApplication();
        }
    }, [applicationId, addNotification, onCancel]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateRequired(newStatus, 'Status');
        if (validationError) {
            setStatusError(validationError);
            addNotification('Please select a status.', 'error');
            return;
        }
        if (!applicationStatuses.includes(newStatus)) {
            setStatusError('Invalid status selected.');
            addNotification('Invalid status selected.', 'error');
            return;
        }

        setLoading(true);
        try {
            await updateApplicationStatus(applicationId, newStatus);
            addNotification('Application status updated successfully!', 'success');
            onSuccess(); // Trigger a refresh of the applicant list
        } catch (err) {
            addNotification(`Failed to update status: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!application) {
        return <p className="text-center text-red-600">Application not found.</p>;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Update Application Status</h2>

            <div className="mb-6 border-b pb-4">
                <p className="text-lg font-semibold text-gray-700">Job Title: <span className="font-normal">{application.job?.jobTitle}</span></p>
                <p className="text-lg font-semibold text-gray-700">Company: <span className="font-normal">{application.job?.companyName}</span></p>
                <p className="text-lg font-semibold text-gray-700">Applicant: <span className="font-normal">{application.applicant?.email}</span></p>
                <p className="text-lg font-semibold text-gray-700">Current Status: <span className="font-normal">{application.status}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="newStatus" className="block text-gray-700 text-sm font-semibold mb-2">
                        New Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="newStatus"
                        name="newStatus"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${statusError ? 'border-red-500' : 'border-gray-300'}`}
                        value={newStatus}
                        onChange={(e) => {
                            setNewStatus(e.target.value);
                            setStatusError(''); // Clear error on change
                        }}
                        required
                    >
                        <option value="">Select Status</option>
                        {applicationStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationStatusUpdate;
