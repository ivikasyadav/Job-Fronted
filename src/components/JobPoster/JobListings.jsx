import React, { useState, useEffect, useCallback } from 'react';
import { getJobs, deleteJob } from '../../api/jobs';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import LoadingSpinner from '../Common/LoadingSpinner';

const JobListings = ({ onEditJob, onViewApplicants }) => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [sortBy, setSortBy] = useState('createdAt_desc'); 

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
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
                fetchJobs(); 
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

                                <div className="text-gray-700 text-sm mb-1">
                                    <span className="font-semibold">Location:</span> {job.location}
                                </div>
                                <div className="text-gray-700 text-sm mb-1">
                                    <span className="font-semibold">Salary Range:</span> {job.salaryRange}
                                </div>
                                <div className="text-gray-700 text-sm mb-1">
                                    <span className="font-semibold">Application Deadline:</span>{' '}
                                    {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="text-gray-700 text-sm mb-4">
                                    <span className="font-semibold">Posted On:</span>{' '}
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>

                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="text-gray-700 text-sm mb-1">
                                        <span className="font-semibold">Requirements:</span> {job.requirements.join(', ')}
                                    </div>
                                )}
                                {job.responsibilities && job.responsibilities.length > 0 && (
                                    <div className="text-gray-700 text-sm mb-4">
                                        <span className="font-semibold">Responsibilities:</span> {job.responsibilities.join(', ')}
                                    </div>
                                )}

                                <p className="text-gray-600 text-xs mt-2">
                                    Posted by: <span className="font-semibold">{job.user?.email || 'Unknown'}</span>
                                </p>
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
