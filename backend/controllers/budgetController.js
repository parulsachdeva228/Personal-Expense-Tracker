const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const budgetController = {
  // Get all budgets for a user
  getBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find({ userId: req.user.userId });
      
      // Calculate spent amounts for each budget
      const budgetsWithSpent = await Promise.all(
        budgets.map(async (budget) => {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          const endOfMonth = new Date(startOfMonth);
          endOfMonth.setMonth(endOfMonth.getMonth() + 1);
          endOfMonth.setDate(0);
          endOfMonth.setHours(23, 59, 59, 999);
          const spent = await Transaction.aggregate([
            {
              $match: {
                userId: req.user.userId,
                category: budget.category,
                type: 'expense',
                date: { $gte: startOfMonth, $lte: endOfMonth }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }
              }
            }
          ]);
          return {
            ...budget.toObject(),
            spent: spent.length > 0 ? spent[0].total : 0
          };
        })
      );
      
      res.json(budgetsWithSpent);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new budget
  createBudget: async (req, res) => {
    try {
      const { category, amount, period } = req.body;
      const budget = new Budget({
        userId: req.user.userId,
        category,
        amount,
        period
      });
      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update budget
  updateBudget: async (req, res) => {
    try {
      const budget = await Budget.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete budget
  deleteBudget: async (req, res) => {
    try {
      const budget = await Budget.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      res.json({ message: 'Budget deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = budgetController; 