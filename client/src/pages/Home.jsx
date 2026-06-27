/**
 * Home Page - Revamped
 * Modern Sidebar and Pop-up overlay deck layout
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { productsAPI, shopsAPI, ordersAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const Home = () => {
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addWishItem } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Core Data State
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [shops, setShops] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // UI Interactive State
  const [activeCategory, setActiveCategory] = useState('Clothing');
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'orders', 'bestsellers', 'featured', 'shops', 'benefits', 'wallet', 'settings', 'help'
  const [toastMessage, setToastMessage] = useState('');

  // Wallet States
  const [walletBalance, setWalletBalance] = useState(() => Number(localStorage.getItem('walletBalance') || 2500));
  const [addWalletAmount, setAddWalletAmount] = useState('');
  const [walletTransactions, setWalletTransactions] = useState([
    { id: '1', type: 'refund', desc: 'Refund for ORD-3849102-12', amount: 450, date: '2026-06-25T14:30:00Z' },
    { id: '2', type: 'purchase', desc: 'Paid for Order #ORD-2940184-09', amount: -1250, date: '2026-06-24T09:15:00Z' },
    { id: '3', type: 'credit', desc: 'Added funds via UPI', amount: 2000, date: '2026-06-20T18:00:00Z' }
  ]);

  // Settings / Preferences States
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  // Support / Help States
  const [supportQuery, setSupportQuery] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportTopic, setSupportTopic] = useState('Order Issues');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setSupportEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'support') {
      setActiveSection('help');
    } else if (tab === 'wallet') {
      setActiveSection('wallet');
    } else if (tab === 'settings') {
      setActiveSection('settings');
    } else {
      setActiveSection('dashboard');
    }
  }, [location]);

  const handleAddWalletFunds = (e) => {
    e.preventDefault();
    const amount = parseInt(addWalletAmount);
    if (!amount || amount <= 0) return;
    
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance);
    
    const newTx = {
      id: Date.now().toString(),
      type: 'credit',
      desc: `Added funds via payment gateway`,
      amount: amount,
      date: new Date().toISOString()
    };
    setWalletTransactions([newTx, ...walletTransactions]);
    setAddWalletAmount('');
    setToastMessage(`₹${amount} successfully added to wallet!`);
  };
  
  // Filtering & Sorting
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortKey, setSortKey] = useState('popularity');

  // Pop-up details overlay state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);

  // Dynamic Shop products state inside the shop details popup
  const [shopProducts, setShopProducts] = useState([]);
  const [shopProductsLoading, setShopProductsLoading] = useState(false);

  // Fetch Featured products, Bestsellers, & Shops
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredRes, bestsellersRes, shopsRes] = await Promise.all([
          productsAPI.getFeatured(),
          productsAPI.getAll({ limit: 450 }),
          shopsAPI.getAll({ limit: 6 })
        ]);
        setFeatured(featuredRes.data.products || []);
        setBestsellers(bestsellersRes.data.data || []);
        setShops(shopsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch initial home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Recent Orders (Last 3) if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setRecentOrders([]);
      return;
    }
    const fetchRecentOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await ordersAPI.getAll({ limit: 3 });
        setRecentOrders(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchRecentOrders();
  }, [isAuthenticated]);

  // Fetch products dynamically for selected shop details popup
  useEffect(() => {
    if (!selectedShop) {
      setShopProducts([]);
      return;
    }
    const fetchShopProducts = async () => {
      try {
        setShopProductsLoading(true);
        const res = await productsAPI.getByShop(selectedShop._id);
        setShopProducts(res.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products for selected shop:', error);
      } finally {
        setShopProductsLoading(false);
      }
    };
    fetchShopProducts();
  }, [selectedShop]);

  // Toast auto-clear
  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = setTimeout(() => setToastMessage(''), 2200);
    return () => clearTimeout(timeoutId);
  }, [toastMessage]);

  // Helper formatting for Order Status
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/20 dark:text-yellow-450 dark:border-yellow-900/50',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/20 dark:text-blue-450 dark:border-yellow-900/50',
      processing: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/20 dark:text-blue-450 dark:border-yellow-900/50',
      shipped: 'bg-purple-100 text-purple-800 border-purple-305 dark:bg-purple-950/20 dark:text-purple-455 dark:border-purple-900/50',
      delivered: 'bg-green-100 text-green-800 border-green-305 dark:bg-green-950/20 dark:text-green-455 dark:border-green-900/50',
      cancelled: 'bg-red-100 text-red-850 border-red-305 dark:bg-red-950/20 dark:text-red-455 dark:border-red-900/50',
      returned: 'bg-red-100 text-red-850 border-red-305 dark:bg-red-950/20 dark:text-red-455 dark:border-red-900/50'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌',
      returned: '↩️'
    };
    return icons[status] || '📋';
  };

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-indigo-505 py-12 relative overflow-hidden shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm animate-pop-in">Welcome to ShopMate</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95 font-light">
              Discover amazing local shops and products. Shop safely from trusted neighborhood sellers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveSection('shops')}
                className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
              >
                🏪 Explore Shops
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveSection('orders')}
                  className="bg-indigo-700 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
                >
                  📦 Track Orders
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Dynamic background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 -ml-20 -mb-20"></div>
      </section>

      {/* Interactive Deck Layout */}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          
          {/* Sidebar Section Boxes */}
          <aside className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-2">Workspace Deck</h3>
            
            {/* Box 1: Dashboard */}
            <button
              onClick={() => { setActiveSection('dashboard'); setSelectedOrder(null); setSelectedShop(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                activeSection === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  🏠 <span>Overview Dashboard</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'dashboard' ? 'bg-indigo-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                  Deck
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'dashboard' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Explore all sections, active listings, and order cards.
              </p>
            </button>

            {/* Box 2: Recent Orders Folder (Tab) */}
            {isAuthenticated && (
              <button
                onClick={() => { setActiveSection('orders'); setSelectedOrder(null); setSelectedShop(null); setQuickViewItem(null); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                  activeSection === 'orders'
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm flex items-center gap-2">
                    📂 <span>Recent Orders</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeSection === 'orders' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-500'
                  }`}>
                    {ordersLoading ? '...' : recentOrders.length}
                  </span>
                </div>
                <p className={`text-xs ${activeSection === 'orders' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  Quick track, invoice details, and re-orders.
                </p>
              </button>
            )}

            {/* Wallet Box */}
            {isAuthenticated && (
              <button
                onClick={() => { setActiveSection('wallet'); setSelectedOrder(null); setSelectedShop(null); setQuickViewItem(null); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                  activeSection === 'wallet'
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm flex items-center gap-2">
                    💳 <span>My Wallet</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeSection === 'wallet' ? 'bg-indigo-700 text-white' : 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'
                  }`}>
                    ₹{walletBalance}
                  </span>
                </div>
                <p className={`text-xs ${activeSection === 'wallet' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  Manage funds, add money, and view transactions.
                </p>
              </button>
            )}

            {/* Settings & Account Box */}
            {isAuthenticated && (
              <button
                onClick={() => { setActiveSection('settings'); setSelectedOrder(null); setSelectedShop(null); setQuickViewItem(null); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                  activeSection === 'settings'
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm flex items-center gap-2">
                    ⚙️ <span>Account & Settings</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'settings' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-500'}`}>
                    Setup
                  </span>
                </div>
                <p className={`text-xs ${activeSection === 'settings' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  Configure profile, preferences, and theme layout.
                </p>
              </button>
            )}

            {/* Help & Support Box */}
            <button
              onClick={() => { setActiveSection('help'); setSelectedShop(null); setSelectedOrder(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                activeSection === 'help'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  ❓ <span>Help & Support</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'help' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-500'}`}>
                  Help
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'help' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Frequently asked questions and query forms.
              </p>
            </button>

            {/* Box 3: Category Bestsellers */}
            <button
              onClick={() => { setActiveSection('bestsellers'); setSelectedShop(null); setSelectedOrder(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                activeSection === 'bestsellers'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  👕 <span>Category Bestsellers</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'bestsellers' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-500'}`}>
                  Hot
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'bestsellers' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Shop top sellers in {activeCategory}.
              </p>
            </button>

            {/* Box 4: Featured Products */}
            <button
              onClick={() => { setActiveSection('featured'); setSelectedShop(null); setSelectedOrder(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-305 group ${
                activeSection === 'featured'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-505 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  ✨ <span>Featured Products</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'featured' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-500'}`}>
                  Featured
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'featured' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Handpicked premium product selections.
              </p>
            </button>

            {/* Box 5: Popular Shops */}
            <button
              onClick={() => { setActiveSection('shops'); setSelectedShop(null); setSelectedOrder(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-305 group ${
                activeSection === 'shops'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-505 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  🏪 <span>Popular Local Shops</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'shops' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-100'}`}>
                  Shops
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'shops' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Browse verified local merchants in your area.
              </p>
            </button>

            {/* Box 6: Why Shopmate */}
            <button
              onClick={() => { setActiveSection('benefits'); setSelectedShop(null); setSelectedOrder(null); setQuickViewItem(null); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-305 group ${
                activeSection === 'benefits'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-505 shadow-lg transform -translate-y-0.5'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-305 dark:hover:border-gray-700 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  🛡️ <span>Our Benefits</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === 'benefits' ? 'bg-indigo-700 text-white' : 'bg-gray-105 dark:bg-gray-800 text-gray-500'}`}>
                  Info
                </span>
              </div>
              <p className={`text-xs ${activeSection === 'benefits' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                Why our delivery and shops are trusted.
              </p>
            </button>
          </aside>

          {/* Right Pane: Active Workspace Card */}
          <main className="relative min-h-[550px] w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm overflow-hidden">
            
            {/* OVERVIEW DASHBOARD */}
            {activeSection === 'dashboard' && (
              <div className="space-y-8 animate-pop-in">
                {/* Welcome Banner */}
                <div className="relative bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-750 rounded-3xl p-6 md:p-8 text-white shadow-md overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Dashboard Overview</span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">Hello, {user?.name || 'Valued Member'}!</h2>
                    <p className="text-xs text-indigo-100 max-w-lg font-light leading-relaxed">
                      Manage your neighborhood orders, load mock balance funds into your Shopmate wallet, view analytics summaries, and browse verified merchants.
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Card 1: Revenue */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Total Spend</span>
                        <span className="p-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs">💵</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                        ₹{(recentOrders || []).reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}
                      </h4>
                    </div>
                    <svg className="w-full h-6 mt-3 stroke-green-500 fill-none stroke-2" viewBox="0 0 100 20">
                      <path d="M 0 15 Q 20 5 40 12 T 80 3 T 100 8" />
                    </svg>
                  </div>

                  {/* Card 2: Orders */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Total Orders</span>
                        <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs">📦</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">{recentOrders?.length || 0}</h4>
                    </div>
                    <svg className="w-full h-6 mt-3 stroke-indigo-500 fill-none stroke-2" viewBox="0 0 100 20">
                      <path d="M 0 15 L 20 8 L 40 16 L 60 4 L 80 12 L 100 2" />
                    </svg>
                  </div>

                  {/* Card 3: Products */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Catalog Size</span>
                        <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs">🛍</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">425 Items</h4>
                    </div>
                    <svg className="w-full h-6 mt-3 stroke-cyan-500 fill-none stroke-2" viewBox="0 0 100 20">
                      <path d="M 0 18 Q 25 10 50 15 T 100 5" />
                    </svg>
                  </div>

                  {/* Card 4: Wallet */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Wallet Balance</span>
                        <span className="p-1 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-500 text-xs">💳</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">₹{walletBalance.toLocaleString('en-IN')}</h4>
                    </div>
                    <svg className="w-full h-6 mt-3 stroke-indigo-600 fill-none stroke-2" viewBox="0 0 100 20">
                      <path d="M 0 10 Q 30 18 60 12 T 100 15" />
                    </svg>
                  </div>

                  {/* Card 5: Wishlist */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Saved Items</span>
                        <span className="p-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs">❤️</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">{wishlistItems.length} Items</h4>
                    </div>
                    <svg className="w-full h-6 mt-3 stroke-red-500 fill-none stroke-2" viewBox="0 0 100 20">
                      <path d="M 0 15 Q 15 5 30 12 T 60 3 T 100 10" />
                    </svg>
                  </div>
                </div>

                {/* Recent Orders Folder (Tab Header Style) */}
                {isAuthenticated && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 left-0 bg-indigo-600 text-white font-bold px-6 py-2 rounded-t-xl text-xs flex items-center gap-2">
                      📂 Recent Orders Folder
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📂</span> Your Recent Orders
                      </h3>
                      <button
                        onClick={() => setActiveSection('orders')}
                        className="text-indigo-600 hover:text-orange-650 text-xs font-bold flex items-center gap-1 transition"
                      >
                        Open Order Deck ➔
                      </button>
                    </div>

                    {ordersLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="animate-pulse bg-gray-105 dark:bg-gray-800 rounded-xl h-36" />
                        ))}
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent orders found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentOrders.slice(0, 3).map((order) => (
                          <div key={order._id} className="bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)} {order.status}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-2">#{order.orderNumber}</p>
                              <div className="space-y-1 mb-3">
                                {order.items.slice(0, 2).map((item, idx) => (
                                  <p key={idx} className="text-xs font-semibold text-gray-750 dark:text-gray-300 truncate">
                                    {item.quantity}x {item.name || item.product?.name}
                                  </p>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-[10px] text-blue-500 font-semibold">+ {order.items.length - 2} more</p>
                                )}
                              </div>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</span>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold transition"
                              >
                                View Order
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bestsellers Section (Dashboard Preview) */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">👕 Bestsellers in {activeCategory}</h3>
                    <button
                      onClick={() => setActiveSection('bestsellers')}
                      className="text-indigo-505 hover:text-orange-650 text-xs font-bold flex items-center gap-1 transition"
                    >
                      Browse Bestsellers ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {loading ? (
                      [1, 2, 3].map((n) => <div key={n} className="animate-pulse h-48 bg-gray-150 dark:bg-gray-800 rounded-xl" />)
                    ) : (
                      bestsellers
                        .filter(p => (p.category || '').toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]))
                        .slice(0, 3)
                        .map(product => (
                          <div key={product._id} className="border border-gray-200 dark:border-gray-850 rounded-xl p-3 bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition flex flex-col justify-between">
                            <div>
                              <div className="h-32 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden mb-2 relative">
                                <img 
                                    src={product.images?.[0] || getFallbackImage(product.category)} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => handleImageError(e, product.category)}
                                  />
                              </div>
                              <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate">{product.name}</h4>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                              <span className="text-xs font-bold text-indigo-600">₹{product.price}</span>
                              <button
                                onClick={() => setQuickViewItem(product)}
                                className="text-[10px] text-blue-500 font-bold hover:underline"
                              >
                                Quick View
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Popular Shops (Dashboard Preview) */}
                <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">🏪 Popular Local Shops</h3>
                    <button
                      onClick={() => setActiveSection('shops')}
                      className="text-indigo-505 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
                    >
                      All Shops ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {shops.slice(0, 3).map(shop => (
                      <div key={shop._id} className="border border-gray-200 dark:border-gray-850 rounded-xl p-4 bg-gray-100 dark:bg-gray-900/50 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-2xl mb-2 block">🏪</span>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{shop.name}</h4>
                          <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{shop.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-150 dark:border-gray-800">
                          <span className="text-[10px] text-yellow-500 font-bold">★ {shop.rating || 0}</span>
                          <button
                            onClick={() => setSelectedShop(shop)}
                            className="text-[10px] text-indigo-505 font-bold"
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RECENT ORDERS DETAILED WORKSPACE CARD */}
            {activeSection === 'orders' && (
              <div className="space-y-6 animate-pop-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 dark:border-gray-800">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders Archive</h3>
                    <p className="text-xs text-gray-100 dark:text-gray-400 font-light">Track shipment details, check tracking numbers, or buy items again.</p>
                  </div>
                  <button
                    onClick={() => navigate('/orders')}
                    className="bg-gray-105 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition text-center border dark:border-gray-700"
                  >
                    View All History ➔
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24" />
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-100 dark:bg-gray-850 rounded-xl">
                    <span className="text-5xl block mb-3">📁</span>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">No orders found</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">You haven't completed any checkouts yet.</p>
                    <button
                      onClick={() => setActiveSection('bestsellers')}
                      className="bg-indigo-600 hover:bg-orange-650 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
                    >
                      Shop Bestsellers
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                                  <img 
                                    src={item.product?.images?.[0] || getFallbackImage(item.product?.category)} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => handleImageError(e, item.product?.category)}
                                  />
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)} {order.status.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Order #{order.orderNumber}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Total amount: <span className="font-bold text-indigo-505">₹{order.totalAmount}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-350 dark:border-gray-700 hover:bg-gray-105 dark:hover:bg-gray-750 text-xs px-3.5 py-2 rounded-xl font-bold transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold transition"
                          >
                            Track Delivery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CATEGORY BESTSELLERS WORKSPACE CARD */}
            {activeSection === 'bestsellers' && (
              <div className="space-y-6 animate-pop-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 dark:border-gray-800">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{activeCategory} Bestsellers</h3>
                    <p className="text-xs text-gray-100 dark:text-gray-400 font-light">Browse hot products and apply sorting/filters.</p>
                  </div>
                  
                  {/* Category tabs list */}
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {['Clothing', 'Electronics', 'Home & Kitchen', 'Beauty', 'Sports', 'Accessories'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                          activeCategory === cat
                            ? 'bg-indigo-505 text-white shadow-sm'
                            : 'bg-gray-105 dark:bg-gray-800 text-gray-650 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters Drawer Toggle */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-orange-405 rounded-xl text-xs font-semibold"
                  >
                    <span>Filter & Sort Controls</span>
                    <span className="ml-2">{isFilterOpen ? '▲' : '▼'}</span>
                  </button>

                  {isFilterOpen && (
                    <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-pop-in">
                      <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Price Threshold: Up to ₹{priceRange[1]}</p>
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                          className="w-full accent-indigo-505"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Sort Orders:</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: 'popularity', label: 'Default' },
                            { key: 'price-asc', label: 'Price: Low to High' },
                            { key: 'price-desc', label: 'Price: High to Low' },
                            { key: 'ratings', label: 'Highly Rated' }
                          ].map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => setSortKey(opt.key)}
                              className={`text-[10px] px-2 py-1 rounded border transition ${
                                sortKey === opt.key ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-305 dark:border-gray-700 text-gray-750 dark:text-gray-300'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    ))
                  ) : (
                    bestsellers
                      .filter((product) => {
                        if (activeCategory === 'Home & Kitchen') {
                          return ['Home', 'Furniture'].includes(product.category);
                        }
                        return (product.category || '').toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
                      })
                      .filter((product) => product.price <= priceRange[1])
                      .sort((a, b) => {
                        if (sortKey === 'price-asc') return a.price - b.price;
                        if (sortKey === 'price-desc') return b.price - a.price;
                        if (sortKey === 'ratings') return (b.rating || 0) - (a.rating || 0);
                        return 0;
                      })
                      .map((product) => (
                        <div key={product._id} className="border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col justify-between">
                          <div className="relative">
                            <div className="h-44 bg-gray-50 dark:bg-gray-850 flex items-center justify-center overflow-hidden">
                              <img 
                                src={product.images?.[0] || getFallbackImage(product.category)} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => handleImageError(e, product.category)}
                              />
                            </div>
                            <button
                              onClick={() => {
                                addWishItem(product);
                                setToastMessage(`${product.name} added to wishlist`);
                              }}
                              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-md text-sm hover:scale-105 transition"
                            >
                              ❤️
                            </button>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{product.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                              <span className="text-[10px] text-yellow-500 font-semibold block mt-1.5">★ {product.rating || 0}</span>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-4">
                              <span className="text-base font-bold text-indigo-600">₹{product.price}</span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => setQuickViewItem(product)}
                                  className="text-[10px] border border-gray-305 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded font-bold text-gray-750 dark:text-gray-300"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => {
                                    addItem(product);
                                    setToastMessage(`${product.name} added to cart`);
                                  }}
                                  className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold shadow-sm"
                                >
                                  + Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* FEATURED PRODUCTS WORKSPACE CARD */}
            {activeSection === 'featured' && (
              <div className="space-y-6 animate-pop-in">
                <div className="border-b pb-4 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Featured Catalog</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Handpicked items that match highest buyer satisfaction ratings.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {featured.map((product) => (
                    <div key={product._id} className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-md transition flex flex-col justify-between overflow-hidden">
                      <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.images?.[0] || getFallbackImage(product.category)} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => handleImageError(e, product.category)}
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{product.name}</h4>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                          <span className="text-sm font-bold text-indigo-505">₹{product.price}</span>
                          <button
                            onClick={() => setQuickViewItem(product)}
                            className="bg-indigo-505 hover:bg-indigo-700 text-white text-[10px] px-2.5 py-1 rounded-xl font-bold transition"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POPULAR SHOPS WORKSPACE CARD */}
            {activeSection === 'shops' && (
              <div className="space-y-6 animate-pop-in">
                <div className="border-b pb-4 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Explore Verified Local Shops</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Interactive shop directory with ratings and regional listings.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {shops.map((shop) => (
                    <div
                      key={shop._id}
                      className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-850 hover:shadow-lg transition duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-xl">
                            🏪
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{shop.name}</h4>
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-500 px-2 py-0.5 rounded font-bold">
                              {shop.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{shop.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-150 dark:border-gray-800">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <span>★</span>
                          <span className="text-gray-700 dark:text-gray-300 font-bold">{shop.rating || 0}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedShop(shop)}
                            className="bg-gray-105 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 text-gray-750 dark:text-gray-300 px-2.5 py-1 rounded-xl font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-800"
                          >
                            Details
                          </button>
                          <Link
                            to={`/shop/${shop._id}`}
                            className="bg-indigo-505 hover:bg-indigo-700 text-white px-3 py-1 rounded-xl font-bold text-xs transition"
                          >
                            Enter Shop
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

              {/* BENEFITS WORKSPACE CARD */}
            {activeSection === 'benefits' && (
              <div className="space-y-8 animate-pop-in">
                <div className="text-center max-w-xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Why Customers Choose Shopmate</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Delivering quality directly from neighborhood shops to your doorstep.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 text-center">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                      🚚
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Rapid Dispatch</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Safe transport from neighborhood stores directly to your home within the shortest period.
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 text-center">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                      🔒
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Encrypted Ledger</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Highly secured payments and authentication checks to protect transactional records.
                    </p>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 text-center">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                      ⭐
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Vouched Sellers</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Every registration undergoes strict vetting, ensuring original products and customer guarantees.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MY WALLET WORKSPACE CARD */}
            {activeSection === 'wallet' && (
              <div className="space-y-8 animate-pop-in">
                <div className="border-b pb-4 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Wallet</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Manage your digital balance, add funds, and view payment histories.</p>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold shadow-sm">
                    Active Ledger
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Card Display and Quick Add Form */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Visual Card Display */}
                    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 via-amber-500 to-indigo-700 text-white shadow-xl min-h-[190px] flex flex-col justify-between transform hover:-translate-y-1 transition duration-300">
                      {/* Decorative background shapes */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-indigo-100 font-semibold">ShopMate Balance Ledger</p>
                          <h4 className="text-2xl font-black mt-1 font-mono tracking-tight">₹{walletBalance.toLocaleString('en-IN')}</h4>
                        </div>
                        <div className="text-2xl font-bold italic tracking-wider opacity-90">SHOPMATE</div>
                      </div>

                      <div className="my-2">
                        <div className="text-[11px] font-mono text-indigo-100 tracking-widest">**** **** **** {user?._id ? user._id.slice(-4) : '1984'}</div>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/20 pt-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-indigo-100 font-medium">Card Holder</p>
                          <p className="text-xs font-bold truncate max-w-[150px]">{user?.name || 'Vouched Member'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-indigo-100 font-medium">Card Tier</p>
                          <p className="text-xs font-bold">Premium Gold</p>
                        </div>
                      </div>
                    </div>

                    {/* Add Funds Form */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        🪙 Add Mock Cash to Wallet
                      </h4>
                      
                      <form onSubmit={handleAddWalletFunds} className="space-y-4">
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                          <input
                            type="number"
                            placeholder="Enter amount (e.g. 500)"
                            value={addWalletAmount}
                            onChange={(e) => setAddWalletAmount(e.target.value)}
                            min="10"
                            max="50000"
                            className="w-full pl-8 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800 dark:text-gray-200"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div className="flex gap-2">
                          {[100, 500, 1000, 5000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setAddWalletAmount(preset.toString())}
                              className="flex-1 text-center py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-orange-900 text-gray-700 dark:text-gray-300 transition"
                            >
                              +₹{preset}
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-2"
                        >
                          💸 Load Deposit & Sync Ledger
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Transaction History Log */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col h-[380px]">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-3 border-b dark:border-gray-800 flex items-center justify-between">
                        <span>📝 Transaction History</span>
                        <span className="text-[10px] text-gray-400 font-light font-mono">{walletTransactions.length} Items</span>
                      </h4>

                      <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1">
                        {walletTransactions.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                            No ledger entries found.
                          </div>
                        ) : (
                          walletTransactions.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{tx.desc}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-400 font-light mt-0.5 font-mono">
                                  {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <span className={`text-xs font-bold ml-2 flex-shrink-0 ${
                                tx.type === 'credit' || tx.type === 'refund' 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-500 dark:text-red-400'
                              }`}>
                                {tx.type === 'credit' || tx.type === 'refund' ? '+' : ''}₹{Math.abs(tx.amount)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT & SETTINGS WORKSPACE CARD */}
            {activeSection === 'settings' && (
              <div className="space-y-8 animate-pop-in">
                <div className="border-b pb-4 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account & Settings</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Manage your user profile details, notifications, and theme settings.</p>
                  </div>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-500 px-3 py-1 rounded-full font-bold shadow-sm">
                    Config Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Account Profile Summary */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white shadow-md border-4 border-white dark:border-gray-800">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'VM'}
                      </div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white truncate">{user?.name || 'Vouched Member'}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.email || 'member@shopmate.com'}</p>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-left space-y-3 text-xs">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Account Role:</span>
                          <span className="font-bold uppercase text-indigo-600">Customer</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Region:</span>
                          <span className="font-semibold">{user?.region || 'Global'}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Joined:</span>
                          <span className="font-semibold">June 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Alert toggles & Theme Customization */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Notification Toggles */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-800 flex items-center gap-2">
                        🔔 Notification Preferences
                      </h4>

                      <div className="space-y-4 pt-1">
                        {/* Switch 1: Push notifications */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Push Notifications</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Get instant alerts about delivery tracking status on this device.</p>
                          </div>
                          <button
                            onClick={() => { setPushEnabled(!pushEnabled); setToastMessage(`Push alerts ${!pushEnabled ? 'enabled' : 'disabled'}`); }}
                            className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                              pushEnabled ? 'bg-indigo-600' : 'bg-gray-305 dark:bg-gray-700'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Switch 2: Email Alerts */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Email Alerts</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Receive order invoices and promotional updates in your inbox.</p>
                          </div>
                          <button
                            onClick={() => { setEmailAlerts(!emailAlerts); setToastMessage(`Email alerts ${!emailAlerts ? 'enabled' : 'disabled'}`); }}
                            className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                              emailAlerts ? 'bg-indigo-600' : 'bg-gray-305 dark:bg-gray-700'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Switch 3: Order Status Alerts */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Order Milestones</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Enable automatic updates when a package is processed or shipped.</p>
                          </div>
                          <button
                            onClick={() => { setOrderAlerts(!orderAlerts); setToastMessage(`Milestone alerts ${!orderAlerts ? 'enabled' : 'disabled'}`); }}
                            className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                              orderAlerts ? 'bg-indigo-600' : 'bg-gray-305 dark:bg-gray-700'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${orderAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Theme Mode selector */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-800 flex items-center gap-2">
                        🎨 Theme & Layout Mode
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Light Mode Selector */}
                        <button
                          onClick={() => { if (theme !== 'light') toggleTheme(); }}
                          className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                            theme === 'light'
                              ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 shadow-sm'
                              : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-750 dark:text-gray-350'
                          }`}
                        >
                          <span className="text-xl">☀️</span>
                          <span className="text-xs font-bold">Light Mode</span>
                        </button>

                        {/* Dark Mode Selector */}
                        <button
                          onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                          className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                            theme === 'dark'
                              ? 'border-indigo-600 bg-indigo-950/20 text-indigo-500 shadow-sm'
                              : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-750 dark:text-gray-350'
                          }`}
                        >
                          <span className="text-xl">🌙</span>
                          <span className="text-xs font-bold">Dark Mode</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT WORKSPACE CARD */}
            {activeSection === 'help' && (
              <div className="space-y-8 animate-pop-in">
                <div className="border-b pb-4 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Help & Support</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Search frequently asked questions and raise custom tickets for help.</p>
                  </div>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-500 px-3 py-1 rounded-full font-bold shadow-sm">
                    FAQ & Tickets
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Interactive FAQ Accordion */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                      💡 Frequently Asked Questions
                    </h4>

                    <div className="space-y-3">
                      {[
                        {
                          q: "How do I add money to my wallet?",
                          a: "Go to 'My Wallet' from the dashboard deck sidebar. Enter the desired amount in the loading field or tap preset options (+₹500, +₹1000) and click 'Load Deposit' to instantly update your mock balance."
                        },
                        {
                          q: "Can I pay using Cash on Delivery (COD)?",
                          a: "Yes! At checkout in your cart drawer, tick the 'Cash on Delivery' option. This applies an exclusive 10% promo discount to your grand total which is deducted instantly."
                        },
                        {
                          q: "How do I track my orders in real-time?",
                          a: "Select the 'Recent Orders' sidebar box to view your purchase items. Click 'Details' to open the glassmorphic invoice and check progress stages from 'Placed' to 'Delivered' via tracking nodes."
                        },
                        {
                          q: "How do I contact local shops directly?",
                          a: "You can click on the 'Explore Verified Local Shops' deck sidebar box, select any shop details popup, and click 'Visit Full Storefront' to view contact info, location details, and direct catalogs."
                        }
                      ].map((item, idx) => {
                        const isOpen = activeFaq === idx;
                        return (
                          <div 
                            key={idx}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition"
                          >
                            <button
                              type="button"
                              onClick={() => setActiveFaq(isOpen ? null : idx)}
                              className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                            >
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug">{item.q}</span>
                              <span className={`text-xs text-indigo-505 font-bold transition transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                🔽
                              </span>
                            </button>
                            
                            <div className={`transition-all duration-305 overflow-hidden ${
                              isOpen ? 'max-h-40 border-t border-gray-100 dark:border-gray-800 p-4' : 'max-h-0'
                            }`}>
                              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">{item.a}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Support Ticket Form */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-3 border-b dark:border-gray-800 flex items-center gap-1.5 mb-4">
                        📨 Open Support Ticket
                      </h4>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!supportQuery.trim()) return;
                          const ticketNum = Math.floor(100000 + Math.random() * 900000);
                          setToastMessage(`Support ticket #SR-${ticketNum} submitted! We will respond shortly.`);
                          setSupportQuery('');
                        }} 
                        className="space-y-4"
                      >
                        {/* Topic dropdown */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Topic</label>
                          <select
                            value={supportTopic}
                            onChange={(e) => setSupportTopic(e.target.value)}
                            className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800 dark:text-gray-200"
                          >
                            <option>Order Issues</option>
                            <option>Wallet & Payments</option>
                            <option>App & Feedback</option>
                            <option>Other</option>
                          </select>
                        </div>

                        {/* Contact Email */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contact Email</label>
                          <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="w-full text-xs p-2.5 bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800 dark:text-gray-200"
                          />
                        </div>

                        {/* Query Message */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Message / Details</label>
                          <textarea
                            required
                            rows="4"
                            placeholder="How can we assist you?"
                            value={supportQuery}
                            onChange={(e) => setSupportQuery(e.target.value)}
                            className="w-full text-xs p-2.5 bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800 dark:text-gray-200"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-1.5"
                        >
                          ✉️ Submit Request
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NESTED FLOATING OVERLAY: ORDER DETAIL POP-UP */}
            {selectedOrder && (
              <div className="absolute inset-0 bg-gray-950/70 dark:bg-black/85 backdrop-blur-md z-30 rounded-2xl flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[95%] overflow-y-auto p-6 relative flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg font-bold transition"
                    >
                      ✕
                    </button>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold border ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                        </span>
                        <span className="text-xs text-gray-500 font-light">Ordered {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-950 dark:text-white">Order Details</h3>
                      <p className="text-xs text-gray-500 font-light font-mono">Number: #{selectedOrder.orderNumber}</p>
                    </div>

                    {/* Delivery Progress Timeline */}
                    <div className="mb-4 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border dark:border-gray-800 text-xs">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-705 dark:text-gray-350 uppercase tracking-wider text-[10px]">📦 Delivery Progress</span>
                        {selectedOrder.estimatedDelivery && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm">
                            Est: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 relative mt-2 mb-1">
                        {/* Progress line */}
                        <div className="absolute top-[14px] left-[12%] right-[12%] h-[2px] bg-gray-200 dark:bg-gray-800 z-0">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-500" 
                            style={{ 
                              width: selectedOrder.status === 'pending' ? '0%' : 
                                     ['confirmed', 'processing'].includes(selectedOrder.status) ? '33.3%' : 
                                     selectedOrder.status === 'shipped' ? '66.6%' : 
                                     selectedOrder.status === 'delivered' ? '100%' : '0%' 
                            }}
                          />
                        </div>
                        
                        {/* Nodes */}
                        {[
                          { label: 'Placed', icon: '📝', active: true },
                          { label: 'Processing', icon: '⚙️', active: ['confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) },
                          { label: 'Shipped', icon: '🚚', active: ['shipped', 'delivered'].includes(selectedOrder.status) },
                          { label: 'Delivered', icon: '📦', active: selectedOrder.status === 'delivered' }
                        ].map((step, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-300 ${
                              step.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'
                            }`}>
                              {step.icon}
                            </div>
                            <span className={`text-[9px] font-bold mt-1 ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {selectedOrder.trackingNumber && (
                        <div className="mt-3 text-[10px] text-gray-500 dark:text-gray-400 border-t border-dashed dark:border-gray-800 pt-2 font-mono flex justify-between">
                          <span>Waybill:</span>
                          <span className="font-bold text-indigo-505">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-b border-gray-150 dark:border-gray-800 py-3 my-4 space-y-3 max-h-60 overflow-y-auto">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg border border-gray-150 dark:border-gray-800">
                          <div className="w-10 h-10 rounded bg-white dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              <img 
                                src={item.product?.images?.[0] || getFallbackImage(item.product?.category)} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => handleImageError(e, item.product?.category)}
                              />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name || item.product?.name}</p>
                            <p className="text-[10px] text-gray-500 font-light">Qty: {item.quantity} • Price: ₹{item.price}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className="text-xs font-bold text-gray-950 dark:text-white">₹{item.price * item.quantity}</span>
                            <button
                              onClick={() => {
                                addItem({
                                  _id: item.product?._id || item.product,
                                  name: item.name,
                                  price: item.price,
                                  images: item.product?.images || []
                                });
                                setToastMessage(`${item.name || 'Product'} added to cart`);
                              }}
                              className="text-[9px] bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded font-bold transition shadow-sm"
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (5%):</span>
                        <span>₹{selectedOrder.tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{selectedOrder.shippingCost}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400 font-bold animate-fade-in">
                          <span>COD Promo Discount:</span>
                          <span>-₹{selectedOrder.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-gray-950 dark:text-white text-sm pt-2">
                        <span>Grand Total:</span>
                        <span>₹{selectedOrder.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/orders')}
                        className="flex-1 bg-indigo-505 hover:bg-indigo-700 text-white text-xs py-2 rounded-xl font-bold transition text-center"
                      >
                        Track Order & Download Invoice
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-705 dark:text-gray-300 text-xs px-4 py-2 rounded-xl font-bold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NESTED FLOATING OVERLAY: SHOP DETAILED QUICK VIEW & ORDERING */}
            {selectedShop && (
              <div className="absolute inset-0 bg-gray-950/70 dark:bg-black/85 backdrop-blur-md z-30 rounded-2xl flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[95%] overflow-y-auto p-6 relative flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setSelectedShop(null)}
                      className="absolute top-4 right-4 text-gray-100 hover:text-gray-705 text-lg font-bold"
                    >
                      ✕
                    </button>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-2xl">🏪</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-950 dark:text-white">{selectedShop.name}</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold">{selectedShop.category}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{selectedShop.description}</p>
                    
                    <div className="space-y-1.5 border-t border-b border-gray-150 dark:border-gray-800 py-3 mb-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span className="font-semibold">Region/Location:</span>
                        <span>{selectedShop.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Rating:</span>
                        <span className="text-yellow-500">★ {selectedShop.rating || 0}</span>
                      </div>
                    </div>

                    {/* Shop Products List with ordering support */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">Shop Inventory (Order directly below):</h4>
                      {shopProductsLoading ? (
                        <div className="space-y-2">
                          {[1, 2].map(n => (
                            <div key={n} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-12" />
                          ))}
                        </div>
                      ) : shopProducts.length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic">No products available in this shop right now.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {shopProducts.map((product) => (
                            <div key={product._id} className="flex items-center justify-between p-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 transition">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center border">
                                  <img 
                                    src={product.images?.[0] || getFallbackImage(product.category)} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => handleImageError(e, product.category)}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-950 dark:text-white truncate">{product.name}</p>
                                  <p className="text-[10px] text-gray-500">₹{product.price} • ★{product.rating || 0}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  addItem(product);
                                  setToastMessage(`${product.name} added to cart`);
                                }}
                                className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold shadow-sm flex-shrink-0"
                              >
                                + Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Link
                      to={`/shop/${selectedShop._id}`}
                      className="flex-1 bg-indigo-505 hover:bg-indigo-700 text-white text-center text-xs py-2 rounded-xl font-bold transition"
                    >
                      Visit Full Storefront ➔
                    </Link>
                    <button
                      onClick={() => setSelectedShop(null)}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-4 py-2 rounded-xl font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NESTED FLOATING OVERLAY: PRODUCT DETAIL QUICK VIEW & ADD CART */}
            {quickViewItem && (
              <div className="absolute inset-0 bg-gray-950/70 dark:bg-black/85 backdrop-blur-md z-30 rounded-2xl flex items-center justify-center p-4 animate-pop-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setQuickViewItem(null)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-750 dark:text-gray-400 dark:hover:text-white font-bold text-lg"
                    >
                      ✕
                    </button>
                    
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Product Overview</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="h-44 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border">
                        <img 
                          src={quickViewItem.images?.[0] || getFallbackImage(quickViewItem.category)} 
                          alt={quickViewItem.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => handleImageError(e, quickViewItem.category)}
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{quickViewItem.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-yellow-500">★</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{quickViewItem.rating || 0}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">{quickViewItem.description}</p>
                        <div className="text-xl font-bold text-indigo-600 pt-1">₹{quickViewItem.price}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition text-xs shadow-sm"
                      onClick={() => {
                        addItem(quickViewItem);
                        setToastMessage(`${quickViewItem.name} added to cart`);
                      }}
                    >
                      Add to Cart (Order Now)
                    </button>
                    <button
                      className="px-4 py-2 text-gray-750 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setQuickViewItem(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </main>
        </div>
      </div>

      {/* Floating supportive widgets */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50 text-xs font-semibold animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
