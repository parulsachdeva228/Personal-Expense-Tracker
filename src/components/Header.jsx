import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
          <div className="flex items-center space-x-4 pt-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              isActive('/dashboard') 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/add-expense')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              isActive('/add-expense') 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add Expenses
          </button>
          <button
            onClick={() => navigate('/monthly-reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              isActive('/monthly-reports') 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monthly Reports
          </button>
        </div>
      </div>
    </div>
  );
};
