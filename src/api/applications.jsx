import api from './index';

export const applyToJob = async (jobId, applicationData) => {
    try {
        const response = await api.post(`/applications/apply/${jobId}`, applicationData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getMyApplications = async (filters = {}) => {
    try {
        const response = await api.get('/applications/my-applications', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getApplicationById = async (id) => {
    try {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const updateApplicationStatus = async (id, status) => {
    try {
        const response = await api.put(`/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};


export const deleteApplication = async (id) => {
    try {
        const response = await api.delete(`/applications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
