import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../../api/restaurantApi';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [restList, orderList] = await Promise.all([
          restaurantApi.getAllRestaurants().catch(() => []),
          orderApi.getAllOrders().catch(() => []),
        ]);
        setRestaurants(restList || []);
        setOrders(orderList || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  const activePreparing = orders.filter((o) => o.status === 'PREPARING' || o.status === 'PLACED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="container py-5">
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-danger rounded-pill px-3 py-1 fw-bold mb-2">
            Administrator Control Center
          </span>
          <h2 className="fw-bold font-heading mb-1">Operations & Analytics</h2>
          <p className="text-muted small mb-0">
            Signed in as <strong className="text-dark">{user?.email}</strong> (User ID: #{user?.userId})
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/restaurants" className="btn btn-outline-primary rounded-pill btn-sm px-3 fw-bold">
            <i className="bi bi-building me-1"></i> Manage Restaurants
          </Link>
          <Link to="/admin/orders" className="btn btn-primary rounded-pill btn-sm px-3 fw-bold">
            <i className="bi bi-bag-check me-1"></i> Kitchen Orders
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2 small">Synthesizing platform telemetry...</p>
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="row g-4 mb-5">
            {/* Total Revenue in INR */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Gross Revenue</span>
                  <div className="rounded-circle bg-danger-subtle text-danger p-2 fs-5">
                    <i className="bi bi-currency-rupee"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-danger mb-1">
                  ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <small className="text-muted">Calculated across {orders.length} transactions</small>
              </div>
            </div>

            {/* Total Orders */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Total Orders</span>
                  <div className="rounded-circle bg-primary-subtle text-primary p-2 fs-5">
                    <i className="bi bi-bag-fill"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-dark mb-1">{orders.length}</h3>
                <small className="text-muted">Dispatched to Order Service (8082)</small>
              </div>
            </div>

            {/* Active Kitchen Orders */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Active in Kitchen</span>
                  <div className="rounded-circle bg-warning-subtle text-warning p-2 fs-5">
                    <i className="bi bi-fire"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-warning mb-1">{activePreparing}</h3>
                <small className="text-muted">Placed or Preparing status</small>
              </div>
            </div>

            {/* Registered Restaurants */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Dining Outlets</span>
                  <div className="rounded-circle bg-success-subtle text-success p-2 fs-5">
                    <i className="bi bi-shop"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-success mb-1">{restaurants.length}</h3>
                <small className="text-muted">Registered in Restaurant Service (8081)</small>
              </div>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold font-heading mb-0">Active Dining Outlets</h5>
                  <Link to="/admin/restaurants" className="text-danger small fw-bold text-decoration-none">
                    View All ({restaurants.length}) <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="list-group list-group-flush">
                  {restaurants.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                    >
                      <div>
                        <div className="fw-bold text-dark">{r.name}</div>
                        <small className="text-muted">{r.address || r.location || 'Dine-in Hub'}</small>
                      </div>
                      <Link
                        to={`/admin/restaurants/${r.id}/foods`}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        Manage Dishes
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold font-heading mb-0">Recent Order Activity</h5>
                  <Link to="/admin/orders" className="text-danger small fw-bold text-decoration-none">
                    Manage Orders ({orders.length}) <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No orders recorded yet.</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                      >
                        <div>
                          <div className="fw-bold text-dark">Order #{o.id} • Customer #{o.customerId}</div>
                          <small className="text-muted">Item #{o.foodItemId} (×{o.quantity})</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-danger">₹{parseFloat(o.totalAmount || 0).toFixed(2)}</div>
                          <span className={`badge-status badge-${(o.status || 'PLACED').toUpperCase()}`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

