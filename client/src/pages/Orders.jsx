import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  RotateCcw, 
  Clock, 
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Receipt,
  MapPin,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const Orders = () => {
  const { addItem } = useCartStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filter) params.status = filter;
        const res = await ordersAPI.getAll(params);
        setOrders(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  // Handle auto-expanding and scrolling to a specific order from URL params
  useEffect(() => {
    if (orders.length === 0) return;
    const searchParams = new URLSearchParams(location.search);
    const expandId = searchParams.get('expand') || searchParams.get('track') || searchParams.get('id');
    if (expandId) {
      const exists = orders.some(o => o._id === expandId);
      if (exists) {
        setExpandedOrder(expandId);
        setTimeout(() => {
          const element = document.getElementById(`order-${expandId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 400);
      }
    }
  }, [orders, location.search]);

  const getStatusDetails = (status) => {
    const details = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50', icon: CheckCircle2 },
      processing: { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50', icon: Clock },
      shipped: { color: 'bg-purple-105 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50', icon: CheckCircle2 },
      cancelled: { color: 'bg-red-105 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50', icon: XCircle },
      returned: { color: 'bg-red-105 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50', icon: RotateCcw }
    };
    return details[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package };
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Header Block */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Orders Ledger</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">
            Track deliveries, examine purchase details, and manage billing invoices.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-2 flex items-center gap-1">
              <SlidersHorizontal size={14} />
              Status Filter:
            </span>
            {[
              { label: 'All Orders', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'Shipped', value: 'shipped' },
              { label: 'Delivered', value: 'delivered' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === tab.value
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                    : 'bg-gray-100 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards Output */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm max-w-sm mx-auto">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light">When you purchase items, your delivery timelines will populate here.</p>
            <Link
              to="/shops"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition inline-block shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const { color: badgeColor, icon: IconComponent } = getStatusDetails(order.status);
              const isExpanded = expandedOrder === order._id;
              
              return (
                <div 
                  key={order._id} 
                  id={`order-${order._id}`}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden scroll-mt-6"
                >
                  {/* Order Card Header */}
                  <div className="p-5 bg-slate-50/50 dark:bg-gray-900/40 border-b dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${badgeColor}`}>
                        <IconComponent size={12} />
                        <span className="uppercase tracking-wider">{order.status}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-light flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex sm:items-center gap-6 text-xs justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: #{order.orderNumber}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="p-1.5 rounded-xl border hover:bg-slate-50 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 transition focus:outline-none"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Preview Items Strip */}
                  {!isExpanded && (
                    <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-900 p-1 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                              <img
                                src={item.product?.images?.[0] || getFallbackImage(item.product?.category)}
                                alt={item.name || "Product"}
                                className="w-full h-full object-contain"
                                onError={(e) => handleImageError(e, item.product?.category)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {order.items[0]?.name || order.items[0]?.product?.name || "Order items"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {order.items.length > 1 ? `and ${order.items.length - 1} other products` : 'Single package item'}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="text-xs font-bold text-indigo-505 hover:underline flex items-center gap-0.5"
                      >
                        Examine & Track Details
                      </button>
                    </div>
                  )}

                  {/* Expanded Timeline and Invoicing details */}
                  {isExpanded && (
                    <div className="p-6 border-t dark:border-gray-800 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pop-in">
                      {/* Left: Product List Details */}
                      <div className="lg:col-span-8 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reserved Items Checklist</h4>
                        
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-50/50 dark:bg-gray-850 p-3 rounded-2xl border dark:border-gray-800">
                              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl border p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <img
                                  src={item.product?.images?.[0] || getFallbackImage(item.product?.category)}
                                  alt={item.name || "Product"}
                                  className="w-full h-full object-contain"
                                  onError={(e) => handleImageError(e, item.product?.category)}
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name || item.product?.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity} • Price: ₹{item.price.toLocaleString()}</p>
                              </div>

                              <div className="text-right flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                                <button
                                  onClick={() => {
                                    addItem(item.product || { _id: item.productId, name: item.name, price: item.price }, 1);
                                    alert(`${item.name || "Product"} added to cart`);
                                  }}
                                  className="text-[10px] bg-indigo-50 hover:bg-indigo-600 text-indigo-650 hover:text-white px-2.5 py-1 rounded-lg font-bold transition shadow-sm"
                                >
                                  Buy Again
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Timeline Tracking */}
                        <div className="bg-slate-50/50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-2xl p-5 mt-6">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                            <Truck size={14} className="text-indigo-500" />
                            Package Delivery Milestones
                          </h4>
                          
                          <div className="grid grid-cols-4 gap-2 relative mt-2 mb-1">
                            {/* Connector Line */}
                            <div className="absolute top-[14px] left-[12%] right-[12%] h-[2px] bg-gray-200 dark:bg-gray-800 z-0">
                              <div 
                                className="h-full bg-indigo-500 transition-all duration-500" 
                                style={{ 
                                  width: order.status === 'pending' ? '0%' : 
                                         ['confirmed', 'processing'].includes(order.status) ? '33.3%' : 
                                         order.status === 'shipped' ? '66.6%' : 
                                         order.status === 'delivered' ? '100%' : '0%' 
                                }}
                              />
                            </div>
                            
                            {/* Timeline stages */}
                            {[
                              { label: 'Placed', icon: '📝', active: true },
                              { label: 'Processing', icon: '⚙️', active: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) },
                              { label: 'Shipped', icon: '🚚', active: ['shipped', 'delivered'].includes(order.status) },
                              { label: 'Delivered', icon: '📦', active: order.status === 'delivered' }
                            ].map((step, sIdx) => (
                              <div key={sIdx} className="flex flex-col items-center text-center relative z-10 select-none">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-300 ${
                                  step.active ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                                }`}>
                                  {step.icon}
                                </div>
                                <span className={`text-[9px] font-bold mt-1.5 ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Invoice Summary Card */}
                      <div className="lg:col-span-4 bg-slate-50/50 dark:bg-gray-850 p-5 rounded-2xl border dark:border-gray-800 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Receipt size={14} className="text-indigo-500" />
                          Billing Invoice
                        </h4>
                        
                        <div className="space-y-2 text-xs border-b dark:border-gray-800 pb-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-semibold">₹{order.subtotal?.toLocaleString() || order.totalAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tax (5%):</span>
                            <span className="font-semibold">₹{order.tax?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Shipping Cost:</span>
                            <span className="font-semibold">{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                              <span>COD Promo Discount:</span>
                              <span>-₹{order.discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-gray-900 dark:text-white border-t border-dashed border-gray-200 dark:border-gray-800 pt-2 mt-2">
                            <span>Paid Total:</span>
                            <span>₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Shipping Address summary */}
                        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <div className="font-bold flex items-center gap-1 text-gray-900 dark:text-white">
                            <MapPin size={12} className="text-indigo-500" />
                            Delivery Address
                          </div>
                          <p className="font-light whitespace-pre-line leading-relaxed bg-white dark:bg-gray-900 p-3 rounded-xl border dark:border-gray-800 mt-1">
                            {order.shippingAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
