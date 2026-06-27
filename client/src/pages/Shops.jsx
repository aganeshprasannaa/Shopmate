import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Store, 
  Search, 
  MapPin, 
  Tag, 
  Star, 
  ChevronDown, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { shopsAPI } from '../services/api';

const Shops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    category: '',
    search: '',
    sort: 'rating'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    setFilters(prev => ({ ...prev, search, category }));
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await shopsAPI.getCategories();
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.region) params.region = filters.region;
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.sort) params.sort = filters.sort;

        const res = await shopsAPI.getAll(params);
        setShops(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      category: '',
      search: '',
      sort: 'rating'
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Header Block */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {filters.search ? `Search Results for "${filters.search}"` : 'Explore Neighborhood Shops'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">
              Discover verified local merchants and local products in your region.
            </p>
          </div>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 px-3.5 py-1 rounded-full font-bold shadow-sm border border-indigo-100 dark:border-indigo-900">
            {shops.length} {shops.length === 1 ? 'Merchant' : 'Merchants'} Vouched
          </span>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4 mb-8">
          <div className="flex items-center gap-2 pb-3 border-b dark:border-gray-800">
            <span className="text-indigo-500"><SlidersHorizontal size={16} /></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Filter Directory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative flex items-center">
              <span className="absolute left-3 text-gray-400"><Search size={16} /></span>
              <input
                type="text"
                placeholder="Search by store name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3 relative flex items-center">
              <span className="absolute left-3 text-gray-400"><Tag size={16} /></span>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 transition appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="absolute right-3 text-gray-400 pointer-events-none"><ChevronDown size={14} /></span>
            </div>

            {/* Region Filter */}
            <div className="lg:col-span-2 relative flex items-center">
              <span className="absolute left-3 text-gray-400"><MapPin size={16} /></span>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 transition appearance-none cursor-pointer"
              >
                <option value="">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
              <span className="absolute right-3 text-gray-400 pointer-events-none"><ChevronDown size={14} /></span>
            </div>

            {/* Sorting Filter */}
            <div className="lg:col-span-2 relative flex items-center">
              <span className="absolute left-3 text-gray-400"><Star size={16} /></span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 transition appearance-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="name">Name (A-Z)</option>
                <option value="newest">Newest First</option>
              </select>
              <span className="absolute right-3 text-gray-400 pointer-events-none"><ChevronDown size={14} /></span>
            </div>

            {/* Reset Button */}
            <button
              onClick={clearFilters}
              className="lg:col-span-1 text-center py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <RefreshCw size={14} />
              Reset
            </button>

          </div>
        </div>

        {/* Shops Directory Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm max-w-md mx-auto">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Shops Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light">Try adjusting your filters, region, or search keyword terms.</p>
            <button
              onClick={clearFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Reset Filters Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pop-in">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                to={`/shop/${shop._id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl hover:shadow-md hover:-translate-y-0.5 transition duration-200 overflow-hidden flex flex-col justify-between group shadow-sm"
              >
                {/* Simulated Shop Header Visual */}
                <div className="aspect-video bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/15 flex items-center justify-center relative overflow-hidden">
                  <span className="text-4xl filter drop-shadow group-hover:scale-110 transition duration-300">🏪</span>
                  <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border dark:border-gray-800">
                    {shop.region}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition">
                      {shop.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">{shop.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light line-clamp-2 leading-relaxed">
                      {shop.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-105 dark:border-gray-800 text-xs">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold text-gray-850 dark:text-gray-300">{shop.rating || 0}</span>
                    </div>
                    <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                      {shop.totalProducts || 0} Products
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shops;
