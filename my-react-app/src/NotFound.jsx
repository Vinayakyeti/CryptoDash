import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './NotFound.css';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="not-found-container">
      <div className="not-found-bg"></div>
      <div className="not-found-content">
        <div className="not-found-decoration">
          <h1 className="not-found-code">404</h1>
        </div>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <button className="not-found-button" onClick={() => navigate("/")}>
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Home
        </button>
        
        <div className="not-found-details">
          <h3 className="not-found-details-title">Error Details:</h3>
          <p className="not-found-details-text">
            Requested URL: {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;