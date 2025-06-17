// client/src/components/JobPoster/JobListings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getJobs, deleteJob } from '../../api/jobs';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';

/**
 * @component JobListings
 * @description Displays a job poster's own job listings with options to edit, delete,
 * and view applicants.
 * @param {Object} props
 * @param {Function} props.onEditJob - Callback when 'Edit' is clicked, passes jobId.
 * @param {Function} props.onViewApplicants - Callback when 'View Applicants' is clicked, passes jobId.
 */
const JobListings = ({ onEditJob, onViewApplicants }) => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [sortBy, setSortBy] = useState('createdAt_desc'); // Default sort

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Pass filters to the API call
            const fetchedJobs = await getJobs({
                search: filterSearch,
                location: filterLocation,
                sort: sortBy,
            });
            setJobs(fetchedJobs);
        } catch (err) {
            setError(`Failed to fetch jobs: ${err}`);
            addNotification(`Failed to fetch jobs: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [filterSearch, filterLocation, sortBy, addNotification]);

    useEffect(() => {
        if (user && user.role === 'job_poster') {
            fetchJobs();
        }
    }, [user, fetchJobs]);

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting? All associated applications will also be deleted.')) {
            setLoading(true);
            try {
                await deleteJob(jobId);
                addNotification('Job deleted successfully!', 'success');
                fetchJobs(); // Re-fetch jobs to update the list
            } catch (err) {
                addNotification(`Failed to delete job: ${err}`, 'error');
                setError(`Failed to delete job: ${err}`);
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Job Postings</h3>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search (Title/Company/Desc)</label>
                    <input
                        type="text"
                        id="search"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        placeholder="Search jobs..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        placeholder="Filter by location..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="createdAt_desc">Date Created (Newest)</option>
                        <option value="createdAt_asc">Date Created (Oldest)</option>
                        <option value="jobTitle_asc">Job Title (A-Z)</option>
                        <option value="jobTitle_desc">Job Title (Z-A)</option>
                        <option value="companyName_asc">Company Name (A-Z)</option>
                        <option value="companyName_desc">Company Name (Z-A)</option>
                    </select>
                </div>
                <button
                    onClick={fetchJobs}
                    className="mt-5 sm:mt-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    Apply Filters
                </button>
            </div>

            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">No job postings found. Create one to get started!</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{job.jobTitle}</h4>
                                <p className="text-blue-600 font-medium mb-1">{job.companyName}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                                <div className="text-gray-500 text-xs flex items-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </div>
                                <div className="text-gray-500 text-xs flex items-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3v1m-6 3h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {job.salaryRange}
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <button
                                    onClick={() => onEditJob(job._id)}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out text-center"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out text-center"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => onViewApplicants(job._id)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out text-center"
                                >
                                    View Applicants
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobListings;
