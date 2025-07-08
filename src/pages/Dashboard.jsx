import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseTable from '../components/ExpenseTable';
import BudgetAlerts from '../components/BudgetAlerts';
import Charts from '../components/Charts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://personal-expense-tracker-3cph.onrender.com/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹ {analytics?.totalIncome || '0'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">
                ₹ {analytics?.totalExpense || '0'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
              <p className={`text-2xl font-bold ${analytics?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹ {analytics?.balance || '0'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.transactionCount || 0}
              </p>
            </div>
          </div>

          {/* Smart Suggestions */}
          {analytics?.suggestions && analytics.suggestions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Smart Suggestions</h2>
              <div className="space-y-2">
                {analytics.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Charts analytics={analytics} />
          </div>

          {/* Budget Alerts */}
          <div className="mb-8">
            <BudgetAlerts />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 