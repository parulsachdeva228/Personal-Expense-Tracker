const Transaction = require('../models/Transaction');
const { spawn } = require('child_process');

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

// Function to get smart suggestions from Python script
const getSmartSuggestions = (transactions) => {
  return new Promise((resolve, reject) => {
    try {
      const pythonProcess = spawn('python', ['../suggestion-api/app.py']);
      
      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', error);
          resolve([]);
        } else {
          try {
            const suggestions = JSON.parse(result);
            resolve(suggestions);
          } catch (e) {
            console.error('Error parsing Python output:', e);
            resolve([]);
          }
        }
      });

      // Send transaction data to Python script
      const expenseData = transactions
        .filter(t => t.type === 'expense')
        .map(t => ({
          category: t.category,
          amount: t.amount,
          date: t.date,
          description: t.description
        }));

      pythonProcess.stdin.write(JSON.stringify(expenseData));
      pythonProcess.stdin.end();

    } catch (error) {
      console.error('Error running Python script:', error);
      resolve([]);
    }
  });
};

module.exports = analyticsController; 