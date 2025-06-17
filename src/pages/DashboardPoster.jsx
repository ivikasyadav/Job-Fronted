// client/src/pages/DashboardPoster.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobForm from '../components/JobPoster/JobForm';
import JobListings from '../components/JobPoster/JobListings';
import ApplicantList from '../components/JobPoster/ApplicantList';
import ApplicationStatusUpdate from '../components/JobPoster/ApplicationStatusUpdate';
import LoadingSpinner from '../components/Common/LoadingSpinner'; // If content loads

/**
 * @component DashboardPoster
 * @description The main dashboard for job posters.
 * Manages the display of job listings, job creation/editing, and applicant management.
 * @param {Object} props
 * @param {Function} props.setCurrentPage - Function to change the overall app page (e.g., to profile).
 */
const DashboardPoster = ({ setCurrentPage }) => {
    const { user, loading: authLoading } = useAuth();
    const [view, setView] = useState('list_jobs'); // 'list_jobs', 'create_job', 'edit_job', 'view_applicants', 'update_status'
    const [selectedJobId, setSelectedJobId] = useState(null); // For editing or viewing applicants
    const [selectedApplicationId, setSelectedApplicationId] = useState(null); // For updating status

    // Ensure only job posters can access this dashboard
    if (authLoading) {
        return <LoadingSpinner />;
    }
    if (!user || user.role !== 'job_poster') {
        // This case should ideally be handled by a PrivateRoute or App.jsx redirect
        // For now, just show a message or redirect home.
        setCurrentPage('home');
        return null;
    }

    const handleCreateJobClick = () => {
        setSelectedJobId(null); // Ensure no job is selected for editing
        setView('create_job');
    };

    const handleEditJobClick = (jobId) => {
        setSelectedJobId(jobId);
        setView('edit_job');
    };

    const handleViewApplicantsClick = (jobId) => {
        setSelectedJobId(jobId);
        setView('view_applicants');
    };

    const handleUpdateApplicationStatusClick = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setView('update_status');
    };

    const handleFormSuccess = () => {
        setView('list_jobs'); // Go back to job listings after create/edit success
        setSelectedJobId(null); // Clear selected job
        setSelectedApplicationId(null);
    };

    const handleCancel = () => {
        // If canceling from update_status, go back to view_applicants
        if (view === 'update_status') {
            setView('view_applicants');
            setSelectedApplicationId(null);
        } else {
            setView('list_jobs'); // Otherwise, go back to job listings
            setSelectedJobId(null);
            setSelectedApplicationId(null);
        }
    };


    const renderContent = () => {
        switch (view) {
            case 'list_jobs':
                return (
                    <JobListings
                        onEditJob={handleEditJobClick}
                        onViewApplicants={handleViewApplicantsClick}
                    />
                );
            case 'create_job':
                return (
                    <JobForm
                        jobId={null} // No jobId for creation
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancel}
                    />
                );
            case 'edit_job':
                return (
                    <JobForm
                        jobId={selectedJobId}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancel}
                    />
                );
            case 'view_applicants':
                return (
                    <ApplicantList
                        jobId={selectedJobId}
                        onBack={handleCancel} // Back to list_jobs
                        onUpdateStatus={handleUpdateApplicationStatusClick}
                    />
                );
            case 'update_status':
                return (
                    <ApplicationStatusUpdate
                        applicationId={selectedApplicationId}
                        onSuccess={handleFormSuccess} // Refreshes applicant list after update
                        onCancel={handleCancel} // Back to view_applicants
                    />
                );
            default:
                return <h2 className="text-center text-xl text-red-500">Something went wrong!</h2>;
        }
    };

    return (
        <div className="min-h-[60vh] py-8">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
                Job Poster Dashboard
            </h2>
            <div className="mb-8 flex justify-center space-x-4">
                <button
                    onClick={() => setView('list_jobs')}
                    className={`px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out shadow-md
                        ${view === 'list_jobs' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                >
                    My Job Postings
                </button>
                <button
                    onClick={handleCreateJobClick}
                    className={`px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out shadow-md
                        ${view === 'create_job' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'}`}
                >
                    Create New Job
                </button>
            </div>
            {renderContent()}
        </div>
    );
};

export default DashboardPoster;
