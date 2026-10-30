import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../../api/restaurantApi';
import { getRestaurantImageUrl } from '../../utils/imageUtils';

export const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Delete state
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantApi.getAllRestaurants();
      setRestaurants(data || []);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setMessage({ text: 'Failed to fetch restaurants from 8081.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        name: name.trim(),
        address: address.trim() || 'Culinary Street, Food Hub',
      };
      await restaurantApi.addRestaurant(payload);
      setMessage({ text: `Restaurant "${name}" successfully registered!`, type: 'success' });
      setName('');
      setAddress('');
      setShowAddModal(false);
      loadRestaurants();
    } catch (err) {
      console.error('Error adding restaurant:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to add restaurant. Verify ADMIN authorization.',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;

    setDeleting(true);
    setMessage({ text: '', type: '' });

    try {
      await restaurantApi.deleteRestaurant(restaurantToDelete.id);
      setMessage({
        text: `Restaurant "${restaurantToDelete.name}" and its menu items were deleted successfully!`,
        type: 'warning',
      });
      setRestaurantToDelete(null);
      loadRestaurants();
    } catch (err) {
      console.error('Failed to delete restaurant:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to delete restaurant. Ensure you are signed in as ADMIN.',
        type: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/admin/dashboard" className="text-decoration-none">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Restaurants</li>
            </ol>
          </nav>
          <h2 className="fw-bold font-heading mb-1">Manage Dining Outlets</h2>
          <p className="text-muted small mb-0">Publish new restaurants, update menus, or delete outlets</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
        >
          <i className="bi bi-plus-lg me-1"></i> Add New Restaurant
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 py-2 px-3 small`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2 small">Loading dining outlets...</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Restaurant</th>
                  <th>Location / Address</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No restaurants created yet. Click "Add New Restaurant" to create one.
                    </td>
                  </tr>
                ) : (
                  restaurants.map((rest) => (
                    <tr key={rest.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getRestaurantImageUrl(rest.name)}
                            alt={rest.name}
                            className="rounded-3 object-fit-cover shadow-sm"
                            style={{ width: '48px', height: '48px' }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{rest.name}</div>
                            <span className="badge bg-light text-muted border">ID: #{rest.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted small">
                        {rest.address || rest.location || 'Banjara Hills, Hyderabad'}
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                          <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.45rem' }}></i> Active
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <Link
                            to={`/restaurants/${rest.id}`}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            title="Preview customer view"
                          >
                            <i className="bi bi-eye me-1"></i> Preview
                          </Link>
                          <Link
                            to={`/admin/restaurants/${rest.id}/foods`}
                            className="btn btn-sm btn-danger rounded-pill px-3 fw-bold"
                          >
                            <i className="bi bi-pencil-square me-1"></i> Manage Menu
                          </Link>
                          {/* Delete Restaurant Option */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => setRestaurantToDelete(rest)}
                            title="Delete this restaurant"
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setShowAddModal(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header border-bottom py-3 px-4 bg-light">
                  <h5 className="modal-title fw-bold font-heading mb-0">
                    <i className="bi bi-building-add text-danger me-2"></i> Register New Restaurant
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <form onSubmit={handleAddRestaurant}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-dark">Restaurant Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Hyderabad Bawarchi Grand"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-dark">Address / Location</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. RTC X Roads, Hyderabad"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-top py-3 px-4 bg-light">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4 fw-bold"
                      disabled={submitting}
                    >
                      {submitting ? 'Registering...' : 'Register Restaurant'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {restaurantToDelete && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setRestaurantToDelete(null)}></div>
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
                  <h4 className="fw-bold font-heading mb-2">Delete Restaurant?</h4>
                  <p className="text-muted small mb-3">
                    Are you sure you want to delete <strong className="text-dark">"{restaurantToDelete.name}"</strong>?
                  </p>
                  <div className="alert alert-warning text-start small py-2 px-3 rounded-3 mb-4">
                    <i className="bi bi-info-circle me-1"></i>
                    <strong>Notice:</strong> All dishes and menu items associated with this restaurant will also be deleted from the database.
                  </div>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4"
                      onClick={() => setRestaurantToDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill px-4 fw-bold"
                      disabled={deleting}
                      onClick={handleConfirmDelete}
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete Restaurant'}
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

export default AdminRestaurants;
