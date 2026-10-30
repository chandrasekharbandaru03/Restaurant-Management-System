import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const message = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const userData = await login(email, password);
      if (userData.role === 'ADMIN' || userData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const redirectPath = location.state?.from?.pathname || '/restaurants';
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Authentication failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 shadow mb-2"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
            }}
          >
            <i className="bi bi-fire fs-3"></i>
          </div>
          <h3 className="fw-bold font-heading text-dark">Welcome to FeastHub</h3>
          <p className="text-muted small">Sign in to order artisan meals or manage restaurants</p>
        </div>

        {message && (
          <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">
            <i className="bi bi-info-circle me-1"></i> {message}
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            <i className="bi bi-exclamation-triangle me-1"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0 shadow-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-bold text-dark mb-0">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0 shadow-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Fill Helpers */}
        <div className="p-3 bg-light rounded-3 border mb-3">
          <small className="fw-bold text-muted d-block mb-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
            Quick Demo Login:
          </small>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger flex-grow-1 rounded-pill"
              onClick={() => handleFillDemo('chandrasekhar@gmail.com', '123123')}
            >
              <i className="bi bi-shield-lock me-1"></i> Admin (Demo)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary flex-grow-1 rounded-pill"
              onClick={() => handleFillDemo('customer@test.com', 'password')}
            >
              <i className="bi bi-person me-1"></i> Customer
            </button>
          </div>
        </div>

        <div className="text-center small text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-danger fw-bold text-decoration-none">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

