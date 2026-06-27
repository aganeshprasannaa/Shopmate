import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  CreditCard, 
  Star, 
  ArrowLeft, 
  MapPin, 
  Store,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Truck
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { productsAPI } from '../services/api';
import { handleImageError, getFallbackImage } from '../utils/imageFallback';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data.product);

        if (response.data.product.category) {
          const relatedResponse = await productsAPI.getAll({
            category: response.data.product.category,
            limit: 6
          });
          setRelatedProducts((relatedResponse.data.data || []).filter(p => p._id !== id));
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/product/${id}` } });
      return;
    }
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/product/${id}` } });
      return;
    }
    addItem(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">The product you're looking for doesn't exist or is currently unavailable.</p>
          <Link to="/shops" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition inline-block">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 && product.images[0] 
    ? product.images 
    : [getFallbackImage(product.category)];

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-4 sm:py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-6 select-none">
          <Link to="/" className="hover:text-indigo-600 transition">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to="/shops" className="hover:text-indigo-600 transition">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 dark:text-gray-200 font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden flex items-center justify-center p-6 relative group shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-350 cursor-zoom-in"
                onError={(e) => handleImageError(e, product.category)}
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% Discount
                </span>
              )}
            </div>
            
            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage === index 
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-305'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, product.category)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchasing Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
              
              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">
                    {product.category || 'Local Choice'}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">{product.name}</h1>
                
                {/* Rating Breakdown Summary */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500"><Star size={14} fill="currentColor" /></span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{product.rating || 0}</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">In Stock</span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="bg-slate-50 dark:bg-gray-850 p-4 rounded-2xl border dark:border-gray-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Inclusive of all local taxes & GST</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 justify-between border-t border-b border-gray-100 dark:border-gray-800 py-3">
                <span className="text-xs font-bold text-gray-750 dark:text-gray-300">Set Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 hover:bg-gray-150 dark:hover:bg-gray-700 text-gray-600 font-bold transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 font-bold min-w-10 text-center text-xs text-gray-800 dark:text-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 hover:bg-gray-150 dark:hover:bg-gray-700 text-gray-600 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 border border-indigo-600 text-indigo-600 dark:text-indigo-400 py-2.5 rounded-xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-650 hover:to-indigo-700 text-white py-2.5 rounded-xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Buy Now
                </button>
              </div>

            </div>

            {/* Merchant info details box */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Merchant Vouch</h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Store size={14} className="text-indigo-500" />
                    <span>Shop Name:</span>
                  </div>
                  <Link
                    to={`/shop/${product.shop?._id}`}
                    className="text-indigo-500 font-bold hover:underline truncate max-w-[180px]"
                  >
                    {product.shop?.name || 'Verified Partner'}
                  </Link>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="text-indigo-500" />
                    <span>Region Location:</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{product.shop?.region || 'Global'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Tabs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm mb-12">
          <div className="flex border-b dark:border-gray-800 pb-px">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-bold text-xs border-b-2 transition-all focus:outline-none ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="py-6 min-h-[120px]">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                <p>{product.description || 'No detailed specifications listed for this product.'}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Customer Feedback</h3>
                  <button 
                    onClick={() => alert('Review functionality is mockup only.')} 
                    className="text-xs font-bold text-indigo-500 hover:underline"
                  >
                    Write a review
                  </button>
                </div>
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-850 rounded-2xl border dark:border-gray-800">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-xs italic">No reviews yet. Be the first to catalog your feedback!</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 dark:text-gray-400">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Truck size={14} className="text-indigo-500" />
                    Rapid Dispatch
                  </h4>
                  <p className="font-light leading-relaxed">Free delivery on transactions above ₹500. Standard packaging delivers within 3 business days.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-indigo-500" />
                    Refund Guarantee
                  </h4>
                  <p className="font-light leading-relaxed">30-day hassle free return policy. Goods must be returned in their original packaged condition.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-indigo-500" />
                    Secure Billing
                  </h4>
                  <p className="font-light leading-relaxed">Every transaction is protected. We accept mock digital wallet cash, card payments, and COD options.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Related Products</h2>
              <Link 
                to={`/shops?category=${product.category}`} 
                className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
              >
                See more ➔
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group shadow-sm"
                >
                  <div className="aspect-square bg-gray-50 dark:bg-gray-850 flex items-center justify-center p-4 overflow-hidden relative">
                    {relatedProduct.images?.[0] ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-250"
                        onError={(e) => handleImageError(e, relatedProduct.category)}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] mt-1 text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-gray-500 font-bold">{relatedProduct.rating || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        ₹{relatedProduct.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-indigo-500 font-bold">Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;