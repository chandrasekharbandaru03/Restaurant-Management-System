import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-top py-4 text-secondary">
      <div className="container">
        <div className="row gy-3 align-items-center justify-content-between">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-2 shadow-sm"
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
                }}
              >
                <i className="bi bi-fire fs-6"></i>
              </div>
              <span className="brand-gradient-text fw-bold fs-5">FeastHub</span>
            </div>
            <p className="small text-muted mb-0">
              Artisan dining & culinary delivery. Crafted with speed, quality, and flavor.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-1">
              <Link to="/restaurants" className="text-secondary text-decoration-none small hover-underline">
                Restaurants
              </Link>
              <Link to="/my-orders" className="text-secondary text-decoration-none small hover-underline">
                Orders
              </Link>
              <Link to="/login" className="text-secondary text-decoration-none small hover-underline">
                Account
              </Link>
            </div>
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} FeastHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
