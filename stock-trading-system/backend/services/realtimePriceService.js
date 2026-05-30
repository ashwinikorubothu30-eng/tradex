const axios = require('axios');
const Stock = require('../models/Stock');

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchQuote = async (symbol, apiKey) => {
  const { data } = await axios.get(`${FINNHUB_BASE}/quote`, {
    params: { symbol, token: apiKey },
    timeout: 10000,
  });
  if (!data || data.c === 0) return null;
  return data;
};

const updateStockFromQuote = async (stock, quote) => {
  stock.currentPrice = parseFloat(quote.c.toFixed(2));
  stock.openPrice = parseFloat((quote.o || quote.pc || stock.openPrice).toFixed(2));
  stock.highPrice = Math.max(stock.highPrice, parseFloat((quote.h || quote.c).toFixed(2)));
  stock.lowPrice = Math.min(stock.lowPrice, parseFloat((quote.l || quote.c).toFixed(2)));
  stock.priceHistory.push({ price: stock.currentPrice, timestamp: new Date() });
  if (stock.priceHistory.length > 100) {
    stock.priceHistory = stock.priceHistory.slice(-100);
  }
  await stock.save();
};

const refreshLivePrices = async () => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return { mode: 'simulated', updated: 0 };

  const stocks = await Stock.find();
  let updated = 0;

  for (const stock of stocks) {
    try {
      const quote = await fetchQuote(stock.symbol, apiKey);
      if (quote) {
        await updateStockFromQuote(stock, quote);
        updated += 1;
      }
      await delay(1100);
    } catch (err) {
      console.warn(`Live price fetch failed for ${stock.symbol}:`, err.message);
    }
  }

  return { mode: 'live', updated };
};

module.exports = { refreshLivePrices };
