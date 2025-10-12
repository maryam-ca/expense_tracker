import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signup(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-container">
      <div className="cosmic-background">
        <div className="cosmic-stars"></div>
        <div className="cosmic-nebula"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🚀</div>
          <h1>Cosmic Expense Tracker</h1>
          <p>{isLogin ? 'Welcome back! Sign in to continue' : 'Create your cosmic account'}</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>✅ Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              isLogin ? '🚀 Sign In' : '🌌 Create Account'
            )}
            {!loading && (isLogin ? ' Sign In' : ' Create Account')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-btn"
              onClick={toggleMode}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p>📧 Email: demo@example.com</p>
            <p>🔒 Password: password</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;