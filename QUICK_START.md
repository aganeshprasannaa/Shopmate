# ShopMate - Quick Start Guide

## Setup Instructions

### 1. Prerequisites
- Node.js and npm installed
- MongoDB running locally or connection string available
- Git (optional)

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Important: Set JWT_SECRET to a strong random string

# Start the server
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Database Setup

1. Ensure MongoDB is running
2. Create a database named `shopmate` (automatic with first connection)
3. Optionally seed with dummy data by running seed script

### 5. Testing the Application

1. Open `http://localhost:5173` in your browser
2. Register a new account or use test credentials
3. Browse shops and products
4. Add items to cart
5. Place orders

## Features Overview

### For Users
- 🔐 Secure Registration & Login
- 🏬 Browse Regional Shops
- 🛍️ Search & Filter Products
- 🛒 Shopping Cart Management
- 📦 Place & Track Orders
- ⭐ Leave Reviews & Ratings
- 👤 Manage Profile

### For Admin
- 📊 Dashboard with Statistics
- 🏪 Manage Shops & Products
- 📋 Manage Orders & Delivery
- 👥 Manage Users

## API Documentation

Full API endpoints are documented in the README.md file

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### CORS Error
- Verify CORS_ORIGIN in server `.env`
- Check if frontend URL matches

### Port Already in Use
- Change PORT in server `.env`
- Or kill the process using the port

## Build for Production

### Frontend
```bash
cd client
npm run build
# Creates dist folder for deployment
```

### Backend
```bash
cd server
npm build
# Ready for production deployment
```

## Need Help?

Check the main README.md or review code comments for more details!
