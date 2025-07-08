import { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetAlerts = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://personal-expense-tracker-3cph.onrender.com/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertLevel = (spent, amount) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'normal';
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-400 text-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default: return 'bg-green-100 border-green-400 text-green-700';
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return '✅';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading budget alerts...</div>;
  }

  const alerts = budgets
    .map(budget => ({
      ...budget,
      alertLevel: getAlertLevel(budget.spent, budget.amount),
      percentage: (budget.spent / budget.amount) * 100
    }))
    .filter(budget => budget.alertLevel !== 'normal');

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Alerts</h2>
        <div className="text-center text-gray-500">
          <p>✅ All budgets are within normal limits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Alerts</h2>
      <div className="space-y-3">
        {alerts.map((budget) => (
          <div
            key={budget._id}
            className={`p-4 border rounded-lg ${getAlertColor(budget.alertLevel)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getAlertIcon(budget.alertLevel)}</span>
                <div>
                  <h3 className="font-semibold">{budget.category}</h3>
                  <p className="text-sm">
                    {budget.alertLevel === 'critical' 
                      ? 'Budget exceeded!' 
                      : budget.alertLevel === 'warning' 
                        ? 'Approaching budget limit' 
                        : 'Budget on track'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                </p>
                <p className="text-sm">
                  {budget.percentage.toFixed(1)}% used
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    budget.alertLevel === 'critical' 
                      ? 'bg-red-600' 
                      : budget.alertLevel === 'warning' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts; 