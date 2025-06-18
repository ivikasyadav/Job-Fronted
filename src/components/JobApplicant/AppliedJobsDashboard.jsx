import React, { useState, useEffect, useCallback } from 'react';
import { getMyApplications, deleteApplication } from '../../api/applications';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';

const AppliedJobsDashboard = ({ onBackToBrowse }) => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('appliedDate_desc'); 

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const fetchedApplications = await getMyApplications({
                status: filterStatus,
                sort: sortBy,
            });
            setApplications(fetchedApplications);
        } catch (err) {
            setError(`Failed to fetch your applications: ${err}`);
            addNotification(`Failed to fetch your applications: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, sortBy, addNotification]);

    useEffect(() => {
        if (user && user.role === 'job_applicant') {
            fetchApplications();
        }
    }, [user, fetchApplications]);

    const handleDeleteApplication = async (applicationId, jobTitle) => {
        if (window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"?`)) {
            setLoading(true);
            try {
                await deleteApplication(applicationId);
                addNotification('Application withdrawn successfully!', 'success');
                fetchApplications(); 
            } catch (err) {
                addNotification(`Failed to withdraw application: ${err}`, 'error');
                setError(`Failed to withdraw application: ${err}`);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-600 text-center py-4">{error}</div>;
    }

    const applicationStatuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">My Job Applications</h3>
                <button
                    onClick={onBackToBrowse}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    Browse More Jobs
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        {applicationStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="appliedDate_desc">Applied Date (Newest)</option>
                        <option value="appliedDate_asc">Applied Date (Oldest)</option>
                        <option value="status_asc">Status (A-Z)</option>
                        <option value="status_desc">Status (Z-A)</option>
                    </select>
                </div>
                <button
                    onClick={fetchApplications}
                    className="mt-5 sm:mt-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    Apply Filters
                </button>
            </div>

            {applications.length === 0 ? (
                <p className="text-center text-gray-600">You haven't applied to any jobs yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {application.job?.jobTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {application.job?.companyName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(application.appliedDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${application.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                                            ${application.status === 'Interview' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${application.status === 'Offer' ? 'bg-purple-100 text-purple-800' : ''}
                                            ${application.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                                            ${application.status === 'Applied' ? 'bg-gray-100 text-gray-800' : ''}
                                        `}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteApplication(application._id, application.job?.jobTitle)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Withdraw
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AppliedJobsDashboard;
