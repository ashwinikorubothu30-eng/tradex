const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStocks = await Stock.countDocuments();
    const totalTrades = await Transaction.countDocuments();

    const volumeResult = await Transaction.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } },
    ]);
    const tradingVolume = volumeResult[0]?.totalVolume || 0;

    const tradesByType = await Transaction.aggregate([
      { $group: { _id: '$tradeType', count: { $sum: 1 }, volume: { $sum: '$totalAmount' } } },
    ]);

    const recentTrades = await Transaction.find()
      .populate('stockId', 'symbol companyName')
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);

    const tradesOverTime = await Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
          volume: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStocks,
        totalTrades,
        tradingVolume,
        tradesByType,
        recentTrades,
        tradesOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
