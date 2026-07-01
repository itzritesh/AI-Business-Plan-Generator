import api from './api.js';

export const sendMessageToCoach = async (messages) => {
  const response = await api.post('/api/coach/chat', { messages });
  return response.data;
};
