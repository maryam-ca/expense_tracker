import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo users - in real app, this would be API call
        const users = [
          { id: 1, name: 'Demo User', email: 'demo@example.com', password: 'password' },
          { id: 2, name: 'Test User', email: 'test@example.com', password: 'test123' }
        ];

        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  // Signup function
  const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = existingUsers.find(u => u.email === email);
        
        if (userExists) {
          reject(new Error('User already exists with this email'));
        } else {
          const newUser = {
            id: Date.now(),
            name,
            email,
            password // In real app, password should be hashed
          };
          
          // Save to localStorage
          const updatedUsers = [...existingUsers, newUser];
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          
          const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear expense data on logout
    localStorage.removeItem('expenses');
    localStorage.removeItem('goals');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};