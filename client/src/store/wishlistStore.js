/**
 * Wishlist Store - Zustand
 * Manage user's wishlist items
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item._id === product._id);

        if (!existingItem) {
          set({ items: [...items, { ...product, addedAt: new Date().toISOString() }] });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item._id !== productId) });
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item._id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => {
        const { items } = get();
        return items.length;
      }
    }),
    {
      name: 'shopmate-wishlist',
      version: 1,
    }
  )
);

export default useWishlistStore;