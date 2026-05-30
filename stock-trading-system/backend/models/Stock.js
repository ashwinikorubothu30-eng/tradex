const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [10, 'Symbol cannot exceed 10 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0.01, 'Price must be positive'],
    },
    openPrice: {
      type: Number,
      required: true,
      min: [0.01, 'Open price must be positive'],
    },
    highPrice: {
      type: Number,
      required: true,
      min: [0.01, 'High price must be positive'],
    },
    lowPrice: {
      type: Number,
      required: true,
      min: [0.01, 'Low price must be positive'],
    },
    volume: {
      type: Number,
      default: 0,
      min: [0, 'Volume cannot be negative'],
    },
    marketCap: {
      type: Number,
      default: 0,
      min: [0, 'Market cap cannot be negative'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    priceHistory: [
      {
        price: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

stockSchema.index({ companyName: 'text', symbol: 'text' });

module.exports = mongoose.model('Stock', stockSchema);
