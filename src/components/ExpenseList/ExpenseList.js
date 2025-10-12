import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import './ExpenseList.css';

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpense();

  const getCategoryColor = (category) => {
    const colors = {
      food: '#48bb78',
      transport: '#4299e1',
      shopping: '#ed8936',
      entertainment: '#9f7aea',
      bills: '#ecc94b',
      health: '#fc8181',
      other: '#a0aec0'
    };
    return colors[category] || colors.other;
  };

  if (expenses.length === 0) {
    return (
      <div className="list-container">
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p>Add your first expense to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>📋 Recent Expenses</h2>
      </div>
      {expenses.map(expense => (
        <div key={expense.id} className="expense-item">
          <div className="expense-info">
            <h3 className="expense-title">{expense.title}</h3>
            <div className="expense-meta">
              <span 
                className="category-tag"
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              >
                {expense.category}
              </span>
              <span>{new Date(expense.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="expense-amount">₹{expense.amount}</div>
          <button 
            className="delete-button"
            onClick={() => deleteExpense(expense.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;