import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import { getRestaurantImageUrl } from '../utils/imageUtils';

export const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantApi.getAllRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const categories = [
    { name: 'Biryani', icon: 'bi-fire', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pizza', icon: 'bi-pie-chart', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
    { name: 'Burger', icon: 'bi-badge-ad', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
    { name: 'South Indian', icon: 'bi-egg-fried', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80' },
    { name: 'Curries', icon: 'bi-cup-hot', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80' },
    { name: 'Desserts', icon: 'bi-cake2', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
          style={{
            backgroundImage: `radial-gradient(#FF4757 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className="container position-relative z-1 py-4">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className="display-4 fw-extrabold font-heading mb-3" style={{ letterSpacing: '-1.5px', lineHeight: '1.15' }}>
                Crave It? <span className="brand-gradient-text">We Deliver</span> Authentic Flavours.
              </h1>
              <p className="lead text-light text-opacity-75 mb-4" style={{ maxWidth: '540px' }}>
                Explore chef-crafted cuisines, sizzling Hyderabadi Dum Biryanis, artisanal pizzas, and Indian delicacies with real-time order tracking.
              </p>

              {/* Fast Search Input */}
              <form onSubmit={handleSearch} className="d-flex gap-2 p-2 bg-white rounded-pill shadow-lg" style={{ maxWidth: '520px' }}>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                    <i className="bi bi-search fs-5"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none text-dark ps-2"
                    placeholder="Search restaurant or dish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                  Find Food
                </button>
              </form>
            </div>

            <div className="col-lg-5 d-none d-lg-block text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
                  alt="Authentic Dum Biryani"
                  className="rounded-4 shadow-2xl img-fluid"
                  style={{
                    maxHeight: '340px',
                    objectFit: 'cover',
                    transform: 'rotate(2deg)',
                    border: '4px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <div
                  className="position-absolute bottom-0 start-0 translate-middle-x bg-white text-dark p-3 rounded-4 shadow-lg d-flex align-items-center gap-3"
                  style={{ minWidth: '220px' }}
                >
                  <div className="bg-success-subtle text-success p-2 rounded-circle fs-4">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small">Superfast Delivery</div>
                    <small className="text-muted">Under 30 Minutes</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Categories Section */}
      <section className="container mt-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-bold font-heading mb-1">What are you craving today?</h3>
            <p className="text-muted small mb-0">Browse top categories loved by our patrons</p>
          </div>
          <Link to="/restaurants" className="text-danger fw-bold text-decoration-none small">
            View All Dishes <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="row g-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-2">
              <Link
                to={`/restaurants?category=${cat.name}`}
                className="card text-decoration-none card-interactive text-center p-3 h-100 border-0 shadow-sm"
              >
                <div
                  className="rounded-circle mx-auto mb-2 overflow-hidden shadow-sm"
                  style={{ width: '80px', height: '80px' }}
                >
                  <img src={cat.img} alt={cat.name} className="w-100 h-100 object-fit-cover" />
                </div>
                <div className="fw-bold text-dark small">{cat.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="container mt-5 pt-3">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="badge bg-danger text-white rounded-pill px-3 py-1 mb-2 fw-semibold">
              Top Picks
            </span>
            <h3 className="fw-bold font-heading mb-1">Featured Dining & Cloud Kitchens</h3>
            <p className="text-muted small mb-0">Curated restaurants delivering right to your doorstep</p>
          </div>
          <Link to="/restaurants" className="btn btn-outline-primary rounded-pill btn-sm px-3">
            Explore All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading restaurants...</span>
            </div>
            <p className="text-muted mt-2 small">Connecting to restaurantservice on port 8081...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="alert alert-info rounded-4 p-4 text-center">
            <i className="bi bi-shop fs-1 text-primary d-block mb-2"></i>
            <h5 className="fw-bold">No restaurants found in database</h5>
            <p className="text-muted small mb-3">
              Restaurantservice is connected. Log in as an Administrator to publish dining spots.
            </p>
            <Link to="/login" className="btn btn-primary rounded-pill px-4">
              Sign In to Add
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {restaurants.slice(0, 6).map((rest) => (
              <div key={rest.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 card-interactive">
                  <div className="card-img-top-wrap">
                    <img src={getRestaurantImageUrl(rest.name)} alt={rest.name} />
                    <span className="floating-badge">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {rest.location || rest.address || 'Dining Hub'}
                    </span>
                    <span className="floating-rating">
                      <i className="bi bi-star-fill text-warning me-1"></i> 4.8
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark font-heading mb-1">
                      {rest.name}
                    </h5>
                    <p className="card-text text-muted small mb-3 flex-grow-1">
                      {rest.address || 'Artisan kitchen serving premium delicacies and beverages.'}
                    </p>
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                      <span className="small text-muted">
                        <i className="bi bi-clock me-1"></i> 25-35 mins
                      </span>
                      <Link
                        to={`/restaurants/${rest.id}`}
                        className="btn btn-sm btn-primary rounded-pill px-3"
                      >
                        View Menu <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

