// client/src/components/JobPoster/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { createJob, updateJob, getJobById } from '../../api/jobs';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../Common/LoadingSpinner';
import { validateRequired, validateDateInFuture } from '../../utils/validation';

/**
 * @component JobForm
 * @description A form component for creating and editing job postings.
 * @param {Object} props
 * @param {string|null} props.jobId - The ID of the job to edit, or null for creating a new job.
 * @param {Function} props.onSuccess - Callback function to execute on successful form submission.
 * @param {Function} props.onCancel - Callback function to execute when the form is cancelled.
 */
const JobForm = ({ jobId, onSuccess, onCancel }) => {
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        description: '',
        location: 'Remote',
        salaryRange: 'Competitive',
        requirements: [],
        responsibilities: [],
        applicationDeadline: '',
    });
    const [errors, setErrors] = useState({});

    // Fetch job data if editing
    useEffect(() => {
        if (jobId) {
            setLoading(true);
            const fetchJob = async () => {
                try {
                    const job = await getJobById(jobId);
                    setFormData({
                        companyName: job.companyName,
                        jobTitle: job.jobTitle,
                        description: job.description,
                        location: job.location,
                        salaryRange: job.salaryRange,
                        // Ensure arrays are handled correctly for display
                        requirements: job.requirements ? job.requirements.join('\n') : '',
                        responsibilities: job.responsibilities ? job.responsibilities.join('\n') : '',
                        // Format date to YYYY-MM-DD for input type="date"
                        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
                    });
                } catch (err) {
                    addNotification(`Failed to load job: ${err}`, 'error');
                    onCancel(); // Go back if job not found or error
                } finally {
                    setLoading(false);
                }
            };
            fetchJob();
        }
    }, [jobId, addNotification, onCancel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const companyNameError = validateRequired(formData.companyName, 'Company Name');
        if (companyNameError) { newErrors.companyName = companyNameError; isValid = false; }

        const jobTitleError = validateRequired(formData.jobTitle, 'Job Title');
        if (jobTitleError) { newErrors.jobTitle = jobTitleError; isValid = false; }

        const descriptionError = validateRequired(formData.description, 'Description');
        if (descriptionError) { newErrors.description = descriptionError; isValid = false; }

        const deadlineError = validateDateInFuture(formData.applicationDeadline, 'Application Deadline');
        if (deadlineError) { newErrors.applicationDeadline = deadlineError; isValid = false; }


        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addNotification('Please correct the form errors.', 'error');
            return;
        }

        setLoading(true);
        try {
            // Split newline separated strings into arrays for requirements and responsibilities
            const jobDataToSend = {
                ...formData,
                requirements: formData.requirements ? formData.requirements.split('\n').map(item => item.trim()).filter(item => item !== '') : [],
                responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').map(item => item.trim()).filter(item => item !== '') : [],
            };

            let response;
            if (jobId) {
                response = await updateJob(jobId, jobDataToSend);
                addNotification('Job updated successfully!', 'success');
            } else {
                response = await createJob(jobDataToSend);
                addNotification('Job created successfully!', 'success');
            }
            onSuccess(response); // Pass the new/updated job back
        } catch (err) {
            addNotification(`Failed to ${jobId ? 'update' : 'create'} job: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && jobId) { // Only show spinner if loading an existing job, not for new form init
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {jobId ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-gray-700 text-sm font-semibold mb-2">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g., Tech Solutions Inc."
                        required
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div>
                    <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-semibold mb-2">
                        Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        required
                    />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="5"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide a detailed description of the job role, responsibilities, and team culture."
                        required
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Remote, New York, San Francisco"
                    />
                </div>

                <div>
                    <label htmlFor="salaryRange" className="block text-gray-700 text-sm font-semibold mb-2">
                        Salary Range
                    </label>
                    <input
                        type="text"
                        id="salaryRange"
                        name="salaryRange"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.salaryRange}
                        onChange={handleChange}
                        placeholder="e.g., $80,000 - $100,000 / year"
                    />
                </div>

                <div>
                    <label htmlFor="requirements" className="block text-gray-700 text-sm font-semibold mb-2">
                        Requirements (one per line)
                    </label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="e.g., Bachelor's degree in CS&#10;3+ years of experience with React&#10;Strong problem-solving skills"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="responsibilities" className="block text-gray-700 text-sm font-semibold mb-2">
                        Responsibilities (one per line)
                    </label>
                    <textarea
                        id="responsibilities"
                        name="responsibilities"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="e.g., Develop and maintain web applications&#10;Collaborate with cross-functional teams&#10;Write clean, maintainable code"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="applicationDeadline" className="block text-gray-700 text-sm font-semibold mb-2">
                        Application Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="applicationDeadline"
                        name="applicationDeadline"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        required
                    />
                    {errors.applicationDeadline && <p className="text-red-500 text-xs mt-1">{errors.applicationDeadline}</p>}
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
                        {loading ? (jobId ? 'Updating...' : 'Creating...') : (jobId ? 'Update Job' : 'Create Job')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobForm;
