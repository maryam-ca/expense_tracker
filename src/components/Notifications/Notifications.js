import React from 'react';
import './Notifications.css';

const Notifications = ({ notifications, setNotifications }) => {
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' && '✅'}
            {notification.type === 'warning' && '⚠️'}
            {notification.type === 'alert' && '🚨'}
            {notification.type === 'info' && 'ℹ️'}
          </span>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;