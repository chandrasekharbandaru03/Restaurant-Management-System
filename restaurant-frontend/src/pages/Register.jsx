import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await register(email, password);
      setSuccessMsg('Account registered successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration complete. Please sign in.' } });
      }, 1500);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Registration failed. Email may already be taken or service is unavailable.'
      );
    } finally {
      setLoading(false);
    }
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
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h3 className="fw-bold font-heading text-dark">Join FeastHub</h3>
          <p className="text-muted small">Create an account to order from top kitchens</p>
        </div>

        {successMsg && (
          <div className="alert alert-success py-2 px-3 small rounded-3 mb-3">
            <i className="bi bi-check-circle me-1"></i> {successMsg}
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

          <div className="mb-3">
            <label className="form-label small fw-bold text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0 shadow-none"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-dark">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-shield-check"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0 shadow-none"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-danger fw-bold text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

