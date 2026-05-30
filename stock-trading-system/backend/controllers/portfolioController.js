const { getOrCreatePortfolio, recalculatePortfolio } = require('../services/portfolioService');

const getPortfolio = async (req, res, next) => {
  try {
    await getOrCreatePortfolio(req.user._id);
    const portfolio = await recalculatePortfolio(req.user._id);

    if (!portfolio) {
      return res.json({
        success: true,
        data: { holdings: [], totalInvestment: 0, currentValue: 0, profitLoss: 0 },
      });
    }

    const populated = await portfolio.populate('holdings.stockId');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio };
