import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  Package, 
  Tag, 
  User, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopGroupExpanded, setShopGroupExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    {
      name: 'Shop',
      icon: ShoppingBag,
      isGroup: true,
      expanded: shopGroupExpanded,
      setExpanded: setShopGroupExpanded,
      subItems: [
        { name: 'All Products', href: '/shops' },
        { name: 'Categories', href: '/shops?group=categories' },
        { name: 'New Arrivals', href: '/shops?sort=newest' },
        { name: 'Trending', href: '/shops?sort=popularity' },
        { name: 'Best Sellers', href: '/shops?sort=rating' }
      ]
    },
    { name: 'Search', icon: Search, href: '/shops?focus=search' },
    { name: 'Wishlist', icon: Heart, href: '/wishlist', badge: wishlistItems.length },
    { name: 'Cart', icon: ShoppingCart, href: '/cart', badge: cartItems.length },
    { name: 'Orders', icon: Package, href: '/orders', protected: true },
    { name: 'Coupons', icon: Tag, href: '/cart?focus=coupons' },
    { name: 'Account', icon: User, href: '/profile', protected: true },
    { name: 'Notifications', icon: Bell, href: '/profile?tab=notifications', protected: true },
    { name: 'Support', icon: HelpCircle, href: '/?tab=support' },
    { name: 'Settings', icon: Settings, href: '/profile?tab=settings', protected: true }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-gray-300 font-sans select-none border-r border-gray-800">
      {/* Header / Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold text-base tracking-wider">SM</span>
          </div>
          {!isCollapsed && (
            <span className="text-white text-lg font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              ShopMate
            </span>
          )}
        </Link>
        {/* Toggle Collapse Button (Desktop Only) */}
        <button 
          onClick={toggleSidebar} 
          className="hidden lg:flex w-6 h-6 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white items-center justify-center transition"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown className="rotate-90" size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
        {navItems.map((item, idx) => {
          if (item.protected && !isAuthenticated) return null;

          const IconComponent = item.icon;

          if (item.isGroup) {
            return (
              <div key={idx} className="space-y-1">
                <button
                  onClick={() => !isCollapsed && item.setExpanded(!item.expanded)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800/60 hover:text-white transition duration-200 group ${
                    location.pathname.startsWith('/shops') ? 'text-white bg-gray-800/40' : 'text-gray-405'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-gray-800/40 text-gray-400 group-hover:text-indigo-400 transition">
                      <IconComponent size={18} />
                    </div>
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span>{item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                  )}
                </button>
                
                {/* Sub items */}
                {!isCollapsed && item.expanded && (
                  <div className="pl-12 space-y-1 mt-1 border-l border-gray-800 ml-5">
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block py-1.5 text-xs rounded-lg transition ${
                          location.pathname + location.search === sub.href
                            ? 'text-indigo-400 font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname + location.search === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href.split('?')[0]));

          return (
            <Link
              key={idx}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 relative group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/10' 
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              }`}
            >
              {/* Active Left Border Indicator */}
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r" />
              )}
              
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-lg transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-gray-800/40 text-gray-400 group-hover:text-indigo-400'
                }`}>
                  <IconComponent size={18} />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </div>

              {/* Badge count */}
              {!isCollapsed && item.badge > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Session Drawer Footer */}
      <div className="p-4 border-t border-gray-800">
        {isAuthenticated ? (
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="px-3 py-2 bg-gray-900/40 rounded-xl border border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-505 flex items-center justify-center font-bold text-white text-xs select-none">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.email || 'customer@shopmate.com'}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-200"
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Sign In
            </Link>
            {!isCollapsed && (
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition"
              >
                Create Account
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Burger Button */}
      <div className="lg:hidden fixed top-3.5 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;