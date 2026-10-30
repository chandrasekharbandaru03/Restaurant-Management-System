import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { restaurantApi } from '../../api/restaurantApi';
import { getDishImageUrl } from '../../utils/imageUtils';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [foodNames, setFoodNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAllOrders();
      const sorted = (data || []).sort((a, b) => b.id - a.id);
      setOrders(sorted);

      // Fetch food item names
      const uniqueFoodIds = [...new Set(sorted.map((o) => o.foodItemId))];
      uniqueFoodIds.forEach(async (id) => {
        try {
          const food = await restaurantApi.getFoodById(id);
          if (food?.name) {
            setFoodNames((prev) => ({ ...prev, [id]: food.name }));
          }
        } catch {
          // silent fallback
        }
      });
    } catch (err) {
      console.error('Failed to load orders:', err);
      setAlertMsg({ text: 'Failed to fetch orders from Order Service (Port 8082).', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setAlertMsg({ text: `Order #${orderId} marked as ${newStatus}!`, type: 'success' });
    } catch (err) {
      console.error('Failed to update order status:', err);
      setAlertMsg({ text: `Failed to update status for Order #${orderId}`, type: 'danger' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return (o.status || '').toUpperCase() === statusFilter;
  });

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/admin/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Orders</li>
            </ol>
          </nav>
          <h2 className="fw-bold font-heading mb-1">Customer Orders & Fulfillment</h2>
          <p className="text-muted small mb-0">
            Real-time fulfillment pipeline powered by Order Service (Port 8082)
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="btn btn-outline-dark rounded-pill btn-sm px-3 shadow-sm"
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
        </button>
      </div>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} alert-dismissible fade show rounded-3 py-2 px-3 small mb-4`} role="alert">
          {alertMsg.text}
          <button type="button" className="btn-close py-2" onClick={() => setAlertMsg({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Status Filters */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['ALL', 'PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            className={`category-pill ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st === 'ALL' ? 'All Orders' : st}
            {st !== 'ALL' && (
              <span className="badge bg-secondary-subtle text-secondary rounded-pill ms-1">
                {orders.filter((o) => (o.status || '').toUpperCase() === st).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2 small">Loading order pipeline from orderservice...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-sm rounded-4">
          <div className="card-body">
            <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
            <h5 className="fw-bold">No orders found</h5>
            <p className="text-muted small mb-0">No customer orders matching the current filter status.</p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer</th>
                  <th>Dish Item</th>
                  <th>Qty</th>
                  <th>Total (₹ INR)</th>
                  <th>Payment Mode</th>
                  <th>Placed Date</th>
                  <th>Current Status</th>
                  <th className="text-end pe-4">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const dishName = foodNames[order.foodItemId] || `Item #${order.foodItemId}`;
                  const formattedDate = order.orderDate
                    ? new Date(order.orderDate).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : 'N/A';

                  return (
                    <tr key={order.id}>
                      <td className="ps-4 fw-bold">#{order.id}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          Customer #{order.customerId}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={getDishImageUrl(dishName)}
                            alt={dishName}
                            className="rounded-2 object-fit-cover shadow-sm"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <div>
                            <div className="fw-semibold text-dark small">{dishName}</div>
                            <small className="text-muted">Rest #{order.restaurantId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary rounded-pill px-2">
                          ×{order.quantity}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-danger">
                          ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 fw-bold">
                          <i className="bi bi-cash-stack me-1"></i> COD
                        </span>
                      </td>
                      <td className="text-muted small">{formattedDate}</td>
                      <td>
                        <span className={`badge-status badge-${(order.status || 'PLACED').toUpperCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <select
                          className="form-select form-select-sm d-inline-block rounded-pill border shadow-sm"
                          style={{ width: '150px' }}
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

