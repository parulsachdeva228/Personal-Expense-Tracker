const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const { authenticateToken } = require('../middleware/auth');

// Admin: Get all users with current month income/expense
router.get('/users', authenticateToken, async (req, res) => {
  const adminEmail = 'preyan228@gmail.com';
  if (!req.user || req.user.email !== adminEmail) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const users = await User.find({}, 'name email');
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const userData = await Promise.all(users.map(async (user) => {
      const transactions = await Transaction.find({
        userId: user._id,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalIncome,
        totalExpense
      };
    }));
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete user and all their data
router.delete('/users/:id', authenticateToken, async (req, res) => {
  const adminEmail = 'preyan228@gmail.com';
  if (!req.user || req.user.email !== adminEmail) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const userId = req.params.id;
    await User.deleteOne({ _id: userId });
    await Transaction.deleteMany({ userId });
    await Category.deleteMany({ userId });
    await Budget.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    res.json({ message: 'User and all related data deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 