require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { refreshPrices } = require('./services/marketService');
const { getExchangeRates } = require('./services/exchangeRateService');

const PORT = process.env.PORT || 5000;
const PRICE_INTERVAL_MS = parseInt(process.env.PRICE_UPDATE_INTERVAL_MS, 10) || 30000;

connectDB();

getExchangeRates().then(() => console.log('Exchange rates loaded'));

const runPriceUpdate = async () => {
  try {
    const result = await refreshPrices();
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Prices refreshed (${result.mode})`);
    }
  } catch (err) {
    console.error('Price update error:', err.message);
  }
};

runPriceUpdate();
setInterval(runPriceUpdate, PRICE_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`TradeX server running on port ${PORT}`);
  console.log(`Database: ${process.env.MONGODB_URI ? 'configured' : 'MISSING MONGODB_URI'}`);
  console.log(
    process.env.FINNHUB_API_KEY
      ? 'Stock prices: LIVE (Finnhub)'
      : 'Stock prices: simulated (add FINNHUB_API_KEY for live data)'
  );
  console.log('New users: register at POST /api/auth/register or /register in the app');
});
