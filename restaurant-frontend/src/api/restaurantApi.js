import api from './axios';

export const restaurantApi = {
  // Restaurants
  getAllRestaurants: async () => {
    const response = await api.get('/api/v1/getAllRest');
    return response.data;
  },

  getRestaurantById: async (id) => {
    const response = await api.get(`/api/v1/${id}`);
    return response.data;
  },

  addRestaurant: async (restaurantData) => {
    const response = await api.post('/api/v1/addRes', restaurantData);
    return response.data;
  },

  deleteRestaurant: async (restaurantId) => {
    const response = await api.delete(`/api/v1/restaurants/${restaurantId}`);
    return response.data;
  },

  // Food Items
  getFoodsByRestaurantId: async (restaurantId) => {
    const response = await api.get(`/api/v1/${restaurantId}/foods`);
    return response.data;
  },

  getFoodById: async (foodId) => {
    const response = await api.get(`/api/v1/foods/${foodId}`);
    return response.data;
  },

  addFoodItem: async (restaurantId, foodItemData) => {
    const response = await api.post(`/api/v1/restaurants/${restaurantId}/foods`, foodItemData);
    return response.data;
  },

  updateFoodItem: async (foodId, foodItemData) => {
    const response = await api.put(`/api/v1/foods/${foodId}`, foodItemData);
    return response.data;
  },

  deleteFoodItem: async (foodId) => {
    const response = await api.delete(`/api/v1/foods/${foodId}`);
    return response.data;
  }
};

