import React, { useState, useEffect, useCallback } from 'react';
import { getJobs } from '../../api/jobs';
import { applyToJob } from '../../api/applications';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import LoadingSpinner from '../Common/LoadingSpinner';

const JobListingsApplicant = ({ onViewAppliedJobs }) => {
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
        if (user && user.role === 'job_applicant') {
            fetchJobs();
        }
    }, [user, fetchJobs]);

    const handleApply = async (jobId) => {
        if (!user || user.role !== 'job_applicant') {
            addNotification('You must be logged in as a Job Applicant to apply.', 'warning');
            return;
        }

        if (window.confirm('Are you sure you want to apply for this job?')) {
            setLoading(true);
            try {
                await applyToJob(jobId, {});
                addNotification('Application submitted successfully!', 'success');
                onViewAppliedJobs();
            } catch (err) {
                addNotification(`Failed to apply: ${err}`, 'error');
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Available Job Postings</h3>
                <button
                    onClick={onViewAppliedJobs}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                    View My Applications
                </button>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search (Title/Company/Desc)
                    </label>
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
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Location
                    </label>
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
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        Sort By
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="createdAt_desc">Date Posted (Newest)</option>
                        <option value="createdAt_asc">Date Posted (Oldest)</option>
                        <option value="jobTitle_asc">Job Title (A-Z)</option>
                        <option value="jobTitle_desc">Job Title (Z-A)</option>
                        <option value="companyName_asc">Company Name (A-Z)</option>
                        <option value="companyName_desc">Company Name (Z-A)</option>
                    </select>
                </div>
                <button
                    onClick={fetchJobs}
                    className="mt-5 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out flex items-center gap-1"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Apply Filters
                </button>
            </div>

            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">No job postings available at the moment.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition duration-300 ease-in-out">
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
                            <div className="mt-4">
                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobListingsApplicant;
