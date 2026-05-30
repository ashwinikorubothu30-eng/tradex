const axios = require('axios');
const { CURRENCY_CODES } = require('../utils/currencies');

const BASE_CURRENCY = 'USD';
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest';

let cachedRates = { base: BASE_CURRENCY, rates: { USD: 1 }, fetchedAt: 0 };
const CACHE_TTL_MS = 60 * 60 * 1000;

const fetchLiveRates = async () => {
  const targets = CURRENCY_CODES.filter((c) => c !== BASE_CURRENCY).join(',');
  const { data } = await axios.get(FRANKFURTER_URL, {
    params: { from: BASE_CURRENCY, to: targets },
    timeout: 10000,
  });

  const rates = { USD: 1, ...data.rates };
  cachedRates = {
    base: BASE_CURRENCY,
    rates,
    fetchedAt: Date.now(),
    date: data.date,
  };
  return cachedRates;
};

const getExchangeRates = async () => {
  if (Date.now() - cachedRates.fetchedAt < CACHE_TTL_MS && Object.keys(cachedRates.rates).length > 1) {
    return cachedRates;
  }
  try {
    return await fetchLiveRates();
  } catch (err) {
    console.warn('Exchange rate API failed, using cached/fallback rates:', err.message);
    if (Object.keys(cachedRates.rates).length > 1) return cachedRates;
    return {
      base: BASE_CURRENCY,
      rates: {
        USD: 1,
        INR: 83.5,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 150,
        AUD: 1.55,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.25,
        SGD: 1.35,
        AED: 3.67,
        SAR: 3.75,
        KRW: 1350,
        BRL: 5.1,
        MXN: 17.2,
      },
      fetchedAt: Date.now(),
      fallback: true,
    };
  }
};

const convertFromUsd = (amountUsd, targetCurrency, rates) => {
  const rate = rates[targetCurrency] ?? 1;
  return parseFloat((amountUsd * rate).toFixed(targetCurrency === 'JPY' || targetCurrency === 'KRW' ? 0 : 2));
};

module.exports = { getExchangeRates, convertFromUsd, BASE_CURRENCY };
