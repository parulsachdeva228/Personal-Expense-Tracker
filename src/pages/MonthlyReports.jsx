import { useState, useEffect } from 'react';
import axios from 'axios';
import Charts from '../components/Charts';

const MonthlyReports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedMonth]);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get start and end dates for the selected month
      const startDate = new Date(selectedMonth + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      // Fetch analytics for the month
      const analyticsResponse = await axios.get('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });
      setAnalytics(analyticsResponse.data);

      // Fetch transactions for the month
      const transactionsResponse = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const monthTransactions = transactionsResponse.data.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      setTransactions(monthTransactions);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getCategoryBreakdown = () => {
    if (!analytics?.categoryBreakdown) return [];
    
    return Object.entries(analytics.categoryBreakdown)
      .map(([category, data]) => ({
        category,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense
      }))
      .sort((a, b) => b.expense - a.expense);
  };

  const getTopExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const getTopIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  if (loading) {
    return <div className="text-center py-8">Loading monthly report...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Monthly Report</h1>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{analytics?.totalIncome?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              ₹{analytics?.totalExpense?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Net Balance</h3>
            <p className={`text-2xl font-bold ${analytics?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{analytics?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
            <p className="text-2xl font-bold text-blue-600">
              {analytics?.transactionCount || 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8">
          <Charts analytics={analytics} />
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
            <div className="space-y-3">
              {getCategoryBreakdown().map((item, index) => (
                <div key={item.category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.category}</h3>
                    <div className="text-sm text-gray-600">
                      Income: ₹{item.income.toFixed(2)} | Expense: ₹{item.expense.toFixed(2)}
                    </div>
                  </div>
                  <div className={`font-semibold ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{item.net.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Transactions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-600 mb-2">Top Income Sources</h3>
                {getTopIncome().map((transaction, index) => (
                  <div key={transaction._id} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{transaction.category}</span>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    </div>
                    <span className="font-semibold text-green-600">₹{transaction.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-medium text-red-600 mb-2">Top Expenses</h3>
                {getTopExpenses().map((transaction, index) => (
                  <div key={transaction._id} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{transaction.category}</span>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    </div>
                    <span className="font-semibold text-red-600">₹{transaction.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Savings Analysis */}
        {analytics?.totalIncome > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(0, (analytics.balance / analytics.totalIncome) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Savings Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{analytics.balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₹{(analytics.totalIncome / 30).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Daily Income Avg</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{
                      width: `${Math.max(0, (analytics.balance / analytics.totalIncome) * 100)}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.max(0, (analytics.balance / analytics.totalIncome) * 100).toFixed(1)}% saved
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReports; 