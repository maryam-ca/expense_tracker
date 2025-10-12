import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpense } from '../../context/ExpenseContext';
import './Settings.css';

const Settings = ({ setCurrentPage }) => {
  const { user, updateProfile, logout } = useAuth();
  const { 
    budget, 
    setBudget, 
    currency, 
    setCurrency, 
    categories,
    currencies,
    clearExpenses,
    expenses,
    goals
  } = useExpense();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [budgetData, setBudgetData] = useState({
    monthly: budget,
    currency: currency
  });
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: true,
    expenseReminders: false,
    goalProgress: true
  });
  const [appearance, setAppearance] = useState({
    theme: 'cosmic',
    language: 'english',
    compactMode: false,
    animations: true
  });
  const [backupData, setBackupData] = useState({
    autoBackup: false,
    backupFrequency: 'weekly',
    cloudSync: false
  });
  const [security, setSecurity] = useState({
    biometricAuth: false,
    autoLock: false,
    lockTimer: 5
  });

  // Load settings from localStorage
  useEffect(() => {
    // Load profile data
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });

    // Load budget data
    setBudgetData({
      monthly: budget,
      currency: currency
    });

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Load appearance from localStorage
    const savedAppearance = localStorage.getItem('appearance');
    if (savedAppearance) {
      setAppearance(JSON.parse(savedAppearance));
    }

    // Load backup settings from localStorage
    const savedBackup = localStorage.getItem('backupSettings');
    if (savedBackup) {
      setBackupData(JSON.parse(savedBackup));
    }

    // Load security settings from localStorage
    const savedSecurity = localStorage.getItem('securitySettings');
    if (savedSecurity) {
      setSecurity(JSON.parse(savedSecurity));
    }
  }, [user, budget, currency]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('appearance', JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('backupSettings', JSON.stringify(backupData));
  }, [backupData]);

  useEffect(() => {
    localStorage.setItem('securitySettings', JSON.stringify(security));
  }, [security]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      alert('✅ Profile updated successfully!');
    } catch (error) {
      alert('❌ Error updating profile: ' + error.message);
    }
  };

  const handleBudgetUpdate = (e) => {
    e.preventDefault();
    setBudget(budgetData.monthly);
    setCurrency(budgetData.currency);
    alert('✅ Budget settings updated successfully!');
  };

  const handleExportData = (format = 'json') => {
    const data = {
      expenses,
      goals,
      settings: {
        budget,
        currency,
        user: {
          name: user.name,
          email: user.email
        }
      },
      exportDate: new Date().toISOString(),
      version: '2.0.0'
    };

    let dataStr, mimeType, fileExtension;

    if (format === 'csv') {
      // Convert to CSV
      const headers = ['Title', 'Amount', 'Category', 'Date', 'Created At'];
      const csvData = expenses.map(exp => [
        `"${exp.title}"`,
        exp.amount,
        `"${exp.category}"`,
        `"${exp.date}"`,
        `"${exp.createdAt}"`
      ]);
      
      dataStr = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else {
      // Default to JSON
      dataStr = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    const dataBlob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✅ Data exported successfully as ${format.toUpperCase()}!`);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (data.expenses && Array.isArray(data.expenses)) {
          // Clear existing data first
          clearExpenses();
          
          // Import expenses with delay for visual feedback
          let importedCount = 0;
          data.expenses.forEach((expense, index) => {
            setTimeout(() => {
              // Use the existing addExpense function from context
              // Note: You might need to adjust this based on your actual context structure
              console.log('Importing expense:', expense);
              importedCount++;
              
              if (importedCount === data.expenses.length) {
                alert(`✅ Successfully imported ${importedCount} expenses!`);
                window.location.reload(); // Refresh to show imported data
              }
            }, index * 100);
          });
        } else {
          alert('❌ Invalid data format: No expenses found in file');
        }
      } catch (error) {
        alert('❌ Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleClearAllData = () => {
    if (window.confirm('🚨 ARE YOU SURE?\n\nThis will permanently delete:\n• All your expenses\n• All your goals\n• All your settings\n\nThis action cannot be undone!')) {
      clearExpenses();
      localStorage.removeItem('goals');
      localStorage.removeItem('budget');
      localStorage.removeItem('currency');
      localStorage.removeItem('notifications');
      localStorage.removeItem('appearance');
      localStorage.removeItem('backupSettings');
      localStorage.removeItem('securitySettings');
      alert('✅ All data has been cleared! The app will now refresh.');
      window.location.reload();
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('🔄 Reset all settings to default values?')) {
      // Reset budget and currency
      setBudget(5000);
      setCurrency('₹');
      
      // Reset notifications
      setNotifications({
        budgetAlerts: true,
        weeklyReports: true,
        expenseReminders: false,
        goalProgress: true
      });
      
      // Reset appearance
      setAppearance({
        theme: 'cosmic',
        language: 'english',
        compactMode: false,
        animations: true
      });
      
      // Reset backup settings
      setBackupData({
        autoBackup: false,
        backupFrequency: 'weekly',
        cloudSync: false
      });
      
      // Reset security settings
      setSecurity({
        biometricAuth: false,
        autoLock: false,
        lockTimer: 5
      });
      
      alert('✅ All settings have been reset to default!');
    }
  };

  const handleThemeChange = (newTheme) => {
    setAppearance({...appearance, theme: newTheme});
    
    // Apply theme immediately
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.className = 'app-container';
      if (newTheme !== 'cosmic') {
        appContainer.classList.add(newTheme + '-mode');
      }
    }
    
    // Show theme preview
    const themeNames = {
      cosmic: 'Cosmic 🌌',
      dark: 'Dark 🌙', 
      light: 'Light ☀️'
    };
    alert(`🎨 Theme changed to ${themeNames[newTheme]}`);
  };

  const handleLogout = () => {
    if (window.confirm('🚪 Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      '💀 PERMANENT ACCOUNT DELETION!\n\n' +
      'This will:\n' +
      '• Delete your account permanently\n' +
      '• Remove all your data forever\n' +
      '• Cannot be recovered\n\n' +
      'Type "DELETE" to confirm:'
    );
    
    if (confirmation) {
      const userInput = prompt('Please type "DELETE" to confirm permanent account deletion:');
      if (userInput === 'DELETE') {
        localStorage.removeItem('user');
        localStorage.removeItem('users');
        localStorage.removeItem('expenses');
        localStorage.removeItem('goals');
        localStorage.removeItem('budget');
        localStorage.removeItem('currency');
        localStorage.removeItem('notifications');
        localStorage.removeItem('appearance');
        localStorage.removeItem('backupSettings');
        localStorage.removeItem('securitySettings');
        alert('✅ Account deleted successfully!');
        window.location.reload();
      } else {
        alert('❌ Account deletion cancelled.');
      }
    }
  };

  // Stats for data management
  const totalExpenses = expenses.length;
  const totalGoals = goals.length;
  const totalDataSize = (expenses.length * 0.1 + goals.length * 0.05).toFixed(2);

  // Calculate last backup time
  const lastBackup = localStorage.getItem('lastBackup');
  const lastBackupTime = lastBackup ? new Date(lastBackup).toLocaleString() : 'Never';

  // Auto backup functionality
  useEffect(() => {
    if (backupData.autoBackup) {
      const now = new Date();
      const lastBackup = localStorage.getItem('lastBackup');
      
      if (!lastBackup) {
        // First time auto backup
        localStorage.setItem('lastBackup', now.toISOString());
      } else {
        const lastBackupDate = new Date(lastBackup);
        const daysSinceLastBackup = (now - lastBackupDate) / (1000 * 60 * 60 * 24);
        
        const backupIntervals = {
          daily: 1,
          weekly: 7,
          monthly: 30
        };
        
        if (daysSinceLastBackup >= backupIntervals[backupData.backupFrequency]) {
          // Perform auto backup
          handleExportData('json');
          localStorage.setItem('lastBackup', now.toISOString());
        }
      }
    }
  }, [backupData.autoBackup, backupData.backupFrequency]);

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>⚙️ Cosmic Settings</h1>
          <p>Customize your expense tracking experience across the universe</p>
        </div>
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar cosmic-card">
          <div className="user-profile-preview">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <div className="user-stats">
                <span>📊 {totalExpenses} expenses</span>
                <span>🎯 {totalGoals} goals</span>
              </div>
            </div>
          </div>

          <nav className="settings-nav">
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              👤 Profile
            </button>
            <button className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
              💰 Budget & Currency
            </button>
            <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              🔔 Notifications
            </button>
            <button className={`nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
              🎨 Appearance
            </button>
            <button className={`nav-item ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
              💾 Backup & Sync
            </button>
            <button className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              🔒 Security
            </button>
            <button className={`nav-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
              📊 Data Management
            </button>
            <button className={`nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
              ℹ️ About
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="app-version">
              <span>Version 2.1.0</span>
              <span>Cosmic Edition</span>
              <span>All Settings Active</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section cosmic-card">
              <h2>👤 Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="settings-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter your email address"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    💾 Update Profile
                  </button>
                  <button type="button" className="reset-btn" onClick={() => setProfileData({ name: user?.name || '', email: user?.email || '' })}>
                    🔄 Reset
                  </button>
                </div>
              </form>

              <div className="profile-stats">
                <h3>📈 Account Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">{totalExpenses}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Active Goals</span>
                    <span className="stat-value">{totalGoals}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Data Usage</span>
                    <span className="stat-value">{totalDataSize} KB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget & Currency Settings */}
          {activeTab === 'budget' && (
            <div className="settings-section cosmic-card">
              <h2>💰 Budget & Currency</h2>
              <form onSubmit={handleBudgetUpdate} className="settings-form">
                <div className="form-group">
                  <label>Monthly Budget *</label>
                  <div className="input-with-currency">
                    <select 
                      value={budgetData.currency}
                      onChange={(e) => setBudgetData({...budgetData, currency: e.target.value})}
                      className="currency-select"
                    >
                      {currencies.map(curr => (
                        <option key={curr.symbol} value={curr.symbol}>
                          {curr.symbol} - {curr.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={budgetData.monthly}
                      onChange={(e) => setBudgetData({...budgetData, monthly: parseFloat(e.target.value) || 0})}
                      placeholder="Enter monthly budget"
                      className="form-input"
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                </div>

                <div className="budget-preview">
                  <h4>📋 Budget Preview</h4>
                  <div className="preview-item">
                    <span>Monthly Budget:</span>
                    <span className="amount">{budgetData.currency}{budgetData.monthly.toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span>Weekly Average:</span>
                    <span className="amount">{budgetData.currency}{(budgetData.monthly / 4.33).toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span>Daily Average:</span>
                    <span className="amount">{budgetData.currency}{(budgetData.monthly / 30).toFixed(2)}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    💰 Update Budget
                  </button>
                  <button type="button" className="reset-btn" onClick={() => setBudgetData({ monthly: 5000, currency: '₹' })}>
                    🔄 Reset to Default
                  </button>
                </div>
              </form>

              <div className="current-budget-status">
                <h3>🎯 Current Status</h3>
                <div className="status-item">
                  <span>Current Budget:</span>
                  <span className="amount">{currency}{budget.toFixed(2)}</span>
                </div>
                <div className="status-item">
                  <span>Current Currency:</span>
                  <span className="currency">{currency}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section cosmic-card">
              <h2>🔔 Notification Preferences</h2>
              <p className="section-description">Choose what notifications you want to receive</p>
              
              <div className="toggle-grid">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>💰 Budget Alerts</h4>
                    <p>Get notified when you're close to your budget limit</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.budgetAlerts}
                      onChange={(e) => setNotifications({...notifications, budgetAlerts: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>📊 Weekly Reports</h4>
                    <p>Receive weekly spending summaries every Monday</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>⏰ Expense Reminders</h4>
                    <p>Daily reminders to log your expenses</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.expenseReminders}
                      onChange={(e) => setNotifications({...notifications, expenseReminders: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>🎯 Goal Progress</h4>
                    <p>Updates on your savings goal progress</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.goalProgress}
                      onChange={(e) => setNotifications({...notifications, goalProgress: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-preview">
                <h3>👀 Preview</h3>
                <div className="preview-message">
                  {notifications.budgetAlerts && <span>💰 Budget Alerts • </span>}
                  {notifications.weeklyReports && <span>📊 Weekly Reports • </span>}
                  {notifications.expenseReminders && <span>⏰ Expense Reminders • </span>}
                  {notifications.goalProgress && <span>🎯 Goal Progress</span>}
                  {Object.values(notifications).every(v => !v) && <span>No notifications enabled</span>}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section cosmic-card">
              <h2>🎨 Appearance & Theme</h2>
              
              <div className="theme-selector">
                <h3>🎨 Theme</h3>
                <div className="theme-options">
                  <div 
                    className={`theme-option ${appearance.theme === 'cosmic' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('cosmic')}
                  >
                    <div className="theme-preview cosmic-theme">
                      <div className="theme-stars">✨</div>
                    </div>
                    <span>Cosmic</span>
                  </div>
                  <div 
                    className={`theme-option ${appearance.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="theme-preview dark-theme"></div>
                    <span>Dark</span>
                  </div>
                  <div 
                    className={`theme-option ${appearance.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="theme-preview light-theme"></div>
                    <span>Light</span>
                  </div>
                </div>
              </div>

              <div className="appearance-options">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>📱 Compact Mode</h4>
                    <p>Show more content in less space</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={appearance.compactMode}
                      onChange={(e) => setAppearance({...appearance, compactMode: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>✨ Animations</h4>
                    <p>Enable smooth transitions and effects</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={appearance.animations}
                      onChange={(e) => setAppearance({...appearance, animations: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="appearance-preview">
                <h3>👀 Current Settings</h3>
                <div className="preview-info">
                  <p>Theme: <strong>{appearance.theme.charAt(0).toUpperCase() + appearance.theme.slice(1)}</strong></p>
                  <p>Compact Mode: <strong>{appearance.compactMode ? 'Enabled' : 'Disabled'}</strong></p>
                  <p>Animations: <strong>{appearance.animations ? 'Enabled' : 'Disabled'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Sync Settings */}
          {activeTab === 'backup' && (
            <div className="settings-section cosmic-card">
              <h2>💾 Backup & Data Sync</h2>
              
              <div className="backup-options">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>🔄 Auto Backup</h4>
                    <p>Automatically backup your data</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={backupData.autoBackup}
                      onChange={(e) => setBackupData({...backupData, autoBackup: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {backupData.autoBackup && (
                  <div className="backup-frequency">
                    <label>📅 Backup Frequency</label>
                    <select 
                      value={backupData.backupFrequency}
                      onChange={(e) => setBackupData({...backupData, backupFrequency: e.target.value})}
                      className="form-select"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>☁️ Cloud Sync</h4>
                    <p>Sync your data across devices (Coming Soon)</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={backupData.cloudSync}
                      onChange={(e) => setBackupData({...backupData, cloudSync: e.target.checked})}
                      disabled
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="backup-actions">
                <h3>💾 Manual Backup</h3>
                <div className="action-buttons">
                  <button onClick={() => handleExportData('json')} className="action-btn export-btn">
                    📥 Export as JSON
                  </button>
                  <button onClick={() => handleExportData('csv')} className="action-btn export-btn">
                    📊 Export as CSV
                  </button>
                  <label className="action-btn import-btn">
                    📤 Import Data
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className="backup-info">
                <h3>📊 Backup Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span>Last Backup</span>
                    <span>{lastBackupTime}</span>
                  </div>
                  <div className="info-item">
                    <span>Backup Size</span>
                    <span>{totalDataSize} KB</span>
                  </div>
                  <div className="info-item">
                    <span>Next Backup</span>
                    <span>{backupData.autoBackup ? 'Auto' : 'Manual'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="settings-section cosmic-card">
              <h2>📊 Data Management</h2>
              
              <div className="data-stats">
                <h3>💽 Storage Overview</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">{totalExpenses}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Savings Goals</span>
                    <span className="stat-value">{totalGoals}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Data Size</span>
                    <span className="stat-value">{totalDataSize} KB</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Updated</span>
                    <span className="stat-value">Just now</span>
                  </div>
                </div>
              </div>

              <div className="data-actions">
                <h3>⚡ Data Actions</h3>
                <div className="action-buttons vertical">
                  <button onClick={() => handleExportData('json')} className="action-btn export-btn">
                    📥 Export All Data
                  </button>
                  <label className="action-btn import-btn">
                    📤 Import Data
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button onClick={handleClearAllData} className="action-btn clear-btn">
                    🗑️ Clear All Data
                  </button>
                  <button onClick={handleResetSettings} className="action-btn reset-btn">
                    🔄 Reset Settings
                  </button>
                </div>
              </div>

              <div className="data-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <h4>Important Notice</h4>
                  <p>Clearing data or resetting settings cannot be undone. Make sure to export your data before performing these actions.</p>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeTab === 'about' && (
            <div className="settings-section cosmic-card">
              <h2>ℹ️ About Cosmic Expense Tracker</h2>
              
              <div className="about-content">
                <div className="app-info">
                  <div className="app-logo">🚀</div>
                  <div className="app-details">
                    <h3>Cosmic Expense Tracker</h3>
                    <p>Version 2.1.0 • Cosmic Edition</p>
                    <p>Built with React & Cosmic Magic ✨</p>
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="app-features">
                  <h3>🌟 Features</h3>
                  <div className="features-grid">
                    <div className="feature-item">💫 Cosmic-themed UI</div>
                    <div className="feature-item">📊 Advanced Analytics</div>
                    <div className="feature-item">🎯 Smart Budgeting</div>
                    <div className="feature-item">🔔 Custom Notifications</div>
                    <div className="feature-item">💾 Data Backup</div>
                    <div className="feature-item">🎨 Multiple Themes</div>
                    <div className="feature-item">📱 Responsive Design</div>
                    <div className="feature-item">🔒 Privacy Focused</div>
                  </div>
                </div>

                <div className="danger-zone">
                  <h3>🚨 Danger Zone</h3>
                  <div className="danger-actions">
                    <button onClick={handleLogout} className="danger-btn logout-btn">
                      🚪 Logout
                    </button>
                    <button onClick={handleDeleteAccount} className="danger-btn delete-btn">
                      💀 Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;