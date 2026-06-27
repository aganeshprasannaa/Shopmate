/**
 * Wishlist Page - Amazon Style
 * View and manage saved products
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [sortBy, setSortBy] = useState('newest');

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
    }
  });

  const handleAddToCart = (product) => {
    addItem(product, 1);
    removeItem(product._id); // Optional: remove from wishlist after adding to cart
  };

  const handleRemoveFromWishlist = (productId) => {
    removeItem(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">❤️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Save items you're interested in to your wishlist and check back later.
          </p>
          <Link
            to="/shops"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-6 transition-colors duration-200">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} item{items.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="newest">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition duration-200 overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative">
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-850 flex items-center justify-center p-4">
                    <img
                      src={product.images?.[0] || getFallbackImage(product.category)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => handleImageError(e, product.category)}
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-450 transition"
                  title="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm hover:text-indigo-700 dark:hover:text-indigo-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex text-yellow-450">
                      {'★'.repeat(Math.floor(product.rating || 0))}
                      {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({product.rating || 0})</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline space-x-2 mb-4 mt-2 pt-2 border-t border-gray-50 dark:border-gray-850">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition text-center text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-colors duration-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to checkout?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Items in your wishlist are waiting to be added to your cart.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/cart"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                View Cart
              </Link>
              <Link
                to="/shops"
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;