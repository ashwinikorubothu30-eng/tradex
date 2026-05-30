const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getTradeHistory,
  updateTransactionStatus,
} = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/buy', authMiddleware, buyStock);
router.post('/sell', authMiddleware, sellStock);
router.get('/history', authMiddleware, getTradeHistory);
router.put('/:id/status', authMiddleware, adminMiddleware, updateTransactionStatus);

module.exports = router;
