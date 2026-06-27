import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Tag, 
  Star, 
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  ChevronRight,
  Plus
} from 'lucide-react';
import { shopsAPI, productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const ShopDetail = () => {
  const { id } = useParams();
  const { addItem } = useCartStore();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'name',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [shopResponse, productsResponse] = await Promise.all([
          shopsAPI.getById(id),
          productsAPI.getByShop(id)
        ]);

        setShop(shopResponse.data.shop);
        setProducts(productsResponse.data.products || []);
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProducts = products.filter(product => {
    const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
    return matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-[70vh] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Shop Not Found</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light">The shop you're looking for doesn't exist.</p>
          <Link to="/shops" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition inline-block">
            Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-6 select-none">
          <Link to="/" className="hover:text-indigo-600 transition">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/shops" className="hover:text-indigo-600 transition">Shops</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 dark:text-gray-200 font-semibold truncate max-w-[200px]">{shop.name}</span>
        </nav>

        {/* Premium Shop Banner Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 mb-8 shadow-sm relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-md flex-shrink-0">
              🏪
            </div>
            
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{shop.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold text-gray-850 dark:text-gray-200">{shop.rating || 0}</span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">
                  {shop.category}
                </span>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <MapPin size={12} />
                  {shop.region}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed font-light pt-1">{shop.description}</p>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 dark:bg-gray-850 border border-gray-105 dark:border-gray-800 rounded-2xl text-center min-w-[100px] shadow-sm">
              <div className="text-xl font-black text-indigo-505 dark:text-indigo-400">{products.length}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">Catalog Size</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-400 mr-2">Sort:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 transition cursor-pointer appearance-none"
              >
                <option value="name">Alphabetical</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest Catalog</option>
              </select>
              <span className="absolute right-2.5 text-gray-400 pointer-events-none"><ChevronDown size={12} /></span>
            </div>

            {/* Price Inputs */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-400">Price Range:</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-16 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-16 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
              />
            </div>

          </div>

          {/* Reset Filters */}
          <button
            onClick={() => setFilters({ sort: 'name', minPrice: '', maxPrice: '' })}
            className="text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Reset Filters
          </button>
        </div>

        {/* Catalog Output List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm max-w-sm mx-auto">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Products Available</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Try adjusting your pricing filters or check back later for additions.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 px-1">
              Showing {filteredProducts.length} of {products.length} products inside inventory
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pop-in">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl hover:shadow-md hover:-translate-y-0.5 transition duration-200 overflow-hidden flex flex-col justify-between group shadow-sm"
                >
                  <Link to={`/product/${product._id}`} className="aspect-square bg-gray-50 dark:bg-gray-850 flex items-center justify-center p-4 relative overflow-hidden">
                    <img
                      src={product.images?.[0] || getFallbackImage(product.category)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-250"
                      onError={(e) => handleImageError(e, product.category)}
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-500 transition leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-[10px] mt-1.5 text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-gray-500 font-bold">{product.rating || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addItem(product, 1);
                          alert(`${product.name} added to cart!`);
                        }}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-650 hover:text-white rounded-lg transition"
                        title="Add directly to cart"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ShopDetail;