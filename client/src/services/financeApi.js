import api from './api.js';

export const calculateFinance = async (financialInputs) => {
  const response = await api.post('/api/finance/calculate', financialInputs);
  return response.data;
};
