import api from './api.js';

export const generatePlan = async (details) => {
  const response = await api.post('/api/business/generate', details);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/api/business/history');
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await api.get(`/api/business/${id}`);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/api/business/${id}`);
  return response.data;
};

// Sub-services linked to a business plan ID
export const generatePitchDeck = async (planId) => {
  const response = await api.post('/api/pitch/generate', { planId });
  return response.data;
};

export const checkValidation = async (planId) => {
  const response = await api.post('/api/validation/check', { planId });
  return response.data;
};
