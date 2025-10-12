import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import './ExpenseForm.css';

const ExpenseForm = () => {
  const { addExpense } = useExpense();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food'
  });

  const categories = [
    'food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    setFormData({
      title: '',
      amount: '',
      category: 'food'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
      <h2>➕ Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          className="form-input"
          min="0"
          step="0.01"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" className="submit-button">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;