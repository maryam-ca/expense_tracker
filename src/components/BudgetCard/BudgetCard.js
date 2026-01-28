import React from 'react';
import './BudgetCard.css';

const BudgetCard = ({ budget, totalExpenses, currency }) => {
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  return (
    <div className="budget-section cosmic-budget">
      <div className="budget-card cosmic-card">
        <div className="budget-header">
          <h3>💰 Cosmic Budget</h3>
          <div className="budget-display">
            <span className="budget-amount">{currency}{budget.toFixed(2)}</span>
            <span className="budget-label">Monthly Budget</span>
          </div>
        </div>
        <div className="budget-progress cosmic-progress">
          <div className="progress-bar cosmic-bar">
            <div 
              className="progress-fill cosmic-fill"
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
          <div className="budget-stats cosmic-stats">
            <div className="stat">
              <span>Spent</span>
              <span>{currency}{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span>Remaining</span>
              <span>{currency}{remainingBudget.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span>Usage</span>
              <span>{budgetPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
