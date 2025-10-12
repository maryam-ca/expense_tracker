import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpense } from '../../context/ExpenseContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, addExpense, deleteExpense, budget, currency, categories } = useExpense();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingId, setEditingId] = useState(null);
  const [quickAmounts] = useState([100, 200, 500, 1000, 2000]);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  // This week expenses
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekExpenses = expenses.filter(exp => new Date(exp.date) >= oneWeekAgo);
  const weekTotal = thisWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Today's expenses
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(exp => exp.date === today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Category-wise totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => 
      filter === 'all' || expense.category === filter
    )
    .filter(expense =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount': return b.amount - a.amount;
        case 'title': return a.title.localeCompare(b.title);
        case 'date': return new Date(b.date) - new Date(a.date);
        default: return new Date(b.date) - new Date(a.date);
      }
    });

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
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString()
    });
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setEditingId(expense.id);
  };

  const cancelEdit = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const getCategoryIcon = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue)?.icon || '📦';
  };

  const getCategoryColor = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue)?.color || '#a0aec0';
  };

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>🌌 Welcome back, {user.name}!</h1>
          <p>Track your expenses and explore the financial cosmos</p>
        </div>
        <div className="quick-stats">
          <div className="quick-stat">
            <span className="stat-icon">💰</span>
            <span className="stat-text">Today: {currency}{todayTotal}</span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">📅</span>
            <span className="stat-text">This Week: {currency}{weekTotal}</span>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="budget-overview cosmic-card">
        <div className="budget-header">
          <h2>💰 Budget Overview</h2>
          <div className="budget-amount">{currency}{budget.toFixed(2)}</div>
        </div>
        <div className="budget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min(budgetPercentage, 100)}%`,
                background: budgetPercentage > 80 ? 
                  'linear-gradient(90deg, #ff6b6b, #ee5a52)' :
                  budgetPercentage > 60 ?
                  'linear-gradient(90deg, #ffd93d, #ff9a3d)' :
                  'linear-gradient(90deg, #48bb78, #38a169)'
              }}
            ></div>
          </div>
          <div className="budget-details">
            <div className="budget-item">
              <span>Spent</span>
              <span className="amount spent">{currency}{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="budget-item">
              <span>Remaining</span>
              <span className="amount remaining">{currency}{remainingBudget.toFixed(2)}</span>
            </div>
            <div className="budget-item">
              <span>Usage</span>
              <span className="percentage">{budgetPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Expense */}
      <div className="quick-add-section cosmic-card">
        <h3>⚡ Quick Add Expense</h3>
        <div className="quick-amounts">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              className="quick-amount-btn"
              onClick={() => handleQuickAmount(amount)}
            >
              {currency}{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card cosmic-card">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <div className="stat-value">{currency}{totalExpenses.toFixed(2)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div className="stat-card cosmic-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{expenseCount}</div>
            <div className="stat-label">Transactions</div>
          </div>
        </div>
        
        <div className="stat-card cosmic-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-value">{currency}{averageExpense.toFixed(2)}</div>
            <div className="stat-label">Average</div>
          </div>
        </div>
        
        <div className="stat-card cosmic-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{currency}{weekTotal.toFixed(2)}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="form-section cosmic-card">
        <div className="section-header">
          <h3>{editingId ? '✏️ Edit Expense' : '➕ Add New Expense'}</h3>
          {editingId && (
            <button onClick={cancelEdit} className="cancel-btn">
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="💡 What did you spend on?"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="number"
                placeholder="💰 Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="form-input"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn cosmic-btn">
            <span className="btn-icon">
              {editingId ? '💾' : '🚀'}
            </span>
            {editingId ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown cosmic-card">
        <h3>📊 Category Breakdown</h3>
        <div className="category-list">
          {categories.map(cat => {
            const total = categoryTotals[cat.value] || 0;
            const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
            
            return (
              <div key={cat.value} className="category-item">
                <div className="category-info">
                  <span 
                    className="category-icon"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <span className="category-name">{cat.label.split(' ')[1]}</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">{currency}{total.toFixed(2)}</span>
                  <span className="category-percentage">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar cosmic-card">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="control-group">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="control-select"
          >
            <option value="all">🌌 All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="date">📅 Newest First</option>
            <option value="amount">💰 Highest Amount</option>
            <option value="title">🔤 Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="expenses-section cosmic-card">
        <div className="section-header">
          <h3>📋 Recent Expenses ({filteredExpenses.length})</h3>
          {expenses.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all expenses?')) {
                  expenses.forEach(exp => deleteExpense(exp.id));
                }
              }}
              className="clear-btn"
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌌</div>
            <h4>No expenses found</h4>
            <p>
              {searchTerm || filter !== 'all' 
                ? "Try changing your search or filter criteria" 
                : "Start by adding your first expense above!"
              }
            </p>
          </div>
        ) : (
          <div className="expenses-list">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div 
                  className="expense-icon"
                  style={{ backgroundColor: getCategoryColor(expense.category) }}
                >
                  {getCategoryIcon(expense.category)}
                </div>
                
                <div className="expense-details">
                  <h4 className="expense-title">{expense.title}</h4>
                  <div className="expense-meta">
                    <span className="expense-category">
                      {categories.find(c => c.value === expense.category)?.label}
                    </span>
                    <span className="expense-date">
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="expense-actions">
                  <div className="expense-amount">{currency}{expense.amount.toFixed(2)}</div>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="action-btn edit-btn"
                      title="Edit expense"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="action-btn delete-btn"
                      title="Delete expense"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Tips */}
      <div className="tips-section cosmic-card">
        <h3>💡 Financial Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">📝</span>
            <div className="tip-content">
              <h4>Track Daily</h4>
              <p>Record expenses daily to maintain accurate financial records</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <div className="tip-content">
              <h4>Set Budgets</h4>
              <p>Create category-wise budgets to control spending</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📊</span>
            <div className="tip-content">
              <h4>Review Weekly</h4>
              <p>Analyze your spending patterns every week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;