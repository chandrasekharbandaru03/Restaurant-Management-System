import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { getDishImageUrl } from '../utils/imageUtils';

export const CartDrawer = () => {
  const {
    cartItems,
    cartRestaurant,
    isCartOpen,
    closeCart,
    cartSubtotal,
    deliveryFee,
    taxAmount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Lotus Residency, Road No. 12, Banjara Hills, Hyderabad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderIds, setPlacedOrderIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      closeCart();
      navigate('/login', { state: { message: 'Please sign in to place your order' } });
      return;
    }

    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const customerId = user?.userId || 1;
      const restaurantId = cartRestaurant?.id || cartItems[0]?.restaurantId || 1;

      // Place an order for each cart line item
      const orderPromises = cartItems.map((item) => {
        const itemTotal = (parseFloat(item.price) || 0) * item.quantity;
        return orderApi.createOrder({
          customerId: Number(customerId),
          restaurantId: Number(restaurantId),
          foodItemId: Number(item.id),
          quantity: Number(item.quantity),
          totalAmount: Number(itemTotal),
        });
      });

      const responses = await Promise.all(orderPromises);
      const generatedIds = responses.map((r) => r.id);

      setPlacedOrderIds(generatedIds);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to place order. Ensure orderservice (Port 8082) is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrders = () => {
    setOrderSuccess(false);
    closeCart();
    navigate('/my-orders');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 1045 }}
        onClick={closeCart}
      ></div>

      {/* Offcanvas Drawer */}
      <div
        className="offcanvas offcanvas-end show shadow-lg"
        tabIndex="-1"
        style={{
          visibility: 'visible',
          zIndex: 1050,
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer Header */}
        <div className="offcanvas-header border-bottom py-3 px-4 bg-light">
          <div>
            <h5 className="offcanvas-title fw-bold font-heading mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-bag-heart-fill text-danger fs-4"></i> Your Order Cart
            </h5>
            {cartRestaurant && (
              <small className="text-muted d-block mt-1">
                Ordering from: <span className="fw-semibold text-dark">{cartRestaurant.name}</span>
              </small>
            )}
          </div>
          <button
            type="button"
            className="btn-close shadow-none"
            aria-label="Close"
            onClick={closeCart}
          ></button>
        </div>

        {/* Drawer Body */}
        <div className="offcanvas-body p-4 d-flex flex-column" style={{ overflowY: 'auto' }}>
          {orderSuccess ? (
            <div className="text-center my-auto py-4">
              <div
                className="rounded-circle bg-success-subtle text-success mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-check-circle-fill fs-1"></i>
              </div>
              <h4 className="fw-bold font-heading text-dark mb-2">Order Confirmed!</h4>
              <p className="text-muted small mb-3">
                Your order #{placedOrderIds.join(', #')} has been placed successfully with the kitchen!
              </p>
              <div className="alert alert-light border rounded-3 p-3 text-start small mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Total Paid:</span>
                  <span className="fw-bold text-dark">₹{cartTotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Payment Mode:</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold">
                    <i className="bi bi-cash-stack me-1"></i> Cash on Delivery (COD)
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-warning text-dark">PLACED</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Estimated Prep:</span>
                  <span className="fw-semibold">25 - 35 mins</span>
                </div>
              </div>
              <button onClick={handleViewOrders} className="btn btn-primary w-100 py-2 rounded-pill">
                <i className="bi bi-receipt me-2"></i> Track in My Orders
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center my-auto py-5">
              <div
                className="rounded-circle bg-light text-muted mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '90px', height: '90px' }}
              >
                <i className="bi bi-cart-x fs-1 opacity-50"></i>
              </div>
              <h5 className="fw-bold text-dark">Your cart is empty</h5>
              <p className="text-muted small mb-4">
                Looks like you haven't added any mouth-watering dishes yet.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/restaurants');
                }}
                className="btn btn-primary rounded-pill px-4"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
                </div>
              )}

              {/* Items List */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-dark small text-uppercase">
                    Selected Items ({cartItems.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="btn btn-link text-danger text-decoration-none p-0 small"
                  >
                    Clear All
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getDishImageUrl(item.name)}
                          alt={item.name}
                          className="rounded-2 object-fit-cover shadow-sm"
                          style={{ width: '56px', height: '56px' }}
                        />
                        <div>
                          <div className="fw-semibold text-dark small text-truncate" style={{ maxWidth: '170px' }}>
                            {item.name}
                          </div>
                          <div className="text-danger fw-bold small">₹{item.price}</div>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="d-flex align-items-center gap-2">
                        <div className="btn-group btn-group-sm bg-white rounded-pill border shadow-sm">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 px-2 text-danger fw-bold"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="btn btn-sm btn-light border-0 px-2 fw-bold text-dark pointer-events-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 px-2 text-danger fw-bold"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm text-secondary p-1"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark d-flex align-items-center gap-1 mb-1">
                  <i className="bi bi-geo-alt-fill text-danger"></i> Delivery Address
                </label>
                <textarea
                  className="form-control form-control-sm rounded-3"
                  rows="2"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter full delivery address..."
                  required
                ></textarea>
              </div>

              {/* Payment Mode (COD) */}
              <div className="mb-4">
                <label className="form-label fw-bold small text-dark d-flex align-items-center gap-1 mb-2">
                  <i className="bi bi-credit-card-2-front-fill text-danger"></i> Payment Mode
                </label>
                <div className="p-3 rounded-3 border bg-white shadow-sm d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-success-subtle text-success p-2 fs-5">
                      <i className="bi bi-cash-stack"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">Cash on Delivery (COD)</div>
                      <small className="text-muted">Pay in cash or UPI when your food arrives</small>
                    </div>
                  </div>
                  <span className="badge bg-success rounded-pill px-2 py-1">
                    <i className="bi bi-check2"></i> Default
                  </span>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-3 bg-light rounded-3 border mb-4">
                <h6 className="fw-bold text-dark small text-uppercase mb-2">Bill Summary</h6>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span>Item Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-success fw-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Govt Taxes & GST (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                  <span>To Pay (₹ INR)</span>
                  <span className="text-danger">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Confirming Order...
                    </>
                  ) : (
                    <>
                      <span>Place Order • ₹{cartTotal.toFixed(2)}</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
                {!isLoggedIn && (
                  <p className="text-center text-muted small mt-2 mb-0">
                    You will be prompted to sign in before finalizing.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

