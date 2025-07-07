const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');

const JWT_SECRET = 'your-secret-key';

const authController = {
  // User registration
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = new User({ name, email, password });
      await user.save();

      // Create default categories
      const defaultCategories = [
        { name: 'Salary', type: 'income', color: '#10B981' },
        { name: 'Others', type: 'income', color: '#3B82F6' },
        { name: 'Food', type: 'expense', color: '#EF4444' },
        { name: 'Transport', type: 'expense', color: '#F59E0B' },
        { name: 'Shopping', type: 'expense', color: '#8B5CF6' },
        { name: 'Bills', type: 'expense', color: '#EC4899' }
      ];

      for (const category of defaultCategories) {
        await Category.create({
          userId: user._id,
          ...category
        });
      }

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController; 