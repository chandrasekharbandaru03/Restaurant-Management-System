import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { getDishImageUrl } from '../utils/imageUtils';

export const ExpressOrderModal = ({ foodItem, restaurant, isOpen, onClose }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !foodItem) return null;

  const unitPrice = parseFloat(foodItem.price) || 0;
  const totalAmount = unitPrice * quantity;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onClose();
      navigate('/login', { state: { message: 'Please sign in to place an express order' } });
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        customerId: Number(user?.userId || 1),
        restaurantId: Number(restaurant?.id || 1),
        foodItemId: Number(foodItem.id),
        quantity: Number(quantity),
        totalAmount: Number(totalAmount),
      };

      const result = await orderApi.createOrder(orderPayload);
      setOrderResult(result);
    } catch (err) {
      console.error('Express order error:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to place order. Ensure orderservice (Port 8082) is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    setOrderResult(null);
    onClose();
    navigate('/my-orders');
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={onClose}></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1060 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header with Food Image */}
            <div className="position-relative" style={{ height: '160px', backgroundColor: '#eee' }}>
              <img
                src={getDishImageUrl(foodItem.name)}
                alt={foodItem.name}
                className="w-100 h-100 object-fit-cover"
              />
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 shadow-sm rounded-circle"
                onClick={onClose}
                aria-label="Close"
              ></button>
              <div
                className="position-absolute bottom-0 start-0 w-100 p-3"
                style={{
                  background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0) 100%)',
                }}
              >
                <span className="badge bg-danger rounded-pill px-2 py-1 mb-1">Express Order</span>
                <h5 className="text-white fw-bold mb-0">{foodItem.name}</h5>
              </div>
            </div>

            <div className="modal-body p-4">
              {orderResult ? (
                <div className="text-center py-3">
                  <div
                    className="rounded-circle bg-success-subtle text-success mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <i className="bi bi-check2-circle fs-2"></i>
                  </div>
                  <h4 className="fw-bold font-heading mb-1">Order #{orderResult.id} Placed!</h4>
                  <p className="text-muted small mb-3">
                    Your dish has been queued for preparation at {restaurant?.name || 'the kitchen'}.
                  </p>
                  <div className="bg-light p-3 rounded-3 mb-4 text-start small border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Item:</span>
                      <span className="fw-semibold text-dark">{foodItem.name} (×{quantity})</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Payment:</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold">
                        <i className="bi bi-cash-stack me-1"></i> Cash on Delivery (COD)
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Amount Due:</span>
                      <span className="fw-bold text-danger">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Status:</span>
                      <span className="badge bg-warning text-dark">{orderResult.status || 'PLACED'}</span>
                    </div>
                  </div>
                  <button onClick={handleFinish} className="btn btn-primary w-100 rounded-pill">
                    Track in My Orders
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrder}>
                  {errorMsg && (
                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                      {errorMsg}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">Unit Price:</span>
                    <span className="fw-bold text-dark fs-5">₹{unitPrice.toFixed(2)}</span>
                  </div>

                  {/* Quantity Controller */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small mb-2">Quantity:</label>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                      <span className="small text-muted ms-2">Portions to prepare:</span>
                      <div className="btn-group bg-white rounded-pill border shadow-sm">
                        <button
                          type="button"
                          className="btn btn-light px-3 py-1 text-danger fw-bold"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="btn btn-light px-3 py-1 fw-bold text-dark pointer-events-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-light px-3 py-1 text-danger fw-bold"
                          onClick={() => setQuantity((q) => q + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="mb-4 p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-cash-stack text-success fs-5"></i>
                      <div>
                        <div className="fw-bold small text-dark">Payment: Cash on Delivery (COD)</div>
                        <small className="text-muted">Pay at doorstep upon delivery</small>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                      COD
                    </span>
                  </div>

                  {/* Total calculation */}
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 border mb-4">
                    <div>
                      <div className="text-muted small">Total Due</div>
                      <div className="text-xs text-secondary">Inclusive of GST & charges</div>
                    </div>
                    <div className="fs-4 fw-bold text-danger">
                      ₹{totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lightning-charge-fill"></i>
                        Confirm Express Order
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpressOrderModal;

