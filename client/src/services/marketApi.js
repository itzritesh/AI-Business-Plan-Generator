import api from './api.js';

export const analyzeMarket = async (planId) => {
  const response = await api.post('/api/market/analyze', { planId });
  return response.data;
};
