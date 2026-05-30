const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getMarketDashboard,
} = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/market/dashboard', getMarketDashboard);
router.get('/', getStocks);
router.get('/:id', getStockById);
router.post('/', authMiddleware, adminMiddleware, createStock);
router.put('/:id', authMiddleware, adminMiddleware, updateStock);
router.delete('/:id', authMiddleware, adminMiddleware, deleteStock);

module.exports = router;
