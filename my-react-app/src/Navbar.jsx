import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './api';
import './Navbar.css';

export default function Navbar({ setSearch, currency, setCurrency }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const isAuthenticated = authAPI.isAuthenticated();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setInput(e.target.value);
    setSearch(e.target.value);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showSearchAndCurrency = isAuthenticated && 
    (location.pathname === '/' || location.pathname === '/dashboard');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 
          className="navbar-logo"
          onClick={() => navigate('/')}
        >
          CryptoDash
        </h1>

        {showSearchAndCurrency && (
          <div className="navbar-search-section">
            <div className="navbar-search">
              <svg className="navbar-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search coins..."
                value={input}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="navbar-currency-select">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="usd">USD</option>
                <option value="inr">INR</option>
                <option value="eur">EUR</option>
              </select>
            </div>
          </div>
        )}

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-trigger" onClick={handleDropdownClick}>
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {userEmail?.split('@')[0] || 'User'}
              </button>
              {showDropdown && (
                <div className="navbar-dropdown-content">
                  <button className="navbar-dropdown-item" onClick={handleLogout}>
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-actions">
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}