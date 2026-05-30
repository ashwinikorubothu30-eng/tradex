require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');

const stocks = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 178.5, openPrice: 175.0, highPrice: 180.2, lowPrice: 174.5, volume: 52000000, marketCap: 2800000000000, description: 'Technology company designing consumer electronics and software.' },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', currentPrice: 141.2, openPrice: 139.8, highPrice: 142.5, lowPrice: 138.9, volume: 22000000, marketCap: 1750000000000, description: 'Multinational technology conglomerate specializing in Internet-related services.' },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', currentPrice: 378.9, openPrice: 375.0, highPrice: 380.5, lowPrice: 374.2, volume: 28000000, marketCap: 2900000000000, description: 'Develops, licenses, and supports software, services, devices, and solutions.' },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', currentPrice: 178.3, openPrice: 176.5, highPrice: 179.8, lowPrice: 175.0, volume: 35000000, marketCap: 1850000000000, description: 'E-commerce and cloud computing company.' },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', currentPrice: 248.5, openPrice: 252.0, highPrice: 255.0, lowPrice: 245.0, volume: 95000000, marketCap: 790000000000, description: 'Electric vehicle and clean energy company.' },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', currentPrice: 495.2, openPrice: 488.0, highPrice: 500.0, lowPrice: 485.5, volume: 42000000, marketCap: 1200000000000, description: 'Designs graphics processing units and AI computing platforms.' },
  { symbol: 'META', companyName: 'Meta Platforms Inc.', currentPrice: 505.8, openPrice: 500.0, highPrice: 510.0, lowPrice: 498.0, volume: 18000000, marketCap: 1300000000000, description: 'Social media and technology company.' },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', currentPrice: 198.4, openPrice: 196.0, highPrice: 199.5, lowPrice: 195.2, volume: 12000000, marketCap: 570000000000, description: 'Multinational investment bank and financial services.' },
  { symbol: 'V', companyName: 'Visa Inc.', currentPrice: 278.6, openPrice: 276.0, highPrice: 280.0, lowPrice: 275.0, volume: 8000000, marketCap: 580000000000, description: 'Global payments technology company.' },
  { symbol: 'JNJ', companyName: 'Johnson & Johnson', currentPrice: 156.2, openPrice: 155.0, highPrice: 157.0, lowPrice: 154.5, volume: 9000000, marketCap: 380000000000, description: 'Pharmaceutical and medical devices corporation.' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const force = process.env.SEED_FORCE === 'true';
    const seedDemoUsers = process.env.SEED_DEMO_USERS === 'true';

    const stockCount = await Stock.countDocuments();
    if (stockCount === 0 || force) {
      if (force && stockCount > 0) {
        console.log('SEED_FORCE=true: replacing stock catalog...');
        await Stock.deleteMany();
      }
      for (const stockData of stocks) {
        await Stock.create({
          ...stockData,
          priceHistory: [{ price: stockData.currentPrice, timestamp: new Date() }],
        });
      }
      console.log(`Seeded ${stocks.length} stocks.`);
    } else {
      console.log(`Stocks already exist (${stockCount}). Skipping stock seed.`);
    }

    if (seedDemoUsers) {
      const existingAdmin = await User.findOne({ email: 'admin@tradex.com' });
      if (!existingAdmin) {
        const admin = await User.create({
          name: 'Admin User',
          email: 'admin@tradex.com',
          password: 'admin123',
          role: 'ADMIN',
          virtualBalance: 1000000,
        });
        await Portfolio.create({ userId: admin._id, holdings: [] });
        console.log('Demo admin created: admin@tradex.com / admin123');
      }

      const existingUser = await User.findOne({ email: 'user@tradex.com' });
      if (!existingUser) {
        const user = await User.create({
          name: 'Demo User',
          email: 'user@tradex.com',
          password: 'user1234',
          role: 'USER',
          virtualBalance: 100000,
        });
        await Portfolio.create({ userId: user._id, holdings: [] });
        console.log('Demo user created: user@tradex.com / user1234');
      }
    } else {
      console.log('Demo users skipped. Set SEED_DEMO_USERS=true to create demo accounts.');
    }

    const userCount = await User.countDocuments();
    console.log(`\nDatabase ready. Total users in DB: ${userCount}`);
    console.log('Real users: open http://localhost:3000/register and sign up.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
