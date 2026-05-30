const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const generateToken = require('../utils/generateToken');
const { detectCurrencyFromAcceptLanguage, isValidCurrency } = require('../utils/currencies');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let preferredCurrency = 'USD';
    if (req.body.preferredCurrency && isValidCurrency(req.body.preferredCurrency.toUpperCase())) {
      preferredCurrency = req.body.preferredCurrency.toUpperCase();
    } else {
      preferredCurrency = detectCurrencyFromAcceptLanguage(req.headers['accept-language']);
    }

    const user = await User.create({ name, email, password, preferredCurrency });
    await Portfolio.create({ userId: user._id, holdings: [] });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        virtualBalance: user.virtualBalance,
        preferredCurrency: user.preferredCurrency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        virtualBalance: user.virtualBalance,
        preferredCurrency: user.preferredCurrency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.preferredCurrency && isValidCurrency(req.body.preferredCurrency.toUpperCase())) {
      user.preferredCurrency = req.body.preferredCurrency.toUpperCase();
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        virtualBalance: updatedUser.virtualBalance,
        preferredCurrency: updatedUser.preferredCurrency,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
