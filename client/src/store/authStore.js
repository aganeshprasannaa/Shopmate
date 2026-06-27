/**
 * Auth Store
 * Global state management for authentication using Zustand
 */

import { create } from 'zustand';

const getSafeLocalUser = () => {
  try {
    const data = localStorage.getItem('user');
    if (!data) return null;
    return JSON.parse(data) || null;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getSafeLocalUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  setUser: (user, token) => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
    set({ user, token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (loading) => set({ loading })
}));

export default useAuthStore;
