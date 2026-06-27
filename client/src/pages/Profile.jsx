import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  ShieldCheck, 
  Bell, 
  Sun, 
  Moon,
  Clock
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'notifications', 'settings'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Notification toggles inside tab
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
        region: user.region || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  // Sync activeTab with URL parameter tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'settings') {
      setActiveTab('settings');
    } else if (tabParam === 'notifications') {
      setActiveTab('notifications');
    } else {
      setActiveTab('profile');
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Account Directory</h1>
          <p className="text-xs text-gray-500 mt-1 font-light">Manage settings, alerts, regional options, and profile details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar Summary */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-indigo-650 rounded-full flex items-center justify-center font-black text-white text-2xl mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'VM'}
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name || 'Vouched Member'}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{user?.email}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-left space-y-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span className="font-light">Tier:</span>
                  <span className="font-bold text-indigo-500 uppercase">Customer</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light flex items-center gap-1">
                    <Clock size={12} />
                    Since:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Inner Switcher Deck */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-2.5 shadow-sm space-y-1">
              {[
                { id: 'profile', label: 'Personal Details', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'settings', label: 'Theme & Settings', icon: ShieldCheck }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-left transition ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400'
                        : 'text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850'
                    }`}
                  >
                    <IconComponent size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tab View Panels */}
          <div className="md:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
            
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-2xl text-xs font-bold border ${
                message.includes('successfully')
                  ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'
                  : 'bg-red-50/50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border-red-200 dark:border-red-900/50'
              }`}>
                {message}
              </div>
            )}

            {/* View 1: Personal Profile Forms */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b dark:border-gray-800 pb-3">Personal Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100 transition font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-500 text-xs cursor-not-allowed select-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Contact</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preferred region</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-850 dark:text-gray-200 cursor-pointer transition appearance-none"
                    >
                      <option value="">Select Region</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="Central">Central</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-100">Postal Addresses</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Building number, street info..."
                      className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100 transition"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  {loading ? 'Updating profile details...' : 'Save Profile details'}
                </button>
              </form>
            )}

            {/* View 2: Notifications Preferences tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b dark:border-gray-800 pb-3">Notification Preferences</h4>

                <div className="space-y-4 pt-1">
                  {/* Push switch */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Push Notifications</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Track delivery status updates directly on this screen.</p>
                    </div>
                    <button
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                        pushEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Email switch */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Email Alerts</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Receive copy updates of mock orders and wallet billing statements.</p>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                        emailAlerts ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Milestones switch */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Milestone updates</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Notify me instantly when package tracking moves from Placed to Delivered.</p>
                    </div>
                    <button
                      onClick={() => setOrderAlerts(!orderAlerts)}
                      className={`w-11 h-6 rounded-full transition duration-300 relative focus:outline-none flex items-center p-0.5 ${
                        orderAlerts ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${orderAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Theme Selector / Security Settings tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b dark:border-gray-800 pb-3">Theme & Layout Mode</h4>

                <div className="space-y-4 pt-1">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Select your preferred user interface color scheme:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Light theme toggle */}
                    <button
                      onClick={() => { if (theme !== 'light') toggleTheme(); }}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
                        theme === 'light'
                          ? 'border-indigo-500 bg-indigo-50/40 text-indigo-650 shadow-sm'
                          : 'border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-350'
                      }`}
                    >
                      <span className="text-xl">☀️</span>
                      <span className="text-xs font-bold">Light Mode</span>
                    </button>

                    {/* Dark theme toggle */}
                    <button
                      onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
                        theme === 'dark'
                          ? 'border-indigo-500 bg-indigo-950/20 text-indigo-400 shadow-sm'
                          : 'border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-350'
                      }`}
                    >
                      <span className="text-xl">🌙</span>
                      <span className="text-xs font-bold">Dark Mode</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
