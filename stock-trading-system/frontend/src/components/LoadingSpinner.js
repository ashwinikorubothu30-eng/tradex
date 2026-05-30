import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = ({ fullPage = false, message = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <Spinner animation="border" variant="primary" size="sm" />
      <span className="ms-2 text-muted">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
