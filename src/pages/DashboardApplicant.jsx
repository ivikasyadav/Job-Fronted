
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobListingsApplicant from '../components/JobApplicant/JobListingsApplicant';
import AppliedJobsDashboard from '../components/JobApplicant/AppliedJobsDashboard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const DashboardApplicant = ({ setCurrentPage }) => {
    const { user, loading: authLoading } = useAuth();
    const [view, setView] = useState('browse_jobs');

    if (authLoading) {
        return <LoadingSpinner />;
    }
    if (!user || user.role !== 'job_applicant') {
        setCurrentPage('home');
        return null;
    }

    const handleViewAppliedJobs = () => {
        setView('my_applications');
    };

    const handleBackToBrowse = () => {
        setView('browse_jobs');
    };

    const renderContent = () => {
        switch (view) {
            case 'browse_jobs':
                return <JobListingsApplicant onViewAppliedJobs={handleViewAppliedJobs} />;
            case 'my_applications':
                return <AppliedJobsDashboard onBackToBrowse={handleBackToBrowse} />;
            default:
                return <h2 className="text-center text-xl text-red-500">Something went wrong!</h2>;
        }
    };

    return (
        <div className="min-h-[60vh] py-8">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
                Job Applicant Dashboard
            </h2>
            <div className="mb-8 flex justify-center space-x-4">
                <button
                    onClick={() => setView('browse_jobs')}
                    className={`px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out shadow-md
                        ${view === 'browse_jobs' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                >
                    Browse All Jobs
                </button>
                <button
                    onClick={() => setView('my_applications')}
                    className={`px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out shadow-md
                        ${view === 'my_applications' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'}`}
                >
                    My Applied Jobs
                </button>
            </div>
            {renderContent()}
        </div>
    );
};

export default DashboardApplicant;
