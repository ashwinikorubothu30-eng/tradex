import api from './api';

export const getCurrencies = () => api.get('/currency/list');
export const getExchangeRates = () => api.get('/currency/rates');
