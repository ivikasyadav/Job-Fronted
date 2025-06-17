// client/src/api/jobs.js
import api from './index';

/**
 * @function createJob
 * @description Creates a new job posting. (Job Poster only)
 * @param {Object} jobData - Job details.
 * @returns {Promise<Object>} - New job data.
 */
export const createJob = async (jobData) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getJobs
 * @description Fetches all job postings (for applicants) or poster's own jobs (for posters).
 * @param {Object} [filters] - Optional filters (search, location, sort).
 * @returns {Promise<Object[]>} - Array of job postings.
 */
export const getJobs = async (filters = {}) => {
    try {
        const response = await api.get('/jobs', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getJobById
 * @description Fetches a single job posting by ID.
 * @param {string} id - Job ID.
 * @returns {Promise<Object>} - Job data.
 */
export const getJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function updateJob
 * @description Updates an existing job posting. (Job Poster only)
 * @param {string} id - Job ID.
 * @param {Object} jobData - Updated job details.
 * @returns {Promise<Object>} - Updated job data.
 */
export const updateJob = async (id, jobData) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function deleteJob
 * @description Deletes a job posting. (Job Poster only)
 * @param {string} id - Job ID.
 * @returns {Promise<Object>} - Confirmation message.
 */
export const deleteJob = async (id) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

/**
 * @function getJobApplicants
 * @description Fetches all applicants for a specific job posting. (Job Poster only)
 * @param {string} jobId - ID of the job posting.
 * @param {Object} [filters] - Optional filters (status, sort).
 * @returns {Promise<Object[]>} - Array of applications.
 */
export const getJobApplicants = async (jobId, filters = {}) => {
    try {
        const response = await api.get(`/jobs/${jobId}/applicants`, { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
