# ShopMate Project - Complete Documentation

## 📋 Project Overview

ShopMate is a full-stack regional online marketplace platform designed to connect buyers with local shops in their region. The application enables users to browse shops, search products, manage shopping carts, place orders, and track deliveries with a modern, responsive UI.

## 🎯 Project Objectives

1. Provide a seamless shopping experience for regional products
2. Support shop owners to manage their online presence
3. Ensure secure transactions and user data protection
4. Enable administrators to manage the platform
5. Deliver a mobile-responsive, user-friendly interface

## ✨ Key Features Implemented

### Core Features
- ✅ **User Authentication**: Secure JWT-based login/registration
- ✅ **Regional Shop Browsing**: Filter shops by region and category
- ✅ **Product Catalog**: Search, filter, and view product details
- ✅ **Shopping Cart**: Add/remove items, update quantities
- ✅ **Order Management**: Create orders, track status, cancel orders
- ✅ **User Profile**: Manage personal information and address
- ✅ **Order History**: View all past and current orders
- ✅ **Product Reviews**: Leave ratings and reviews
- ✅ **Admin Dashboard**: Manage shops, products, and orders

### Technical Features
- ✅ **Responsive Design**: Works on mobile, tablet, desktop
- ✅ **Error Handling**: Comprehensive error management and validation
- ✅ **Loading States**: UI feedback during async operations
- ✅ **State Management**: Zustand for cart and auth state
- ✅ **API Integration**: Axios with interceptors
- ✅ **Environment Configuration**: Different configs for dev/prod
- ✅ **Database Indexing**: Optimized queries for fast searches
- ✅ **Password Hashing**: bcryptjs for secure password storage

## 📚 Architecture

### Frontend Architecture
```
Client (React + Vite)
├── Components (Reusable UI)
│   ├── Navbar (Navigation)
│   ├── ProtectedRoute (Auth guard)
│   ├── LoadingSpinner (Loader)
│   └── ...
├── Pages (Screen components)
│   ├── Home (Landing page)
│   ├── Login/Register (Auth)
│   ├── Shops (Shop listing)
│   ├── Cart (Shopping cart)
│   ├── Orders (Order history)
│   └── Profile (User profile)
├── Services (API layer)
│   └── api.js (HTTP client)
├── Store (State management)
│   ├── authStore.js (Auth state)
│   └── cartStore.js (Cart state)
└── Utils (Helpers)
```

### Backend Architecture
```
Server (Node.js + Express)
├── Models (Database schemas)
│   ├── User.js
│   ├── Shop.js
│   ├── Product.js
│   └── Order.js
├── Routes (API endpoints)
│   ├── auth.js
│   ├── shops.js
│   ├── products.js
│   ├── orders.js
│   └── admin.js
├── Controllers (Business logic)
│   ├── authController.js
│   ├── shopController.js
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── Middleware (Custom handlers)
│   ├── auth.js (JWT verification)
│   └── errorHandler.js (Error handling)
└── Utils (Helper functions)
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  region: String,
  role: String (customer|shop_owner|admin),
  phone: String,
  address: String,
  city: String,
  pincode: String,
  profileImage: String,
  isActive: Boolean,
  isVerified: Boolean,
  orderCount: Number,
  totalSpent: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  category: String,
  region: String,
  address: String,
  city: String,
  pincode: String,
  owner: ObjectId (ref to User),
  contactEmail: String,
  contactPhone: String,
  website: String,
  shopImage: String,
  rating: Number,
  reviewCount: Number,
  isActive: Boolean,
  isVerified: Boolean,
  totalProducts: Number,
  orderCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  discountPrice: Number,
  stock: Number,
  sku: String (unique),
  shop: ObjectId (ref to Shop),
  images: [String],
  thumbnail: String,
  rating: Number,
  reviewCount: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  tags: [String],
  viewCount: Number,
  purchaseCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref to User),
  items: [{
    product: ObjectId,
    shop: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  status: String (pending|confirmed|shipped|delivered|cancelled),
  paymentMethod: String,
  paymentStatus: String,
  shippingAddress: Object,
  trackingNumber: String,
  createdAt: Date,
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date
}
```

## 🔗 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/current` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |

### Shop Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/shops` | Get all shops (with filters) | ❌ |
| GET | `/api/shops/region/:region` | Get shops by region | ❌ |
| GET | `/api/shops/details/:shopId` | Get shop details | ❌ |
| GET | `/api/shops/categories/list` | Get shop categories | ❌ |
| GET | `/api/shops/search` | Search shops | ❌ |

### Product Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/featured` | Get featured products | ❌ |
| GET | `/api/products/shop/:shopId` | Get products by shop | ❌ |
| GET | `/api/products/details/:productId` | Get product details | ❌ |
| GET | `/api/products/search` | Search products | ❌ |
| POST | `/api/products/:productId/review` | Add product review | ✅ |

