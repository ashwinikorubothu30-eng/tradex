const Stock = require('../models/Stock');
const { refreshLivePrices } = require('./realtimePriceService');

const simulatePriceUpdate = async () => {
  const stocks = await Stock.find();
  for (const stock of stocks) {
    const changePercent = (Math.random() - 0.5) * 0.04;
    const newPrice = Math.max(0.01, stock.currentPrice * (1 + changePercent));
    stock.currentPrice = parseFloat(newPrice.toFixed(2));
    stock.highPrice = Math.max(stock.highPrice, stock.currentPrice);
    stock.lowPrice = Math.min(stock.lowPrice, stock.currentPrice);
    stock.volume += Math.floor(Math.random() * 10000);
    stock.priceHistory.push({ price: stock.currentPrice, timestamp: new Date() });
    if (stock.priceHistory.length > 100) {
      stock.priceHistory = stock.priceHistory.slice(-100);
    }
    await stock.save();
  }
};

const refreshPrices = async () => {
  if (process.env.FINNHUB_API_KEY) {
    const result = await refreshLivePrices();
    if (result.updated > 0) return result;
    console.warn('Live API returned no updates; using simulated prices for this cycle.');
  }
  await simulatePriceUpdate();
  return { mode: process.env.FINNHUB_API_KEY ? 'simulated-fallback' : 'simulated', updated: 0 };
};

const getMarketSummary = async () => {
  const stocks = await Stock.find().sort({ currentPrice: -1 });
  const totalStocks = stocks.length;
  const avgPrice =
    totalStocks > 0
      ? stocks.reduce((sum, s) => sum + s.currentPrice, 0) / totalStocks
      : 0;

  const sortedByChange = [...stocks].sort((a, b) => {
    const changeA = ((a.currentPrice - a.openPrice) / a.openPrice) * 100;
    const changeB = ((b.currentPrice - b.openPrice) / b.openPrice) * 100;
    return changeB - changeA;
  });

  return {
    totalStocks,
    avgPrice: parseFloat(avgPrice.toFixed(2)),
    priceMode: process.env.FINNHUB_API_KEY ? 'live' : 'simulated',
    topGainers: sortedByChange.slice(0, 5),
    topLosers: sortedByChange.slice(-5).reverse(),
    trending: stocks.sort((a, b) => b.volume - a.volume).slice(0, 6),
  };
};

module.exports = { simulatePriceUpdate, refreshPrices, getMarketSummary };
