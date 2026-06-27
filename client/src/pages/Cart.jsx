import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Heart, 
  ShieldCheck, 
  CheckCircle, 
  Tag, 
  Truck,
  ChevronRight,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ordersAPI } from '../services/api';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Checkout modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [applyCodDiscount, setApplyCodDiscount] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(total * 0.05);
  const shipping = total > 500 ? 0 : 50;
  const grandTotal = total + tax + shipping;
  const codDiscount = applyCodDiscount ? Math.round(grandTotal * 0.10) : 0;
  const finalGrandTotal = grandTotal - codDiscount;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/cart' } });
    } else {
      setShowCheckout(true);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setErrorMsg('Please enter a delivery address');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Construct order payload
      const orderPayload = {
        items: items.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress: `${fullName}\nPhone: ${phone}\nAddress: ${shippingAddress}`,
        paymentMethod: 'cod',
        discount: codDiscount
      };

      const res = await ordersAPI.create(orderPayload);
      
      if (res.data.success || res.status === 201) {
        const placedOrder = res.data.order;
        // Clear global cart state
        clearCart();
        // Close modal
        setShowCheckout(false);
        // Redirect to orders page and auto expand the order
        navigate(`/orders?expand=${placedOrder._id}`);
      } else {
        setErrorMsg(res.data.message || 'Failed to place order. Try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMsg(error.response?.data?.message || 'Error processing order. Please check item availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] text-gray-900 dark:text-gray-100 flex items-center justify-center font-sans">
        <div className="text-center max-w-sm px-4 animate-pop-in">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your Cart is Empty</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light">Explore catalog products to load items into your active cart list.</p>
          <Link
            to="/shops"
            className="bg-indigo-650 hover:bg-indigo-705 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        
        {/* Header Block */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>🛒</span> Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">{items.length} item{items.length !== 1 ? 's' : ''} currently reserved</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-50 dark:bg-gray-850 rounded-2xl flex items-center justify-center p-3 border dark:border-gray-800 flex-shrink-0">
                    <img
                      src={item.images?.[0] || getFallbackImage(item.category)}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => handleImageError(e, item.category)}
                    />
                  </div>

                  {/* Item Specs & Quantities */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs font-bold text-indigo-505 dark:text-indigo-400 mt-1">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-gray-150 dark:hover:bg-gray-750 text-gray-500 font-bold transition disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3.5 py-1 font-bold min-w-8 text-center text-xs text-gray-800 dark:text-gray-200 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-gray-150 dark:hover:bg-gray-750 text-gray-500 font-bold transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Item Total & Trash */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6 h-fit lg:sticky lg:top-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b dark:border-gray-800 pb-3">Order Summary</h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-light">Subtotal ({items.length} Items)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-light">Tax (5%)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-light">Shipping Cost</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {shipping === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-gray-400 italic">Free shipping on orders above ₹500</p>
              )}
              
              <div className="border-t dark:border-gray-800 pt-4 mt-4 flex justify-between font-black text-sm text-gray-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-base">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-650 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shops"
              className="block text-center text-xs font-bold text-indigo-505 hover:underline"
            >
              ➔ Add More Items
            </Link>
          </div>
        </div>
      </div>

      {/* GORGEOUS POP-UP CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-scale-up">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold"
              disabled={isSubmitting}
            >
              ✕
            </button>
            
            <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="text-indigo-500" size={18} />
              Delivery & Payment Setup
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Provide delivery credentials to complete this order.</p>
            
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold mt-4 border border-red-200 dark:border-red-900/50">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mobile Contact Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Delivery Street Address</label>
                <textarea
                  required
                  rows="3"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House number, landmark, pin code..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  disabled={isSubmitting}
                />
              </div>

              {/* Cash On Delivery Option Box */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      💵 Cash on Delivery (COD)
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Pay via cash when package is dispatched.</p>
                  </div>
                  <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                    Pre-selected
                  </span>
                </div>
                
                {/* Interactive Promo Toggle */}
                <button
                  type="button"
                  onClick={() => setApplyCodDiscount(!applyCodDiscount)}
                  className={`w-full py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all duration-300 focus:outline-none ${
                    applyCodDiscount
                      ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-[10px] font-bold flex items-center gap-1.5">
                    <Sparkles size={12} className={applyCodDiscount ? "text-green-500 animate-spin" : "text-gray-400"} />
                    {applyCodDiscount ? 'COD 10% Discount Claimed!' : 'Claim COD 10% Promo Discount!'}
                  </span>
                  <span className="text-[9px] font-black uppercase">
                    {applyCodDiscount ? '✓ Active' : 'Claim'}
                  </span>
                </button>
              </div>

              {/* Invoice sub-ledger */}
              <div className="bg-slate-50 dark:bg-gray-850 p-4 rounded-xl text-xs space-y-2 border dark:border-gray-800">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Cart Items Total:</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                {applyCodDiscount && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                    <span>COD Promo Discount (10%):</span>
                    <span>-₹{codDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-gray-900 dark:text-white border-t border-dashed border-gray-200 dark:border-gray-800 pt-2 mt-2">
                  <span>Payable Total:</span>
                  <span>₹{finalGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : (
                    'Place Order (COD)'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  disabled={isSubmitting}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
