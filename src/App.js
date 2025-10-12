import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import './App.css';

// Main App Content
const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show loading spinner
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🚀</div>
          <h2>Cosmic Expense Tracker</h2>
          <div className="loading-spinner-large"></div>
          <p>Preparing your cosmic journey...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ExpenseProvider>
      <div className="app-container">
        {/* Cosmic Background */}
        <div className="cosmic-background">
          <div className="cosmic-stars"></div>
          <div className="cosmic-nebula"></div>
        </div>

        {/* Simple Navigation */}
        <nav className="simple-nav">
          <div className="nav-brand">
            <div className="brand-logo">🚀</div>
            <h1>Cosmic Expense Tracker</h1>
          </div>
          <div className="nav-controls">
            <button 
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentPage('analytics')}
            >
              📈 Analytics
            </button>
            <button 
              className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={() => setCurrentPage('settings')}
            >
              ⚙️ Settings
            </button>
            <div className="user-info">
              👤 {user.name}
            </div>
          </div>
        </nav>

        <main className="main-content">
          {renderPage()}
        </main>

        <footer className="cosmic-footer">
          <p>🚀 Welcome, {user.name}! • Exploring the financial cosmos • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </ExpenseProvider>
  );
};

// Main App Wrapper
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;