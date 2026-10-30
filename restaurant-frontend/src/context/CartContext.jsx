import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('feasthub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('feasthub_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('feasthub_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setCartRestaurant(null);
      localStorage.removeItem('feasthub_cart_restaurant');
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartRestaurant) {
      localStorage.setItem('feasthub_cart_restaurant', JSON.stringify(cartRestaurant));
    }
  }, [cartRestaurant]);

  const addToCart = (foodItem, restaurant, quantity = 1) => {
    // If cart has items from a different restaurant, ask user or start fresh
    if (cartRestaurant && cartRestaurant.id !== restaurant.id && cartItems.length > 0) {
      const confirmSwitch = window.confirm(
        `Your cart contains items from "${cartRestaurant.name}". Clear your cart to add items from "${restaurant.name}"?`
      );
      if (!confirmSwitch) return false;
      setCartItems([{ ...foodItem, quantity, restaurantId: restaurant.id }]);
      setCartRestaurant(restaurant);
      setIsCartOpen(true);
      return true;
    }

    setCartRestaurant(restaurant);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === foodItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...foodItem, quantity, restaurantId: restaurant.id }];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (foodItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== foodItemId));
  };

  const updateQuantity = (foodItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === foodItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    localStorage.removeItem('feasthub_cart');
    localStorage.removeItem('feasthub_cart_restaurant');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity,
    0
  );
  // Delivery fee ₹40, free if subtotal >= 500
  const deliveryFee = cartItems.length > 0 ? (cartSubtotal >= 500 ? 0 : 40) : 0;
  // GST / taxes (5%)
  const taxAmount = cartItems.length > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  const cartTotal = cartSubtotal + deliveryFee + taxAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurant,
        isCartOpen,
        cartCount,
        cartSubtotal,
        deliveryFee,
        taxAmount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

