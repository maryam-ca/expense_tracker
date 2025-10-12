import React, { useState, useEffect } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Header from './components/Header/Header';
import Notifications from './components/Notifications/Notifications';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Add notification function
  const addNotification = (type, message) => {
    const id = Date.now().toString();
    const notification = { id, type, message, timestamp: new Date() };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <ExpenseProvider>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        {/* Cosmic Background */}
        <div className="cosmic-background">
          <div className="cosmic-stars"></div>
          <div className="cosmic-nebula"></div>
          <div className="cosmic-planet"></div>
          <div className="cosmic-asteroids">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="asteroid" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 30}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}></div>
            ))}
          </div>
        </div>

        <Notifications 
          notifications={notifications} 
          setNotifications={setNotifications} 
        />

        <Header 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          setShowBudgetSetup={setShowBudgetSetup}
        />

        <main className="main-content">
          {showBudgetSetup ? (
            <Settings 
              setShowBudgetSetup={setShowBudgetSetup}
              addNotification={addNotification}
            />
          ) : showAnalytics ? (
            <Analytics 
              setShowAnalytics={setShowAnalytics}
            />
          ) : (
            <Dashboard addNotification={addNotification} />
          )}
        </main>

        <footer className="cosmic-footer">
          <p>🚀 Built with React • Exploring the financial cosmos • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </ExpenseProvider>
  );
}

export default App;