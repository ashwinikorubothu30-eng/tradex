const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

const recalculatePortfolio = async (userId) => {
  const portfolio = await Portfolio.findOne({ userId }).populate('holdings.stockId');
  if (!portfolio) return null;

  let totalInvestment = 0;
  let currentValue = 0;

  for (const holding of portfolio.holdings) {
    const stock = holding.stockId;
    if (!stock) continue;
    const investment = holding.quantity * holding.averagePrice;
    const value = holding.quantity * stock.currentPrice;
    totalInvestment += investment;
    currentValue += value;
  }

  portfolio.totalInvestment = totalInvestment;
  portfolio.currentValue = currentValue;
  portfolio.profitLoss = currentValue - totalInvestment;
  await portfolio.save();

  return portfolio;
};

const getOrCreatePortfolio = async (userId) => {
  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({ userId, holdings: [] });
  }
  return portfolio;
};

module.exports = { recalculatePortfolio, getOrCreatePortfolio };
