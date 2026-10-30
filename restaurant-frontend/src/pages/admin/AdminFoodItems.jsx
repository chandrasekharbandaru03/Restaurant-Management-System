import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantApi } from '../../api/restaurantApi';
import { getDishImageUrl } from '../../utils/imageUtils';

export const AdminFoodItems = () => {
  const { restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Dish Form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit Dish Modal state
  const [editDish, setEditDish] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editing, setEditing] = useState(false);

  // Delete Dish Modal state
  const [deleteDish, setDeleteDish] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Alerts
  const [message, setMessage] = useState({ text: '', type: '' });

  const loadRestaurantAndMenu = async () => {
    try {
      setLoading(true);
      const [rest, foodList] = await Promise.all([
        restaurantApi.getRestaurantById(restaurantId).catch(() => null),
        restaurantApi.getFoodsByRestaurantId(restaurantId).catch(() => []),
      ]);
      setRestaurant(rest || { id: restaurantId, name: `Restaurant #${restaurantId}` });
      setFoods(foodList || []);
    } catch (err) {
      console.error('Error loading menu:', err);
      setMessage({ text: 'Failed to load menu dishes from restaurant service.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantAndMenu();
  }, [restaurantId]);

  // Add Dish
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    setAdding(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        name: newName.trim(),
        price: parseFloat(newPrice),
      };
      await restaurantApi.addFoodItem(restaurantId, payload);
      setMessage({ text: `Successfully published "${newName}" to menu!`, type: 'success' });
      setNewName('');
      setNewPrice('');
      await loadRestaurantAndMenu();
    } catch (err) {
      console.error('Failed to add dish:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to add dish. Ensure you are signed in as ADMIN.',
        type: 'danger',
      });
    } finally {
      setAdding(false);
    }
  };

  // Open Edit
  const handleOpenEdit = (food) => {
    setEditDish(food);
    setEditName(food.name);
    setEditPrice(food.price);
  };

  // Submit Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editDish || !editName.trim() || !editPrice) return;

    setEditing(true);
    try {
      const payload = {
        name: editName.trim(),
        price: parseFloat(editPrice),
      };
      await restaurantApi.updateFoodItem(editDish.id, payload);
      setMessage({ text: `Updated "${editName}" successfully!`, type: 'success' });
      setEditDish(null);
      await loadRestaurantAndMenu();
    } catch (err) {
      console.error('Failed to update dish:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to update dish item.',
        type: 'danger',
      });
    } finally {
      setEditing(false);
    }
  };

  // Open Delete
  const handleOpenDelete = (food) => {
    setDeleteDish(food);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteDish) return;

    setDeleting(true);
    try {
      await restaurantApi.deleteFoodItem(deleteDish.id);
      setMessage({ text: `Removed "${deleteDish.name}" from menu.`, type: 'warning' });
      setDeleteDish(null);
      await loadRestaurantAndMenu();
    } catch (err) {
      console.error('Failed to delete dish:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to delete dish item.',
        type: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/dashboard" className="text-decoration-none">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/restaurants" className="text-decoration-none">Restaurants</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{restaurant?.name} Menu</li>
        </ol>
      </nav>

      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold font-heading mb-1">
            {restaurant?.name} — Menu Management
          </h2>
          <p className="text-muted small mb-0">
            Publish culinary dishes, customize pricing in ₹ INR, and maintain real-time menu availability.
          </p>
        </div>

        <Link
          to={`/restaurants/${restaurantId}`}
          className="btn btn-outline-dark rounded-pill btn-sm px-3 shadow-sm"
          target="_blank"
        >
          <i className="bi bi-box-arrow-up-right me-1"></i> Preview Customer Menu
        </Link>
      </div>

      {/* Status Messages */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 py-2 px-3 small mb-4`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Add Dish Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold font-heading mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle-fill text-danger"></i> Add Menu Dish
            </h5>
            <p className="text-muted small mb-3">Add a new culinary dish to {restaurant?.name}.</p>

            <form onSubmit={handleAddDish}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Dish Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Special Chicken Biryani"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Unit Price (₹ INR)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-danger fw-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="form-control rounded-end-3"
                    placeholder="250.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Photo preview previewed intelligently from dish name */}
              {newName.trim() && (
                <div className="mb-3 p-2 bg-light rounded-3 border text-center">
                  <div className="text-muted small mb-1">Live Photo Preview:</div>
                  <img
                    src={getDishImageUrl(newName)}
                    alt="Preview"
                    className="rounded-3 object-fit-cover shadow-sm w-100"
                    style={{ height: '110px' }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm"
                disabled={adding}
              >
                {adding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving to Menu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-1"></i> Save Dish to Menu
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 bg-light rounded-3 border small text-muted">
              <i className="bi bi-shield-check text-success me-1"></i>
              Dispatches authenticated <code>POST /api/v1/restaurants/{restaurantId}/foods</code> using your JWT Bearer token.
            </div>
          </div>
        </div>

        {/* Right Column: Published Dishes Table */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-light py-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold font-heading mb-0">Published Dishes ({foods.length})</h5>
              <span className="badge bg-white text-dark border">Currency: Indian Rupees (₹)</span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="text-muted mt-2 small">Loading menu dishes...</p>
              </div>
            ) : foods.length === 0 ? (
              <div className="text-center py-5">
                <div
                  className="rounded-circle bg-light text-muted mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-basket fs-1 opacity-50"></i>
                </div>
                <h5 className="fw-bold text-dark">No food items added yet</h5>
                <p className="text-muted small mb-0">
                  Use the form on the left to publish dishes to this restaurant.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Dish ID</th>
                      <th>Dish & Photo</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => (
                      <tr key={food.id}>
                        <td className="ps-4 fw-semibold text-muted">#{food.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={getDishImageUrl(food.name)}
                              alt={food.name}
                              className="rounded-3 object-fit-cover shadow-sm"
                              style={{ width: '52px', height: '52px' }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{food.name}</div>
                              <small className="text-muted">Fresh Kitchen Prep</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold text-danger fs-6">
                            ₹{parseFloat(food.price || 0).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                            Available
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            {/* Edit Button */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              onClick={() => handleOpenEdit(food)}
                              title="Edit dish"
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              onClick={() => handleOpenDelete(food)}
                              title="Delete dish"
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dish Modal */}
      {editDish && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setEditDish(null)}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header border-bottom py-3 px-4 bg-light">
                  <h5 className="modal-title fw-bold font-heading mb-0">
                    <i className="bi bi-pencil-square text-danger me-2"></i> Update Dish #{editDish.id}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setEditDish(null)}></button>
                </div>
                <form onSubmit={handleSaveEdit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-dark">Dish Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-dark">Price (₹ INR)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-danger fw-bold">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          className="form-control rounded-end-3"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top py-3 px-4 bg-light">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setEditDish(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4 fw-bold"
                      disabled={editing}
                    >
                      {editing ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDish && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setDeleteDish(null)}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-body p-4 text-center">
                  <div
                    className="rounded-circle bg-danger-subtle text-danger mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <i className="bi bi-exclamation-triangle-fill fs-2"></i>
                  </div>
                  <h4 className="fw-bold font-heading mb-2">Delete Dish?</h4>
                  <p className="text-muted small mb-4">
                    Are you sure you want to remove <strong className="text-dark">"{deleteDish.name}"</strong>? This dish will no longer appear on the customer dining menu.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setDeleteDish(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill px-4 fw-bold"
                      disabled={deleting}
                      onClick={handleConfirmDelete}
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete Dish'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFoodItems;

