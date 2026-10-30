import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import { getRestaurantImageUrl } from '../utils/imageUtils';

export const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterTag, setFilterTag] = useState('ALL');

  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantApi.getAllRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchName = r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAddress = (r.address || r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchSearch = matchName || matchAddress;

    if (filterTag === 'ALL') return matchSearch;
    if (filterTag === 'BIRYANI') return matchSearch && (r.name?.toLowerCase().includes('biryani') || r.name?.toLowerCase().includes('bawarchi'));
    if (filterTag === 'PIZZA') return matchSearch && (r.name?.toLowerCase().includes('pizza') || r.name?.toLowerCase().includes('crust'));
    if (filterTag === 'CAFE') return matchSearch && (r.name?.toLowerCase().includes('cafe') || r.name?.toLowerCase().includes('bakes'));
    return matchSearch;
  });

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="mb-4">
        <h2 className="fw-bold font-heading mb-1">Explore Restaurants & Diners</h2>
        <p className="text-muted small">
          Order authentic meals directly from premier kitchens and restaurants across your city.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-6 col-lg-5">
          <div className="input-group bg-white rounded-pill shadow-sm border p-1">
            <span className="input-group-text bg-transparent border-0 text-muted ps-3">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none ps-2"
              placeholder="Filter by name, cuisine, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-link text-muted pe-3 text-decoration-none"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
        </div>

        <div className="col-md-6 col-lg-7">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <button
              className={`category-pill ${filterTag === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterTag('ALL')}
            >
              All Restaurants
            </button>
            <button
              className={`category-pill ${filterTag === 'BIRYANI' ? 'active' : ''}`}
              onClick={() => setFilterTag('BIRYANI')}
            >
              <i className="bi bi-fire text-danger"></i> Biryani Hubs
            </button>
            <button
              className={`category-pill ${filterTag === 'PIZZA' ? 'active' : ''}`}
              onClick={() => setFilterTag('PIZZA')}
            >
              <i className="bi bi-pie-chart text-warning"></i> Pizzerias
            </button>
            <button
              className={`category-pill ${filterTag === 'CAFE' ? 'active' : ''}`}
              onClick={() => setFilterTag('CAFE')}
            >
              <i className="bi bi-cup-hot text-info"></i> Cafes & Bakes
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2 small">Loading dining spots...</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-sm rounded-4">
          <div className="card-body">
            <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
            <h5 className="fw-bold">No restaurants match your search</h5>
            <p className="text-muted small mb-3">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTag('ALL');
              }}
              className="btn btn-outline-primary rounded-pill px-4"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 card-interactive">
                <div className="card-img-top-wrap">
                  <img src={getRestaurantImageUrl(restaurant.name)} alt={restaurant.name} />
                  <span className="floating-badge">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {restaurant.location || restaurant.address || 'Dining Hub'}
                  </span>
                  <span className="floating-rating">
                    <i className="bi bi-star-fill text-warning me-1"></i> 4.7
                  </span>
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="card-title fw-bold text-dark font-heading mb-0">
                      {restaurant.name}
                    </h5>
                    <span className="badge bg-light text-dark border">#{restaurant.id}</span>
                  </div>
                  <p className="card-text text-muted small mb-3 flex-grow-1">
                    {restaurant.address || 'Artisan kitchen serving premium delicacies and beverages.'}
                  </p>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <span className="small text-muted">
                      <i className="bi bi-bicycle text-success me-1"></i> Delivery in 30m
                    </span>

                    <div className="d-flex gap-2">
                      {isAdmin && (
                        <Link
                          to={`/admin/restaurants/${restaurant.id}/foods`}
                          className="btn btn-sm btn-outline-danger rounded-pill px-2"
                          title="Manage Menu"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                      )}
                      <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="btn btn-sm btn-primary rounded-pill px-3"
                      >
                        Order Dishes <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;

