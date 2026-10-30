import { orderApiInstance } from './axios';

export const orderApi = {
  createOrder: async (orderData) => {
    // orderData: { customerId, restaurantId, foodItemId, quantity, totalAmount }
    const response = await orderApiInstance.post('/api/v1/orders', orderData);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await orderApiInstance.get('/api/v1/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await orderApiInstance.get(`/api/v1/orders/${id}`);
    return response.data;
  },

  getOrdersByCustomerId: async (customerId) => {
    const response = await orderApiInstance.get(`/api/v1/orders/customer/${customerId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await orderApiInstance.put(`/api/v1/orders/${orderId}/status?status=${status}`);
    return response.data;
  }
};

