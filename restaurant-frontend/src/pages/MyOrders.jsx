import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { restaurantApi } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import { getDishImageUrl } from '../utils/imageUtils';

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foodItemCache, setFoodItemCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = async () => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setErrorMsg('');
      const data = await orderApi.getOrdersByCustomerId(user.userId);
      // Sort newest first
      const sorted = (data || []).sort((a, b) => b.id - a.id);
      setOrders(sorted);

      // Fetch food item names for any foodItemId we haven't seen yet
      const idsToFetch = [...new Set(sorted.map((o) => o.foodItemId))];
      idsToFetch.forEach(async (fId) => {
        if (!foodItemCache[fId]) {
          try {
            const food = await restaurantApi.getFoodById(fId);
            if (food) {
              setFoodItemCache((prev) => ({ ...prev, [fId]: food }));
            }
          } catch {
            // silent catch if food item endpoint differs
          }
        }
      });
    } catch (err) {
      console.error('Failed to load orders:', err);
      setErrorMsg('Could not fetch orders from Order Service (Port 8082).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PLACED').toUpperCase();
    return <span className={`badge-status badge-${s}`}>{s}</span>;
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold font-heading mb-1">Your Order History</h2>
          <p className="text-muted small mb-0">
            Real-time status tracking for customer #{user?.userId} ({user?.email})
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-outline-dark rounded-pill btn-sm px-3 shadow-sm"
          disabled={refreshing}
        >
          <i className={`bi bi-arrow-clockwise me-1 ${refreshing ? 'spin' : ''}`}></i>
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {errorMsg && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2 small">Loading your order history from orderservice...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-sm rounded-4">
          <div className="card-body">
            <div
              className="rounded-circle bg-light text-muted mx-auto d-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-bag-x fs-1 opacity-50"></i>
            </div>
            <h5 className="fw-bold">No orders placed yet</h5>
            <p className="text-muted small mb-4">
              Explore our chef menus and place your first authentic feast!
            </p>
            <Link to="/restaurants" className="btn btn-primary rounded-pill px-4">
              Order Food Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => {
            const food = foodItemCache[order.foodItemId];
            const dishName = food?.name || `Portion Item #${order.foodItemId}`;
            const formattedDate = order.orderDate
              ? new Date(order.orderDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Recent Order';

            return (
              <div key={order.id} className="card border-0 shadow-sm rounded-4 p-4">
                <div className="row align-items-center gy-3">
                  {/* Photo & Dish Details */}
                  <div className="col-md-5 d-flex align-items-center gap-3">
                    <img
                      src={getDishImageUrl(dishName)}
                      alt={dishName}
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ width: '70px', height: '70px' }}
                    />
                    <div>
                      <span className="badge bg-light text-dark border mb-1">
                        Order #{order.id}
                      </span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill ms-2 mb-1 fw-bold">
                        <i className="bi bi-cash-stack me-1"></i> COD
                      </span>
                      <h5 className="fw-bold text-dark font-heading mb-1">{dishName}</h5>
                      <div className="text-muted small">
                        Restaurant #{order.restaurantId} • Qty: <strong className="text-dark">{order.quantity}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Placed On</div>
                    <div className="fw-semibold text-dark small">{formattedDate}</div>
                  </div>

                  {/* Total Amount in INR */}
                  <div className="col-6 col-md-2 text-md-center">
                    <div className="text-muted small">Total Paid</div>
                    <div className="fs-5 fw-bold text-danger">
                      ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="col-md-2 text-md-end">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Progress Visual Tracker */}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span className={order.status === 'PLACED' ? 'fw-bold text-warning' : 'text-success'}>
                      <i className="bi bi-check2-circle me-1"></i> Order Placed
                    </span>
                    <span className={order.status === 'PREPARING' ? 'fw-bold text-pink' : (order.status === 'DELIVERED' ? 'text-success' : '')}>
                      <i className="bi bi-fire me-1"></i> Kitchen Preparing
                    </span>
                    <span className={order.status === 'DELIVERED' ? 'fw-bold text-success' : ''}>
                      <i className="bi bi-house-check-fill me-1"></i> Delivered
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar ${
                        order.status === 'DELIVERED'
                          ? 'bg-success w-100'
                          : order.status === 'PREPARING'
                          ? 'bg-danger w-50'
                          : order.status === 'CANCELLED'
                          ? 'bg-dark w-100'
                          : 'bg-warning w-25'
                      }`}
                      role="progressbar"
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

