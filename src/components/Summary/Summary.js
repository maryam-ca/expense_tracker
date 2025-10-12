import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import './Summary.css';

const Summary = () => {
  const { expenses } = useExpense();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  return (
    <div className="summary-container">
      <div className="summary-card">
        <div className="summary-value">₹{totalExpenses.toFixed(2)}</div>
        <div className="summary-label">Total Spent</div>
      </div>
      <div className="summary-card">
        <div className="summary-value">{expenseCount}</div>
        <div className="summary-label">Total Expenses</div>
      </div>
      <div className="summary-card">
        <div className="summary-value">₹{averageExpense.toFixed(2)}</div>
        <div className="summary-label">Average per Expense</div>
      </div>
    </div>
  );
};

export default Summary;