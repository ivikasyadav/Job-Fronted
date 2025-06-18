import api from './index';

export const createJob = async (jobData) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const getJobs = async (filters = {}) => {
    try {
        const response = await api.get('/jobs', { params: filters });
        console.log(response)
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const getJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const updateJob = async (id, jobData) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const deleteJob = async (id) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getJobApplicants = async (jobId, filters = {}) => {
    try {
        const response = await api.get(`/jobs/${jobId}/applicants`, { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
