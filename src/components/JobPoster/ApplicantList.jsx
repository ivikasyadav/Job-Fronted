// client/src/components/JobPoster/ApplicantList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getJobApplicants } from '../../api/jobs';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import LoadingSpinner from '../Common/LoadingSpinner';

/**
 * @component ApplicantList
 * @description Displays a list of applicants for a specific job posting.
 * Allows filtering by status and sorting by applied date.
 * @param {Object} props
 * @param {string} props.jobId - The ID of the job to display applicants for.
 * @param {Function} props.onBack - Callback to return to the previous view (e.g., job listings).
 * @param {Function} props.onUpdateStatus - Callback to open the status update form for an application.
 */
const ApplicantList = ({ jobId, onBack, onUpdateStatus }) => {
    const { addNotification } = useNotifications();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('appliedDate_desc'); // Default sort

    const fetchApplicants = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const fetchedApplicants = await getJobApplicants(jobId, {
                status: filterStatus,
                sort: sortBy,
            });
            setApplicants(fetchedApplicants);
        } catch (err) {
            setError(`Failed to fetch applicants: ${err}`);
            addNotification(`Failed to fetch applicants: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [jobId, filterStatus, sortBy, addNotification]);

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

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
                <h3 className="text-2xl font-bold text-gray-800">Applicants for Job</h3>
                <button
                    onClick={onBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    Back to Jobs
                </button>
            </div>

            {/* Filter and Sort Controls */}
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
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By Applied Date</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="appliedDate_desc">Newest First</option>
                        <option value="appliedDate_asc">Oldest First</option>
                    </select>
                </div>
                <button
                    onClick={fetchApplicants}
                    className="mt-5 sm:mt-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    Apply Filters
                </button>
            </div>

            {applicants.length === 0 ? (
                <p className="text-center text-gray-600">No applicants for this job yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applicant Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company Name
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
                            {applicants.map((application) => (
                                <tr key={application._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {application.applicant.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {application.job?.jobTitle} {/* Display Job Title */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {application.job?.companyName} {/* Display Company Name */}
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
                                            onClick={() => onUpdateStatus(application._id)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Update Status
                                        </button>
                                        {/* You could add a "View Details" button here if application details are complex,
                                            like notes, resume, cover letter links, potentially opening a modal */}
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

export default ApplicantList;
