import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const Charts = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState('pie');

  const getCategoryColor = (index) => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#059669'];
    return colors[index % colors.length];
  };

  const getTotalExpenses = () => {
    if (!analytics?.categoryBreakdown) return 0;
    return Object.values(analytics.categoryBreakdown)
      .reduce((sum, data) => sum + data.expense, 0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF6', '#FF6699', '#6B7280', '#059669'];

  const getExpenseCategories = () => {
    if (!analytics?.categoryBreakdown) return [];
    return Object.entries(analytics.categoryBreakdown)
      .filter(([_, data]) => data.expense > 0)
      .map(([category, data]) => ({
        name: category,
        value: data.expense
      }))
      .sort((a, b) => b.value - a.value);
  };

  const renderPieChart = () => {
    const data = getExpenseCategories();
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No expense data available for pie chart
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            data={data}
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };

  const renderLineChart = () => {
    // Example data for income and expenses by month
    const data = [
      { month: 'Jan', income: 1200, expense: 1000 },
      { month: 'Feb', income: 1400, expense: 1200 },
      { month: 'Mar', income: 1300, expense: 1100 },
      { month: 'Apr', income: 1600, expense: 1400 },
      { month: 'May', income: 1500, expense: 1300 },
      { month: 'Jun', income: 1700, expense: 1500 },
    ];
    return (
      <div className="flex flex-col items-center">
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
        </LineChart>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Financial Charts</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === 'pie'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setActiveTab('line')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>
      
      <div className="min-h-64">
        {activeTab === 'pie' ? renderPieChart() : renderLineChart()}
      </div>
    </div>
  );
};

export default Charts; 