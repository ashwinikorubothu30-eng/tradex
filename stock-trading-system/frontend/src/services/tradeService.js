import api from './api';

export const buyStock = (data) => api.post('/trade/buy', data);
export const sellStock = (data) => api.post('/trade/sell', data);
export const getTradeHistory = (params) => api.get('/trade/history', { params });
export const updateTransactionStatus = (id, status) =>
  api.put(`/trade/${id}/status`, { status });
