import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = isLogin
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(response.data.user);
      }

      // Navigate to products page
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      if (err.response?.data?.errors) {
        // Validation errors
        const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
        setError(errorMessages);
      } else if (err.response?.data?.error) {
        // Single error message
        setError(err.response.data.error);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend server is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder={isLogin ? "Enter password" : "Enter password (min 6 characters)"}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setFormData({ username: '', email: '', password: '' });
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

