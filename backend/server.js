const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/categories');
const budgetRoutes = require('./routes/budgets');
const adminRoutes = require('./routes/admin');

const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Budget = require('./models/Budget');
const Goal = require('./models/Goal');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    // .connect('mongodb://127.0.0.1:27017/financeTrackerDB')
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});