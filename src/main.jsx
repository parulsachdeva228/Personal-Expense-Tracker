import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddExpense from './pages/AddExpense.jsx'
import MonthlyReports from './pages/MonthlyReports.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'add-expense',
        element: <AddExpense />
      },
      {
        path: 'edit-expense/:id',
        element: <AddExpense />
      },
      {
        path: 'monthly-reports',
        element: <MonthlyReports />
      },
      {
        path: 'adminlogin',
        element: <AdminLogin />
      },
      {
        path: 'admindashboard',
        element: <AdminDashboard />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
