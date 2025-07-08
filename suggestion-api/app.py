from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta, timezone
import numpy as np

app = Flask(__name__)
CORS(app)

def analyze_expenses(expense_data):
    """
    Analyze expense data and provide smart suggestions
    Input: JSON array of expense data
    Output: List of budget improvement tips
    """
    try:
        # Convert to DataFrame
        df = pd.DataFrame(expense_data)
        
        if df.empty:
            return ["No expense data available for analysis"]
        
        # Convert date strings to datetime
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        
        # Get current date and calculate 30 days ago
        current_date = datetime.now(timezone.utc)
        thirty_days_ago = current_date - timedelta(days=30)
        
        # Filter for last 30 days
        recent_expenses = df[df['date'] >= thirty_days_ago]
        
        if recent_expenses.empty:
            return ["No recent expenses found in the last 30 days"]
        
        suggestions = []
        
        # 1. Top spending categories
        category_totals = recent_expenses.groupby('category')['amount'].sum().sort_values(ascending=False)
        top_category = category_totals.index[0]
        top_amount = round(category_totals.iloc[0])
        
        suggestions.append(f"Your highest spending category is '{top_category}' with ₹ {top_amount} in the last 30 days. Consider setting a budget for this category.")
        
        # 2. Daily average spending
        daily_avg = round(recent_expenses['amount'].sum() / 30)
        suggestions.append(f"Your daily average spending is ₹ {daily_avg}. Aim to keep this under your daily budget target.")
        
        # 3. Spending frequency analysis
        spending_days = recent_expenses['date'].dt.date.nunique()
        if spending_days > 25:
            suggestions.append("You're making purchases almost every day. Consider consolidating purchases to reduce impulse buying.")
        elif spending_days < 10:
            suggestions.append("Good job! You're not making frequent small purchases, which helps control spending.")
        
        # 4. Large transactions
        large_transactions = recent_expenses[recent_expenses['amount'] > recent_expenses['amount'].mean() * 2]
        if not large_transactions.empty:
            suggestions.append(f"You have {len(large_transactions)} large transactions. Review if these were necessary or could be reduced.")
        
        # 5. Category diversity
        unique_categories = recent_expenses['category'].nunique()
        if unique_categories > 8:
            suggestions.append("You're spending across many categories. Consider consolidating similar expenses to better track your spending.")
        
        # 6. Weekend vs weekday spending
        recent_expenses['day_of_week'] = recent_expenses['date'].dt.dayofweek
        weekend_spending = recent_expenses[recent_expenses['day_of_week'].isin([5, 6])]['amount'].sum()
        weekday_spending = recent_expenses[~recent_expenses['day_of_week'].isin([5, 6])]['amount'].sum()
        
        if weekend_spending > weekday_spending * 1.5:
            suggestions.append("Your weekend spending is significantly higher than weekday spending. Consider planning weekend activities with a budget in mind.")
        
        # 7. Spending trend
        if len(recent_expenses) >= 7:
            weekly_totals = recent_expenses.groupby(recent_expenses['date'].dt.isocalendar().week)['amount'].sum()
            if len(weekly_totals) >= 2:
                trend = weekly_totals.iloc[-1] - weekly_totals.iloc[-2]
                if trend > 0:
                    suggestions.append("Your spending has increased in the recent week. Review your recent purchases to identify any unnecessary expenses.")
                else:
                    suggestions.append("Great! Your spending has decreased in the recent week. Keep up the good work!")
        
        # 8. Savings opportunity
        total_spent = recent_expenses['amount'].sum()
        if total_spent > 1000:  
            potential_savings = round(total_spent * 0.1)  
            suggestions.append(f"By reducing your spending by just 10%, you could save ₹ {potential_savings} this month.")
        
        # 9. Category-specific advice
        for category, amount in category_totals.head(3).items():
            if category.lower() in ['food', 'dining', 'restaurant']:
                if amount > 300:
                    suggestions.append(f"Your '{category}' spending is high at ₹ {round(amount)}. Consider cooking more meals at home to save money.")
            elif category.lower() in ['shopping', 'clothing', 'electronics']:
                if amount > 200:
                    suggestions.append(f"Your '{category}' spending is ₹ {round(amount)}. Wait 24 hours before making non-essential purchases to avoid impulse buying.")
            elif category.lower() in ['transport', 'gas', 'uber']:
                if amount > 150:
                    suggestions.append(f"Your '{category}' spending is ₹ {round(amount)}. Consider carpooling or using public transportation to reduce costs.")
        
        # 10. Final suggestion
        if len(suggestions) <= 3:
            suggestions.append("Excellent financial management! You're doing a great job keeping your expenses under control.")
        
        return suggestions[:5]  # Return top 5 suggestions
        
    except Exception as e:
        return [f"Error analyzing expenses: {str(e)}"]

@app.route("/suggest", methods=["POST"])
def get_suggestions():
    try:
        expense_data = request.get_json()
        suggestions = analyze_expenses(expense_data)
        return jsonify(suggestions)
    except Exception as e:
        return jsonify([f"Error: {str(e)}"])

# 👇 required for Render
if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
