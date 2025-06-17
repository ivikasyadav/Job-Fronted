// client/src/api/applications.js
import api from './index';

/**
 * @function applyToJob
 * @description Allows an applicant to apply to a job. (Job Applicant only)
 * @param {string} jobId - ID of the job to apply to.
 * @param {Object} applicationData - Application details (e.g., notes, resumeUrl).
 * @returns {Promise<Object>} - New application data.
 */
export const applyToJob = async (jobId, applicationData) => {
    try {
        const response = await api.post(`/applications/apply/${jobId}`, applicationData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getMyApplications
 * @description Fetches all applications made by the authenticated job applicant. (Job Applicant only)
 * @param {Object} [filters] - Optional filters (status, sort).
 * @returns {Promise<Object[]>} - Array of applications.
 */
export const getMyApplications = async (filters = {}) => {
    try {
        const response = await api.get('/applications/my-applications', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getApplicationById
 * @description Fetches a single job application by ID. (Both roles, authorized)
 * @param {string} id - Application ID.
 * @returns {Promise<Object>} - Application data.
 */
export const getApplicationById = async (id) => {
    try {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function updateApplicationStatus
 * @description Updates the status of a job application. (Job Poster only)
 * @param {string} id - Application ID.
 * @param {string} status - New status ('Applied', 'Interview', 'Offer', 'Rejected', 'Accepted').
 * @returns {Promise<Object>} - Updated application data.
 */
export const updateApplicationStatus = async (id, status) => {
    try {
        const response = await api.put(`/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function deleteApplication
 * @description Deletes a job application. (Applicant or authorized poster)
 * @param {string} id - Application ID.
 * @returns {Promise<Object>} - Confirmation message.
 */
export const deleteApplication = async (id) => {
    try {
        const response = await api.delete(`/applications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
