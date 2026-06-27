# ShopMate - Regional Online Marketplace

A full-stack web application for a regional online marketplace platform that allows users to browse shops, view products, manage shopping carts, place orders, and more.

## 🚀 Features

### User Features
- ✅ User Registration and Login with JWT Authentication
- ✅ Browse regional shops
- ✅ View products with detailed information
- ✅ Add products to cart
- ✅ Place orders with multiple payment methods
- ✅ Track orders
- ✅ View order history
- ✅ Leave product reviews and ratings
- ✅ User profile management

### Shop Management
- ✅ Shop browsing by region and category
- ✅ Product search and filtering
- ✅ Shop details with contact information
- ✅ Shop ratings and reviews

### Admin Features
- ✅ Add and manage shops
- ✅ Add and manage products
- ✅ Update order status
- ✅ View dashboard statistics
- ✅ Manage users

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopmate
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📂 Project Structure

```
shopmate/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                # Node.js/Express Backend
    ├── models/            # MongoDB schemas
    │   ├── User.js
    │   ├── Shop.js
    │   ├── Product.js
    │   └── Order.js
    ├── routes/            # API endpoints
    │   ├── auth.js
    │   ├── shops.js
    │   ├── products.js
    │   ├── orders.js
    │   └── admin.js
    ├── controllers/       # Business logic
    ├── middleware/        # Custom middleware
    ├── utils/             # Helper functions
    ├── config/            # Configuration files
    ├── server.js          # Main server entry point
    ├── package.json
    └── .env.example
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/current` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Shops
- `GET /api/shops` - Get all shops with filters
- `GET /api/shops/region/:region` - Get shops by region
- `GET /api/shops/details/:shopId` - Get shop details
- `GET /api/shops/categories/list` - Get all categories
- `GET /api/shops/search` - Search shops

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/shop/:shopId` - Get products by shop
- `GET /api/products/details/:productId` - Get product details
- `GET /api/products/search` - Search products
- `POST /api/products/:productId/review` - Add product review (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:orderId` - Get order details (protected)
- `PUT /api/orders/:orderId/cancel` - Cancel order (protected)
- `GET /api/orders/:orderId/track` - Track order (protected)

### Admin (All protected, admin role required)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/shops` - Add shop
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:productId` - Update product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:orderId/status` - Update order status
- `GET /api/admin/users` - Get all users

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

1. User registers/logs in
2. Server generates JWT token
3. Token is stored in localStorage (frontend)
4. Token is sent in Authorization header for protected routes
5. Server verifies token and grants access

## 💾 Database Schema

### User
- name, email, password (hashed)
- region, address, city, pincode
- role (customer, shop_owner, admin)
- profileImage, isActive, isVerified
- orderCount, totalSpent, rating

### Shop
- name, description, category, region
- address, city, pincode, coordinates
- owner (ref to User)
- contactEmail, contactPhone, website
- rating, reviewCount, isActive, isVerified
- totalProducts, orderCount

### Product
- name, description, category
- price, discountPrice, discountPercentage
- stock, sku
- shop (ref to Shop)
- images, thumbnail
- specifications (color, size, weight, etc.)
- rating, reviewCount, totalReviews
- isActive, isFeatured
- tags, viewCount, purchaseCount

### Order
- orderNumber, user, items
- subtotal, tax, shippingCost, discount, totalAmount
- shippingAddress, status, paymentMethod, paymentStatus
- transactionId, trackingNumber
- timeline (created, confirmed, shipped, delivered, cancelled)

## 🎨 UI Components

- **Navbar** - Navigation with cart and user menu
- **Product Cards** - Displays product information
- **Shop Cards** - Displays shop information
- **Cart View** - Shopping cart management
- **Order Summary** - Order details and pricing
- **Filter Panel** - Search and filter options

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Upload dist folder to Vercel
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy using git or platform CLI
```

## 📝 Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopmate
JWT_SECRET=your_complex_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

To test the application:

1. Register a new user
2. Browse shops by region
3. View product details
4. Add products to cart
5. Place an order
6. Track order status
7. View order history

## 📊 Sample Login Credentials

For testing, after running the application:

**Customer:**
- Email: john@example.com
- Password: password123

**Shop Owner:**
- Email: owner@example.com
- Password: password123

**Admin:**
- Email: admin@example.com
- Password: password123

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Created with ❤️ for learning and development purposes.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Coding! 🎉**
