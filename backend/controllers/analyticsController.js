const Transaction = require('../models/Transaction');
const axios = require('axios');

const analyticsController = {
  // Get analytics data
  getAnalytics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        };
      }

      const transactions = await Transaction.find({
        userId: req.user.userId,
        ...dateFilter
      });

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = totalIncome - totalExpense;

      // Category-wise breakdown
      const categoryBreakdown = {};
      transactions.forEach(transaction => {
        if (!categoryBreakdown[transaction.category]) {
          categoryBreakdown[transaction.category] = { income: 0, expense: 0 };
        }
        if (transaction.type === 'income') {
          categoryBreakdown[transaction.category].income += transaction.amount;
        } else {
          categoryBreakdown[transaction.category].expense += transaction.amount;
        }
      });

      // Get smart suggestions
      const suggestions = await getSmartSuggestions(transactions);

      res.json({
        totalIncome,
        totalExpense,
        balance,
        categoryBreakdown,
        transactionCount: transactions.length,
        suggestions
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// Function to get smart suggestions from Flask API
const getSmartSuggestions = async (transactions) => {
  try {
    const expenseData = transactions
      .filter(t => t.type === 'expense')
      .map(t => ({
        category: t.category,
        amount: t.amount,
        date: t.date,
        description: t.description
      }));

    // Call the Flask API
    const response = await axios.post(
      'https://flask-suggestion-api.onrender.com/suggest',
      expenseData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data; // This will be the suggestions array
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

module.exports = analyticsController; 