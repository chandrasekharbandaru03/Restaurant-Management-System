/**
 * Category-aware high definition food photography resolver.
 * Accurately matches dish names to realistic culinary photography.
 */
export const getDishImageUrl = (dishName) => {
  if (!dishName || typeof dishName !== 'string') {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
  }
  const lower = dishName.toLowerCase().trim();

  // 1. Biryani & Rice Dishes (Prioritize biryani so "Chicken Biryani" gets authentic Dum Biryani)
  if (lower.includes('biryani') || lower.includes('biriyani') || lower.includes('pulao') || lower.includes('pulav') || lower.includes('fried rice') || lower.includes('jeera rice') || lower.includes('rice')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }

  // 2. Pizzas
  if (lower.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';
  }

  // 3. Burgers
  if (lower.includes('burger')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  }

  // 4. Pastas & Italian
  if (lower.includes('pasta') || lower.includes('spaghetti') || lower.includes('macaroni') || lower.includes('lasagna') || lower.includes('penne')) {
    return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
  }

  // 5. Chinese, Noodles, Manchurian, Rolls, Momos
  if (lower.includes('noodle') || lower.includes('chowmein') || lower.includes('maggi') || lower.includes('ramen') || lower.includes('manchurian') || lower.includes('momos') || lower.includes('roll')) {
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80';
  }

  // 6. South Indian (Dosa, Idli, Vada, Uttapam, Sambar, Poori)
  if (lower.includes('dosa') || lower.includes('idli') || lower.includes('vada') || lower.includes('uttapam') || lower.includes('sambar') || lower.includes('poori') || lower.includes('puri')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80';
  }

  // 7. Indian Curries, Paneer, Dal, Gravies, Naan, Roti
  if (lower.includes('paneer') || lower.includes('curry') || lower.includes('masala') || lower.includes('dal') || lower.includes('roti') || lower.includes('naan') || lower.includes('kulcha') || lower.includes('korma')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80';
  }

  // 8. Tandoori, Kebab, Tikka, Starters
  if (lower.includes('tandoori') || lower.includes('tikka') || lower.includes('kebab') || lower.includes('kabab') || lower.includes('fry') || lower.includes('wings') || lower.includes('grill')) {
    return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80';
  }

  // 9. Chicken, Mutton, Fish, Meat
  if (lower.includes('chicken') || lower.includes('mutton') || lower.includes('fish') || lower.includes('prawn') || lower.includes('meat')) {
    return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80';
  }

  // 10. Sandwiches & Subs
  if (lower.includes('sandwich') || lower.includes('toast') || lower.includes('sub') || lower.includes('panini')) {
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80';
  }

  // 11. Salads, Soups, Bowls
  if (lower.includes('salad') || lower.includes('soup') || lower.includes('healthy') || lower.includes('green')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80';
  }

  // 12. Desserts, Sweets, Ice Cream, Cakes
  if (lower.includes('cake') || lower.includes('ice cream') || lower.includes('icecream') || lower.includes('dessert') || lower.includes('sweet') || lower.includes('pastry') || lower.includes('chocolate') || lower.includes('jamun') || lower.includes('halwa') || lower.includes('brownie') || lower.includes('pudding')) {
    return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80';
  }

  // 13. Beverages, Shakes, Coffee, Tea, Juices
  if (lower.includes('coffee') || lower.includes('tea') || lower.includes('chai') || lower.includes('shake') || lower.includes('juice') || lower.includes('beverage') || lower.includes('coke') || lower.includes('pepsi') || lower.includes('drink') || lower.includes('lassi')) {
    return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
};

export const getRestaurantImageUrl = (restaurantName) => {
  if (!restaurantName || typeof restaurantName !== 'string') {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
  }
  const lower = restaurantName.toLowerCase().trim();

  if (lower.includes('biryani') || lower.includes('bawarchi') || lower.includes('paradise') || lower.includes('mehfil') || lower.includes('hyderabad')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('pizza') || lower.includes('domino') || lower.includes('crust') || lower.includes('italian')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('burger') || lower.includes('mcdonald') || lower.includes('grill') || lower.includes('fast')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('bakery') || lower.includes('bakes') || lower.includes('tea')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('chandrasekhar') || lower.includes('dine') || lower.includes('vishnu') || lower.includes('csr') || lower.includes('court') || lower.includes('dhaba') || lower.includes('home')) {
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80';
};

