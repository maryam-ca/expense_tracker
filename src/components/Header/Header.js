import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import './Header.css';

const Header = ({ darkMode, setDarkMode, showAnalytics, setShowAnalytics, setShowBudgetSetup }) => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="app-nav cosmic-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="brand-logo">🚀</div>
            <h1>Cosmic Expense Tracker</h1>
          </div>
          
          {user && (
            <div className="nav-controls">
              <button 
                className={`nav-btn ${showAnalytics ? 'active' : ''}`}
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                {showAnalytics ? '📊 Analytics' : '📈 Analytics'}
              </button>
              <button 
                className="nav-btn"
                onClick={() => setShowBudgetSetup(true)}
              >
                ⚙️ Settings
              </button>
              <button 
                className="user-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                👤 {user.name}
              </button>
              <button 
                className="theme-toggle cosmic-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '🌙 Cosmic' : '☀️ Light'}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* User Profile Dropdown */}
      {showProfile && user && (
        <div className="profile-dropdown">
          <UserProfile />
        </div>
      )}
    </>
  );
};

export default Header;