import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getDishImageUrl, getRestaurantImageUrl } from '../utils/imageUtils';
import ExpressOrderModal from '../components/ExpressOrderModal';

export const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDish, setSearchDish] = useState('');
  const [addedItemIds, setAddedItemIds] = useState({});

  // Express order modal state
  const [selectedFoodForOrder, setSelectedFoodForOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restData, foodData] = await Promise.all([
          restaurantApi.getRestaurantById(restaurantId).catch(() => null),
          restaurantApi.getFoodsByRestaurantId(restaurantId).catch(() => []),
        ]);
        setRestaurant(restData || { id: restaurantId, name: `Restaurant #${restaurantId}`, address: 'Culinary Lane, Food District' });
        setFoods(foodData || []);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const handleAddToCart = (food) => {
    addToCart(food, restaurant, 1);
    // Visual feedback on button
    setAddedItemIds((prev) => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [food.id]: false }));
    }, 1200);
  };

  const handleOpenExpressOrder = (food) => {
    setSelectedFoodForOrder(food);
    setShowOrderModal(true);
  };

  const filteredFoods = foods.filter((f) =>
    (f.name || '').toLowerCase().includes(searchDish.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2 small">Loading menu & culinary specialties...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Restaurant Header Banner */}
      <section
        className="text-white py-5 position-relative"
        style={{
          background: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95))',
        }}
      >
        <div className="container position-relative z-1">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/restaurants" className="text-light text-decoration-none">Restaurants</Link></li>
              <li className="breadcrumb-item active text-danger" aria-current="page">{restaurant?.name}</li>
            </ol>
          </nav>

          <div className="row align-items-center gy-4">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-success rounded-pill px-3 py-1">
                  <i className="bi bi-clock-fill me-1"></i> Open Now • 11 AM - 11 PM
                </span>
                <span className="badge bg-danger rounded-pill px-3 py-1">
                  <i className="bi bi-star-fill text-warning me-1"></i> 4.8 Patrons Choice
                </span>
              </div>
              <h1 className="display-5 fw-bold font-heading mb-2">{restaurant?.name}</h1>
              <p className="lead text-light text-opacity-75 mb-3 fs-6">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {restaurant?.address || restaurant?.location || 'Premium Kitchen, Hyderabad'}
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center text-light text-opacity-75 small">
                <span><i className="bi bi-bicycle me-1 text-danger"></i> 25-35 mins</span>
                <span>•</span>
                <span><i className="bi bi-currency-rupee me-1 text-danger"></i> ₹250 for two</span>
                <span>•</span>
                <span><i className="bi bi-shield-check me-1 text-success"></i> 100% Hygienic Kitchen</span>
              </div>
            </div>

            <div className="col-md-4 text-md-end">
              {isAdmin && (
                <div className="bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur d-inline-block text-start border border-white border-opacity-10">
                  <span className="small text-danger fw-bold d-block mb-1">
                    <i className="bi bi-shield-lock-fill me-1"></i> Admin Controls
                  </span>
                  <Link
                    to={`/admin/restaurants/${restaurantId}/foods`}
                    className="btn btn-sm btn-danger rounded-pill px-3 py-1 fw-bold"
                  >
                    <i className="bi bi-plus-circle me-1"></i> Add / Edit Menu Dishes
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Menu & Dishes Section */}
      <section className="container py-5">
        {/* Menu Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 border-bottom mb-4">
          <div>
            <h3 className="fw-bold font-heading mb-1">
              Available Dishes ({foods.length})
            </h3>
            <p className="text-muted small mb-0">Select your favorite portions to order or add to cart</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm bg-white rounded-pill border shadow-sm px-2" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-transparent border-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none ps-0"
                placeholder="Search menu dishes..."
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredFoods.length === 0 ? (
          <div className="card text-center py-5 border-0 shadow-sm rounded-4">
            <div className="card-body">
              <i className="bi bi-cup-hot fs-1 text-muted d-block mb-2"></i>
              <h5 className="fw-bold">No dishes found</h5>
              <p className="text-muted small mb-3">
                {foods.length === 0
                  ? 'This restaurant has not published any dishes yet.'
                  : 'No dishes match your search query.'}
              </p>
              {isAdmin && (
                <Link
                  to={`/admin/restaurants/${restaurantId}/foods`}
                  className="btn btn-primary rounded-pill px-4"
                >
                  <i className="bi bi-plus-lg me-1"></i> Add First Dish
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredFoods.map((food) => {
              const isAdded = addedItemIds[food.id];
              return (
                <div key={food.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 card-interactive">
                    <div className="card-img-top-wrap">
                      {/* High quality culinary photo matched by category */}
                      <img src={getDishImageUrl(food.name)} alt={food.name} />
                      <span className="floating-badge">
                        <i className="bi bi-fire text-danger me-1"></i> Freshly Prepared
                      </span>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark font-heading mb-0">
                          {food.name}
                        </h5>
                        <span className="fs-5 fw-extrabold text-danger">
                          ₹{parseFloat(food.price || 0).toFixed(2)}
                        </span>
                      </div>

                      <p className="card-text text-muted small mb-4 flex-grow-1">
                        Cooked fresh with authentic spices and artisan quality ingredients.
                      </p>

                      <div className="d-flex gap-2 pt-2 border-top mt-auto">
                        {/* Add to Cart button */}
                        <button
                          type="button"
                          className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${
                            isAdded ? 'btn-success text-white' : 'btn-outline-primary'
                          }`}
                          onClick={() => handleAddToCart(food)}
                        >
                          {isAdded ? (
                            <>
                              <i className="bi bi-check2 me-1"></i> Added!
                            </>
                          ) : (
                            <>
                              <i className="bi bi-cart-plus me-1"></i> Add to Cart
                            </>
                          )}
                        </button>

                        {/* Express Order button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-primary rounded-pill fw-bold px-3 d-flex align-items-center gap-1"
                          onClick={() => handleOpenExpressOrder(food)}
                          title="Instant 1-Click Order"
                        >
                          <i className="bi bi-lightning-charge-fill"></i>
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Express Order Dialog */}
      <ExpressOrderModal
        foodItem={selectedFoodForOrder}
        restaurant={restaurant}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedFoodForOrder(null);
        }}
      />
    </div>
  );
};

export default RestaurantDetail;

