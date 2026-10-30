import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    // data: { token, tokenType, userId, email, role }
    const userData = {
      userId: data.userId,
      email: data.email || email,
      role: (data.role || 'CUSTOMER').toUpperCase(),
      token: data.token
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, password) => {
    return await authApi.register(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');
  const isCustomer = user && (user.role === 'CUSTOMER' || user.role === 'ROLE_CUSTOMER');
  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isAdmin, isCustomer, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

