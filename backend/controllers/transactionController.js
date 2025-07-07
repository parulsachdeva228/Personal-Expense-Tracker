const Transaction = require('../models/Transaction');

const transactionController = {
  // Get all transactions for a user
  getTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.user.userId })
        .sort({ date: -1 });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get single transaction by ID
  getTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new transaction
  createTransaction: async (req, res) => {
    try {
      const { type, category, amount, description, date, paymentMethod } = req.body;
      if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required' });
      }
      const transaction = new Transaction({
        userId: req.user.userId,
        type,
        category,
        amount,
        description,
        date: date || new Date(),
        paymentMethod
      });
      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update transaction
  updateTransaction: async (req, res) => {
    try {
      if (req.body.paymentMethod === undefined) {
        return res.status(400).json({ message: 'Payment method is required' });
      }
      const transaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete transaction
  deleteTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = transactionController; 