/**
 * Cart Store
 * Global state management for shopping cart
 */

import { create } from 'zustand';

const getSafeLocalCart = () => {
  try {
    const data = localStorage.getItem('cart');
    if (!data) return [];
    return JSON.parse(data) || [];
  } catch (e) {
    localStorage.removeItem('cart');
    return [];
  }
};

const useCartStore = create((set) => ({
  items: getSafeLocalCart(),

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...product, quantity }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  removeItem: (productId) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = state.items.filter((item) => item._id !== productId);
      } else {
        updatedItems = state.items.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
      }
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotal: () =>
    set((state) => ({
      total: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })),

  getItemCount: () =>
    set((state) => ({
      itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0)
    }))
}));

export default useCartStore;
