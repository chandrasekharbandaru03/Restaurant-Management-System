import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block px-5 py-4 rounded-4 shadow-sm">
          <i className="bi bi-shield-lock-fill fs-1 text-danger mb-2 d-block"></i>
          <h4 className="fw-bold">Access Denied (403)</h4>
          <p className="text-muted mb-3">You need administrator privileges to access this console.</p>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

