import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount, cartSubtotal, openCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg glass-navbar sticky-top py-2 px-3 px-md-4">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
            }}
          >
            <i className="bi bi-fire fs-5"></i>
          </div>
          <span className="brand-gradient-text fw-bold">FeastHub</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMainContent"
          aria-controls="navbarMainContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2"></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarMainContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link px-3 fw-semibold ${isActive ? 'text-primary' : 'text-secondary'}`}>
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/restaurants" className={({ isActive }) => `nav-link px-3 fw-semibold ${isActive ? 'text-primary' : 'text-secondary'}`}>
                <i className="bi bi-shop me-1"></i> Browse Restaurants
              </NavLink>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <NavLink to="/my-orders" className={({ isActive }) => `nav-link px-3 fw-semibold ${isActive ? 'text-primary' : 'text-secondary'}`}>
                  <i className="bi bi-receipt me-1"></i> My Orders
                </NavLink>
              </li>
            )}

            {/* Admin Console Dropdown */}
            {isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle px-3 fw-bold text-danger d-flex align-items-center gap-1"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-shield-lock-fill"></i> Admin Console
                </a>
                <ul className="dropdown-menu border-0 shadow-lg rounded-3 py-2">
                  <li>
                    <Link to="/admin/dashboard" className="dropdown-item py-2 fw-semibold">
                      <i className="bi bi-speedometer2 me-2 text-primary"></i> Operations Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/restaurants" className="dropdown-item py-2 fw-semibold">
                      <i className="bi bi-building me-2 text-primary"></i> Manage Restaurants
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/orders" className="dropdown-item py-2 fw-semibold">
                      <i className="bi bi-bag-check me-2 text-primary"></i> All Customer Orders
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Right Action Icons & Auth */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              type="button"
              className="btn btn-outline-dark position-relative rounded-pill px-3 py-2 d-flex align-items-center gap-2 border-opacity-25 shadow-sm"
              style={{ backgroundColor: '#ffffff' }}
            >
              <i className="bi bi-cart3 fs-5 text-danger"></i>
              <span className="fw-bold d-none d-sm-inline">Cart</span>
              {cartSubtotal > 0 && (
                <span className="badge bg-light text-dark border ms-1 fw-bold">
                  ₹{cartSubtotal}
                </span>
              )}
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Authentication state */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-pill border dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 shadow-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: isAdmin ? '#FF4757' : '#0F172A',
                      fontSize: '0.85rem',
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-start d-none d-md-block" style={{ lineHeight: '1.2' }}>
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '140px', fontSize: '0.85rem' }}>
                      {user?.email}
                    </div>
                    <span
                      className={`badge py-0 px-1 rounded-pill ${
                        isAdmin ? 'bg-danger text-white' : 'bg-secondary text-white'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {isAdmin ? 'ADMIN' : 'CUSTOMER'}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3 py-2">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 text-muted small">Signed in as</p>
                    <p className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                      {user?.email}
                    </p>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle mt-1">
                      User ID: #{user?.userId}
                    </span>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin/dashboard" className="dropdown-item py-2 fw-semibold">
                        <i className="bi bi-grid-1x2 me-2"></i> Admin Control Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/my-orders" className="dropdown-item py-2 fw-semibold">
                      <i className="bi bi-clock-history me-2"></i> Order History
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item py-2 text-danger fw-semibold">
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-3 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

