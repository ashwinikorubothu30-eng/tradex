const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const { getOrCreatePortfolio, recalculatePortfolio } = require('../services/portfolioService');

const buyStock = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { stockId, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!stockId || !qty || qty < 1) {
      return res.status(400).json({ success: false, message: 'Valid stock and quantity required' });
    }

    const stock = await Stock.findById(stockId).session(session);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id).session(session);
    const totalAmount = parseFloat((stock.currentPrice * qty).toFixed(2));

    if (user.virtualBalance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient virtual balance' });
    }

    user.virtualBalance -= totalAmount;
    await user.save({ session });

    const portfolio = await getOrCreatePortfolio(user._id);
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId
    );

    if (holdingIndex > -1) {
      const holding = portfolio.holdings[holdingIndex];
      const totalQty = holding.quantity + qty;
      holding.averagePrice =
        (holding.averagePrice * holding.quantity + stock.currentPrice * qty) / totalQty;
      holding.quantity = totalQty;
    } else {
      portfolio.holdings.push({
        stockId,
        quantity: qty,
        averagePrice: stock.currentPrice,
      });
    }
    await portfolio.save({ session });

    const transaction = await Transaction.create(
      [
        {
          userId: user._id,
          stockId,
          tradeType: 'BUY',
          quantity: qty,
          price: stock.currentPrice,
          totalAmount,
          status: 'COMPLETED',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await recalculatePortfolio(user._id);

    res.status(201).json({
      success: true,
      data: transaction[0],
      virtualBalance: user.virtualBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const sellStock = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { stockId, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!stockId || !qty || qty < 1) {
      return res.status(400).json({ success: false, message: 'Valid stock and quantity required' });
    }

    const stock = await Stock.findById(stockId).session(session);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id }).session(session);
    if (!portfolio) {
      return res.status(400).json({ success: false, message: 'No portfolio found' });
    }

    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId
    );

    if (holdingIndex === -1) {
      return res.status(400).json({ success: false, message: 'You do not own this stock' });
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient shares. You own ${holding.quantity}`,
      });
    }

    const totalAmount = parseFloat((stock.currentPrice * qty).toFixed(2));
    const user = await User.findById(req.user._id).session(session);
    user.virtualBalance += totalAmount;
    await user.save({ session });

    holding.quantity -= qty;
    if (holding.quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }
    await portfolio.save({ session });

    const transaction = await Transaction.create(
      [
        {
          userId: user._id,
          stockId,
          tradeType: 'SELL',
          quantity: qty,
          price: stock.currentPrice,
          totalAmount,
          status: 'COMPLETED',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await recalculatePortfolio(user._id);

    res.status(201).json({
      success: true,
      data: transaction[0],
      virtualBalance: user.virtualBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const getTradeHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const tradeType = req.query.tradeType;
    const sortBy = req.query.sortBy || 'timestamp';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.user.role === 'ADMIN' && req.query.all === 'true') {
      if (req.query.userId) filter.userId = req.query.userId;
    } else {
      filter.userId = req.user._id;
    }
    if (tradeType && ['BUY', 'SELL'].includes(tradeType)) {
      filter.tradeType = tradeType;
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate('stockId', 'symbol companyName')
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    res.json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const updateTransactionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['COMPLETED', 'PENDING', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('stockId userId');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

module.exports = { buyStock, sellStock, getTradeHistory, updateTransactionStatus };
