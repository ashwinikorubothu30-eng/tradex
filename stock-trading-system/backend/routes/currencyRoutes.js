const express = require('express');
const router = express.Router();
const { getCurrencies, getRates } = require('../controllers/currencyController');

router.get('/list', getCurrencies);
router.get('/rates', getRates);

module.exports = router;
