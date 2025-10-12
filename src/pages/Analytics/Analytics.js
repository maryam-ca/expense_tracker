import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpense } from '../../context/ExpenseContext';
import './Analytics.css';

const Analytics = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { expenses, currency, categories } = useExpense();
  
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartData, setChartData] = useState([]);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  // Category-wise totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Monthly totals
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Weekly totals
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weeklyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const week = `Week ${getWeekNumber(date)}`;
    acc[week] = (acc[week] || 0) + expense.amount;
    return acc;
  }, {});

  // Daily averages
  const dailyAverages = expenses.reduce((acc, expense) => {
    const day = new Date(expense.date).toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || { total: 0, count: 0 });
    acc[day].total += expense.amount;
    acc[day].count += 1;
    return acc;
  }, {});

  // Top expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Spending trends
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const lastThreeMonths = [...Array(3)].map((_, i) => {
    const date = new Date(currentYear, currentMonth - i, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }).reverse();

  const monthlyTrends = lastThreeMonths.map(month => ({
    month,
    total: monthlyTotals[month] || 0
  }));

  // Prepare chart data based on selected time range
  useEffect(() => {
    let data = [];
    
    switch (timeRange) {
      case 'week':
        data = Object.entries(weeklyTotals).map(([week, total]) => ({
          label: week,
          value: total,
          percentage: (total / totalExpenses) * 100
        }));
        break;
      
      case 'month':
        data = Object.entries(monthlyTotals).map(([month, total]) => ({
          label: month,
          value: total,
          percentage: (total / totalExpenses) * 100
        }));
        break;
      
      case 'category':
        data = categories.map(cat => ({
          label: cat.label.split(' ')[1],
          value: categoryTotals[cat.value] || 0,
          percentage: ((categoryTotals[cat.value] || 0) / totalExpenses) * 100,
          color: cat.color
        })).filter(item => item.value > 0);
        break;
      
      default:
        data = Object.entries(monthlyTotals).map(([month, total]) => ({
          label: month,
          value: total,
          percentage: (total / totalExpenses) * 100
        }));
    }
    
    setChartData(data);
  }, [timeRange, expenses]);

  // Filter expenses by category
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.category === selectedCategory);

  const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Insights
  const highestSpendingDay = Object.entries(dailyAverages).reduce((max, [day, data]) => {
    const average = data.total / data.count;
    return average > (max.average || 0) ? { day, average } : max;
  }, {});

  const mostUsedCategory = Object.entries(categoryTotals).reduce((max, [category, total]) => {
    return total > (max.total || 0) ? { category, total } : max;
  }, {});

  const mostUsedCategoryInfo = categories.find(cat => cat.value === mostUsedCategory.category);

  return (
    <div className="analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Cosmic Analytics</h1>
          <p>Deep insights into your spending patterns across the universe</p>
        </div>
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
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
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="controls-section cosmic-card">
        <div className="controls-header">
          <h3>🕐 Time Range</h3>
          <div className="time-buttons">
            <button 
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Weekly
            </button>
            <button 
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Monthly
            </button>
            <button 
              className={`time-btn ${timeRange === 'category' ? 'active' : ''}`}
              onClick={() => setTimeRange('category')}
            >
              By Category
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-container cosmic-card full-width">
          <h3>📈 Spending Trends</h3>
          <div className="bar-chart">
            {chartData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.label}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar"
                    style={{ 
                      height: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`,
                      background: item.color || `linear-gradient(to top, #667eea, #764ba2)`
                    }}
                  ></div>
                </div>
                <div className="bar-value">
                  {currency}{item.value.toFixed(2)}
                  <div className="bar-percentage">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-container cosmic-card">
          <h3>🥧 Category Distribution</h3>
          <div className="pie-chart">
            {categories.filter(cat => categoryTotals[cat.value]).map((cat, index) => {
              const total = categoryTotals[cat.value] || 0;
              const percentage = (total / totalExpenses) * 100;
              
              return (
                <div key={cat.value} className="pie-item">
                  <div className="pie-color" style={{ backgroundColor: cat.color }}></div>
                  <div className="pie-info">
                    <span className="pie-label">{cat.label.split(' ')[1]}</span>
                    <span className="pie-percentage">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="pie-amount">{currency}{total.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="chart-container cosmic-card">
          <h3>📅 Last 3 Months</h3>
          <div className="trend-chart">
            {monthlyTrends.map((trend, index) => (
              <div key={index} className="trend-item">
                <div className="trend-month">{trend.month}</div>
                <div className="trend-bar">
                  <div 
                    className="trend-fill"
                    style={{ 
                      width: `${(trend.total / Math.max(...monthlyTrends.map(t => t.total))) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="trend-amount">{currency}{trend.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section cosmic-card">
        <h3>🔍 Spending Insights</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-icon">📅</div>
            <div className="insight-content">
              <h4>Highest Spending Day</h4>
              <p>{highestSpendingDay.day || 'No data'} - Average: {currency}{highestSpendingDay.average?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">🏆</div>
            <div className="insight-content">
              <h4>Most Used Category</h4>
              <p>{mostUsedCategoryInfo?.label || 'No data'} - {currency}{mostUsedCategory.total?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">💰</div>
            <div className="insight-content">
              <h4>Largest Expense</h4>
              <p>
                {topExpenses[0]?.title || 'No data'} - 
                {currency}{topExpenses[0]?.amount.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
          
          <div className="insight-item">
            <div className="insight-icon">📱</div>
            <div className="insight-content">
              <h4>Daily Average</h4>
              <p>{currency}{(totalExpenses / 30).toFixed(2)} per day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter cosmic-card">
        <h3>🎯 Category Analysis</h3>
        <div className="filter-controls">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          
          <div className="filter-stats">
            <span>{filteredExpenses.length} transactions</span>
            <span className="filter-total">{currency}{filteredTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Top Expenses */}
      <div className="top-expenses cosmic-card">
        <h3>🏆 Top 5 Expenses</h3>
        <div className="expenses-list">
          {topExpenses.map((expense, index) => {
            const categoryInfo = categories.find(cat => cat.value === expense.category);
            
            return (
              <div key={expense.id} className="top-expense-item">
                <div className="expense-rank">#{index + 1}</div>
                <div 
                  className="expense-icon"
                  style={{ backgroundColor: categoryInfo?.color }}
                >
                  {categoryInfo?.icon}
                </div>
                <div className="expense-details">
                  <h4 className="expense-title">{expense.title}</h4>
                  <div className="expense-meta">
                    <span className="expense-category">{categoryInfo?.label}</span>
                    <span className="expense-date">
                      {new Date(expense.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="expense-amount">{currency}{expense.amount.toFixed(2)}</div>
              </div>
            );
          })}
          
          {topExpenses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No expenses to analyze yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section cosmic-card">
        <h3>📤 Export Data</h3>
        <div className="export-options">
          <button className="export-btn">
            📄 Export as CSV
          </button>
          <button className="export-btn">
            📊 Export as PDF Report
          </button>
          <button className="export-btn">
            🖼️ Export Charts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;