### Order Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create new order | ✅ |
| GET | `/api/orders` | Get user orders | ✅ |
| GET | `/api/orders/:orderId` | Get order details | ✅ |
| PUT | `/api/orders/:orderId/cancel` | Cancel order | ✅ |
| GET | `/api/orders/:orderId/track` | Track order | ✅ |

### Admin Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics | ✅ Admin |
| POST | `/api/admin/shops` | Add new shop | ✅ Admin |
| POST | `/api/admin/products` | Add new product | ✅ Admin |
| PUT | `/api/admin/products/:productId` | Update product | ✅ Admin |
| GET | `/api/admin/orders` | Get all orders | ✅ Admin |
| PUT | `/api/admin/orders/:orderId/status` | Update order status | ✅ Admin |
| GET | `/api/admin/users` | Get all users | ✅ Admin |

## 🔐 Authentication Flow

```
1. User Registration
   ├─ POST /auth/register with credentials
   ├─ Server validates input
   ├─ Hash password with bcryptjs
   ├─ Create user in database
   ├─ Generate JWT token
   └─ Return token to client

2. User Login
   ├─ POST /auth/login with email/password
   ├─ Find user by email
   ├─ Compare passwords using bcryptjs
   ├─ Generate JWT token
   └─ Return token to client

3. Protected Requests
   ├─ Client sends request with Authorization header
   ├─ Server middleware verifies JWT token
   ├─ Extract user ID from token payload
   ├─ Attach user info to request object
   └─ Process request
```

## 🛡️ Security Measures

1. **Password Security**
   - Bcryptjs hashing with salt rounds
   - Passwords never returned in API responses
   - Secure password change mechanism

2. **JWT Authentication**
   - Secret key stored in environment variables
   - Configurable expiration time (7 days default)
   - Token stored in localStorage (frontend)

3. **Authorization**
   - Role-based access control (RBAC)
   - Admin, shop_owner, customer roles
   - Route protection based on roles

4. **Data Validation**
   - Input validation on all endpoints
   - Email format validation
   - Price/quantity/stock validation

5. **Error Handling**
   - No sensitive data in error messages
   - Proper HTTP status codes
   - Detailed logging for debugging

## 📊 Data Flow Examples

### Shopping Flow
```
Browse Home
    ↓
Select Region/Category
    ↓
View Shops → Select Shop
    ↓
View Products → Select Product
    ↓
Add to Cart (stored in localStorage)
    ↓
Review Cart
    ↓
Checkout (requires login)
    ↓
Place Order → API creates order
    ↓
Order Confirmation
    ↓
Track Order Status
```

### Admin Flow
```
Admin Login
    ↓
Dashboard
    ├─ View Statistics
    ├─ Manage Shops
    │  ├─ Add new shop
    │  └─ Verify shop
    ├─ Manage Products
    │  ├─ Add products
    │  └─ Update products
    └─ Manage Orders
       └─ Update status
```

## 🚀 Deployment Considerations

### Frontend Deployment (Vercel)
- Build: `npm run build`
- Output: dist folder
- Environment: Set API_URL
- Auto-deploy from Git

### Backend Deployment (Railway/Render)
- Set environment variables
- Database connection string
- JWT_SECRET
- CORS_ORIGIN settings
- Node.js runtime

### Database Deployment (MongoDB Atlas)
- Create free cluster
- Set connection IP whitelist
- Update MONGODB_URI
- Regular backups

## 📈 Performance Optimization

1. **Frontend**
   - Lazy loading of routes
   - Image optimization
   - CSS minification
   - Code splitting

2. **Backend**
   - Database indexing on frequently searched fields
   - Pagination for large datasets
   - Efficient query filtering
   - Caching strategies

3. **Network**
   - API response compression
   - Efficient payload sizes
   - HTTP/2 support

## 🧪 Testing Scenarios

### User Scenarios
1. New user registration and first login
2. Browse shops by region
3. Search for specific products
4. Add multiple items to cart
5. Place order and track delivery
6. Leave product reviews

### Edge Cases
1. Out of stock products
2. Cancelled orders with refunds
3. Duplicate product additions to cart
4. Payment method selection
5. Address validation

## 📝 Future Enhancements

1. **Payment Integration**
   - Stripe integration
   - PayPal
   - UPI payments

2. **Social Features**
   - Product sharing
   - Wishlist
   - Social logins

3. **Analytics**
   - User tracking
   - Sales reports
   - Product recommendations

4. **Notifications**
   - Email notifications
   - SMS alerts
   - Push notifications

5. **Advanced Features**
   - Real-time chat with shops
   - Subscription orders
   - Gift cards
   - Loyalty program

## 📞 Support & Maintenance

- Regular security updates
- Bug fixes and patches
- Performance monitoring
- User support system
- Feedback collection

---

**Project Completion Status: ✅ 100%**

All core features, models, routes, controllers, and UI components have been implemented with comprehensive documentation and error handling.
