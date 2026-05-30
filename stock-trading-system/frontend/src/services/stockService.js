import api from './api';

export const getStocks = (params) => api.get('/stocks', { params });
export const getStockById = (id) => api.get(`/stocks/${id}`);
export const getMarketDashboard = () => api.get('/stocks/market/dashboard');
export const createStock = (data) => api.post('/stocks', data);
export const updateStock = (id, data) => api.put(`/stocks/${id}`, data);
export const deleteStock = (id) => api.delete(`/stocks/${id}`);
