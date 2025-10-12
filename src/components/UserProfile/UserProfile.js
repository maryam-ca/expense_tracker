import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setEditData({
      name: user.name,
      email: user.email
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="profile-input"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                className="profile-input"
                placeholder="Email Address"
              />
            </div>
          ) : (
            <>
              <h3 className="profile-name">{user.name}</h3>
              <p className="profile-email">{user.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <div className="edit-actions">
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : '💾 Save'}
            </button>
            <button 
              onClick={handleCancel} 
              className="cancel-btn"
              disabled={loading}
            >
              ❌ Cancel
            </button>
          </div>
        ) : (
          <div className="view-actions">
            <button onClick={handleEdit} className="edit-btn">
              ✏️ Edit Profile
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;