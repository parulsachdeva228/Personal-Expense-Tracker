# Personal Finance Tracker

A full-stack web app to track daily expenses, set monthly budgets, view reports, and get smart suggestions to manage your money better. Built with React (frontend), Node.js/Express (backend), MongoDB (database), and Python (for smart suggestions).

## What This App Does
- **Track Expenses:** Add, edit, and delete daily expenses with category, payment method, and notes.
- **Budgets & Alerts:** Set monthly budgets per category and get alerts when you approach or exceed them.
- **Reports & Charts:** Visualize your spending with pie and line charts, and see monthly summaries.
- **Smart Suggestions:** Get AI-powered tips to improve your spending habits, powered by a Python service.
- **Admin Panel:** Admin can view all users, their spending, and remove users if needed.

## How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)
- Python 3.8+ (for smart suggestions)

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd suggestion
python -m venv venv

venv\Scripts\activate
```

### 2. Start MongoDB
Make sure MongoDB is running on system:

### 3. Start the Backend Server
```bash
# Start Node.js server
node backend/server.js
```
The backend will run on `http://localhost:5000`

### 4. Start the Python Smart Suggestions Service
```bash
cd suggestion
# Activate Python virtual environment

venv\Scripts\activate
```

### 5. Start the Frontend
```bash
# In a new terminal (from the project root)
npm run dev
```
The frontend will run on `http://localhost:5173`

### 6. Access the Application
- Open your browser and go to `http://localhost:5173`
- Create a new account or login with existing credentials
- Start managing your finances!

## Features

### Frontend (React)
- **Pages:**
  - Login/Register - User authentication
  - Dashboard - Overview with smart suggestions
  - Add/Edit Expense - Transaction management
  - Monthly Reports - Detailed financial analysis

- **Components:**
  - ExpenseTable - Transaction list with edit/delete
  - BudgetAlerts - Budget warnings and alerts
  - Charts - Pie and line charts for visualization

### Backend (Node.js/Express)
- **MVC Architecture:**
  - Models: User, Transaction, Category, Budget, Goal
  - Controllers: Auth, Transaction, Analytics, Category, Budget
  - Routes: Organized API endpoints
  - Middleware: Authentication

- **Features:**
  - JWT Authentication
  - Password hashing with bcryptjs
  - MongoDB integration
  - Smart suggestions via Python integration

### Smart Suggestions (Python)
- **Analysis:**
  - 30-day spending analysis
  - Top spending categories identification
  - Previous month comparison
  - Budget improvement tips

## Project Structure

```
Finance tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Category.js
│   │   ├── Budget.js
│   │   └── Goal.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── analyticsController.js
│   │   ├── categoryController.js
│   │   └── budgetController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── analytics.js
│   │   ├── categories.js
│   │   └── budgets.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddExpense.jsx
│   │   └── MonthlyReports.jsx
│   ├── components/
│   │   ├── ExpenseTable.jsx
│   │   ├── BudgetAlerts.jsx
│   │   └── Charts.jsx
│   └── main.jsx
├── suggestion/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/analytics` - Get financial analytics with smart suggestions

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## Smart Suggestions Features

The Python script analyzes your expense data and provides:

1. **Top Spending Categories** - Identifies your highest spending areas
2. **Daily Average Spending** - Calculates and suggests daily budget targets
3. **Spending Frequency Analysis** - Advises on purchase consolidation
4. **Large Transaction Review** - Flags unusually large expenses
5. **Category Diversity** - Suggests consolidating similar expenses
6. **Weekend vs Weekday Spending** - Identifies spending patterns
7. **Spending Trends** - Tracks weekly spending changes
8. **Savings Opportunities** - Calculates potential savings
9. **Category-Specific Advice** - Tailored recommendations for different expense types
10. **Positive Reinforcement** - Encourages good financial habits

## Technologies Used

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Smart Suggestions
- Python 3.8+
- Pandas for data analysis
- NumPy for numerical operations

## License

This project is open source and available under the personal github repo.

### Test Credentials
email: user@amlgo.com
password: amlgo

### Deployed Link: 
- Frontend (Versel): https://personal-expense-tracker-pf1c234lt-paruls-projects-c3c8915f.vercel.app/
- Backend (Render): https://personal-expense-tracker-3cph.onrender.com/
- Flask (Render): https://flask-suggestion-api.onrender.com/

### Extra features added
Impleted Admin login to view users and remove users
admin info: email: preyan228@gmail.com
            password: preyan07
