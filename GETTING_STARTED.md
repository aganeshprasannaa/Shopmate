# Getting Started with ShopMate 🚀

Welcome to **ShopMate** - Your Regional Online Marketplace Platform!

This guide will help you get the application up and running in minutes.

## ⚡ Fastest Setup (Copy & Paste)

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env: Change JWT_SECRET to something random (min 32 chars)
npm run dev
```

### 2. Frontend (New Terminal)
```bash
cd client
npm install
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

## 📋 Requirements Checklist

- [ ] Node.js installed (v14+)
- [ ] npm installed (v6+)
- [ ] MongoDB running locally or MongoDB Atlas connection string
- [ ] Git installed (optional)
- [ ] A modern web browser

## 🎯 First Time Setup

### Step 1: Ensure MongoDB is Running
```bash
# If local MongoDB:
mongod

# If using MongoDB Atlas, have connection string ready
```

### Step 2: Backend Configuration
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopmate
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
CORS_ORIGIN=http://localhost:5173
```

```bash
# Start backend
npm run dev

# Expected output:
# ✓ MongoDB Connected
# ✓ Server running on http://localhost:5000
```

### Step 3: Frontend Configuration
```bash
cd client
npm install

# Create .env file
cp .env.example .env

# File already has correct settings
```

```bash
# Start frontend
npm run dev

# Expected output:
# ✓ Vite v4.x.0
# ➜ Local: http://localhost:5173/
```

### Step 4: Test the Application
1. Open http://localhost:5173
2. Register a new account
3. Explore the marketplace

## 🧪 Testing Account

After setup, create an account with test data:
- **Name:** Test User
- **Email:** test@example.com
- **Password:** password123
- **Region:** Central

Or use admin account:
- **Email:** admin@example.com
- **Password:** password123

## 📚 Important Files

### Documentation
- `README.md` - Full project documentation
- `QUICK_START.md` - Quick reference
- `INSTALLATION_GUIDE.md` - Detailed steps
- `PROJECT_DOCUMENTATION.md` - Architecture & APIs
- `FEATURE_CHECKLIST.md` - Complete feature list

### Configuration
- `server/.env.example` - Backend environment variables
- `client/.env.example` - Frontend environment variables
- `package.json` - Dependencies for both

## 🚀 Start Development

### Option 1: Manual (Easier)
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2  
cd client
npm run dev
```

### Option 2: Using Scripts
```bash
# Windows
start.bat

# Mac/Linux
bash start.sh
```

## 🔥 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas with cloud connection string
```

### Port 5000 Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### Port 5173 Already in Use
Edit `client/vite.config.js`:
```javascript
server: {
  port: 5174,  // or any free port
}
```

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -rf server/node_modules client/node_modules
npm install --prefix server
npm install --prefix client
```

## 📊 Project Structure Quick Overview

```
SHOPMATE/
├── server/          ← Backend (Express + MongoDB)
│   ├── models/      ← Database schemas
│   ├── routes/      ← API endpoints
│   ├── controllers/ ← Business logic
│   └── package.json ← Dependencies
│
├── client/          ← Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/   ← Page components
│   │   ├── components/
│   │   ├── services/← API calls
│   │   └── store/   ← State management
│   └── package.json ← Dependencies
│
└── Documentation    ← Guides & references
```

## 🎨 Features to Explore

1. **Shopping**
   - Browse shops by region
   - Search products
   - Add to cart
   - Checkout

2. **Account**
   - Register/Login
   - Update profile
   - View order history
   - Rate products

3. **Admin** (with admin account)
   - Add shops
   - Add products
   - Manage orders
   - View statistics

## 💡 Tips

1. **Development Tools**
   - Chrome DevTools (F12) - Check Network and Console
   - MongoDB Compass - Visualize database
   - Postman - Test API endpoints

2. **Useful Commands**
   ```bash
   # Backend
   npm run dev      # Development with auto-reload
   npm start        # Production mode
   
   # Frontend
   npm run dev      # Development server
   npm run build    # Production build
   ```

3. **Database**
   - MongoDB stores all data automatically
   - Data persists between restarts
   - Use MongoDB Compass to browse data

## 🔗 API Reference

Quick endpoint reference:

**Auth:**
- `POST /api/auth/register` - New account
- `POST /api/auth/login` - Login
- `GET /api/auth/current` - Current user

**Shops:**
- `GET /api/shops` - All shops
- `GET /api/shops/region/North` - By region

**Products:**
- `GET /api/products` - All products
- `GET /api/products/search?query=laptop` - Search

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders` - My orders

Full API docs in `PROJECT_DOCUMENTATION.md`

## 📞 Need Help?

1. Check the documentation files
2. Review error messages in console
3. Verify environment variables
4. Ensure MongoDB is running
5. Check backend logs for API errors

## 🎓 Learning Path

1. **Get it running** - Follow this guide
2. **Explore code** - Review components and controllers
3. **Understand flow** - Trace how data moves
4. **Read docs** - Study architecture
5. **Make changes** - Add features or customize
6. **Deploy** - Put it online

## 🚀 Next Steps

- [ ] Follow this setup guide
- [ ] Get the app running locally
- [ ] Test all features
- [ ] Read PROJECT_DOCUMENTATION.md
- [ ] Explore the code
- [ ] Make customizations
- [ ] Deploy to production

## 📝 Development Notes

- Backend uses port 5000
- Frontend uses port 5173
- MongoDB uses port 27017
- All data is stored locally/in MongoDB
- No data is sent to external services
- JWT tokens expire after 7 days

## 🎊 Ready?

You now have everything you need! Start by running:

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev

# Open
http://localhost:5173
```

**Happy coding! 🚀**

---

For detailed information, see the documentation files in the project root.
