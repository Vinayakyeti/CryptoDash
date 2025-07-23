import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './api';
import './Auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please make sure both passwords are identical.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await authAPI.signup(email, password);
      authAPI.setToken(data.token);
      localStorage.setItem('userEmail', email);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.msg || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-description">
            Join CryptoDash to track your favorite cryptocurrencies
          </p>
        </div>
        <div className="auth-content">
          {error && (
            <div className="auth-error-message" style={{ 
              padding: '0.75rem', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--destructive)', 
              borderRadius: 'var(--radius)', 
              color: 'var(--destructive)', 
              fontSize: '0.875rem', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>
            
            <div className="auth-field">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading && (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
              )}
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <button 
                className="auth-link"
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}