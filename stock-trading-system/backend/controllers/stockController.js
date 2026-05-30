const Stock = require('../models/Stock');
const { getMarketSummary } = require('../services/marketService');

const getStocks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { symbol: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await Stock.countDocuments(query);
    const stocks = await Stock.find(query).skip(skip).limit(limit).sort({ symbol: 1 });

    res.json({
      success: true,
      data: stocks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getStockById = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
};

const createStock = async (req, res, next) => {
  try {
    const { symbol, companyName, currentPrice, openPrice, highPrice, lowPrice, volume, marketCap, description } =
      req.body;

    if (!symbol || !companyName || !currentPrice) {
      return res.status(400).json({ success: false, message: 'Symbol, company name, and price are required' });
    }

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      companyName,
      currentPrice,
      openPrice: openPrice || currentPrice,
      highPrice: highPrice || currentPrice,
      lowPrice: lowPrice || currentPrice,
      volume: volume || 0,
      marketCap: marketCap || 0,
      description: description || '',
      priceHistory: [{ price: currentPrice, timestamp: new Date() }],
    });

    res.status(201).json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    Object.assign(stock, req.body);
    if (req.body.symbol) stock.symbol = req.body.symbol.toUpperCase();
    const updated = await stock.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    await stock.deleteOne();
    res.json({ success: true, message: 'Stock deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getMarketDashboard = async (req, res, next) => {
  try {
    const summary = await getMarketSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getMarketDashboard,
};
