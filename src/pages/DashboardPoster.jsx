import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobForm from '../components/JobPoster/JobForm';
import JobListings from '../components/JobPoster/JobListings';
import ApplicantList from '../components/JobPoster/ApplicantList';
import ApplicationStatusUpdate from '../components/JobPoster/ApplicationStatusUpdate';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const DashboardPoster = ({ setCurrentPage }) => {
    const { user, loading: authLoading } = useAuth();
    const [view, setView] = useState('list_jobs'); 
    const [selectedJobId, setSelectedJobId] = useState(null); 
    const [selectedApplicationId, setSelectedApplicationId] = useState(null); 

    if (authLoading) {
        return <LoadingSpinner />;
    }
    if (!user || user.role !== 'job_poster') {
        
        setCurrentPage('home');
        return null;
    }

    const handleCreateJobClick = () => {
        setSelectedJobId(null); 
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
        setView('list_jobs'); 
        setSelectedJobId(null);
        setSelectedApplicationId(null);
    };

    const handleCancel = () => {
       
        if (view === 'update_status') {
            setView('view_applicants');
            setSelectedApplicationId(null);
        } else {
            setView('list_jobs'); 
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
                        jobId={null} 
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
                        onBack={handleCancel} 
                        onUpdateStatus={handleUpdateApplicationStatusClick}
                    />
                );
            case 'update_status':
                return (
                    <ApplicationStatusUpdate
                        applicationId={selectedApplicationId}
                        onSuccess={handleFormSuccess} 
                        onCancel={handleCancel}
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
