/**
 * API Service Layer
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/current'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// Shops endpoints
export const shopsAPI = {
  getAll: (params) => api.get('/shops', { params }),
  getByRegion: (region) => api.get(`/shops/region/${region}`),
  getDetails: (shopId) => api.get(`/shops/details/${shopId}`),
  getById: (shopId) => api.get(`/shops/details/${shopId}`),
  getCategories: () => api.get('/shops/categories/list'),
  search: (query) => api.get('/shops/search', { params: { query } })
};

// Products endpoints
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getByShop: (shopId) => api.get(`/products/shop/${shopId}`),
  getDetails: (productId) => api.get(`/products/details/${productId}`),
  getById: (productId) => api.get(`/products/details/${productId}`),
  getFeatured: () => api.get('/products/featured'),
  search: (query) => api.get('/products/search', { params: { query } }),
  addReview: (productId, data) => api.post(`/products/${productId}/review`, data)
};

// Orders endpoints
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getDetails: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId, data) => api.put(`/orders/${orderId}/cancel`, data),
  track: (orderId) => api.get(`/orders/${orderId}/track`)
};

// Admin endpoints
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  addShop: (data) => api.post('/admin/shops', data),
  addProduct: (data) => api.post('/admin/products', data),
  updateProduct: (productId, data) => api.put(`/admin/products/${productId}`, data),
  updateOrderStatus: (orderId, data) => api.put(`/admin/orders/${orderId}/status`, data),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getAllUsers: (params) => api.get('/admin/users', { params })
};

export default api;
