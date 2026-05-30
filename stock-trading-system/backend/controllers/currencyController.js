const { getExchangeRates } = require('../services/exchangeRateService');
const { SUPPORTED_CURRENCIES } = require('../utils/currencies');

const getCurrencies = async (req, res, next) => {
  try {
    res.json({ success: true, data: SUPPORTED_CURRENCIES });
  } catch (error) {
    next(error);
  }
};

const getRates = async (req, res, next) => {
  try {
    const rateData = await getExchangeRates();
    res.json({ success: true, data: rateData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrencies, getRates };
