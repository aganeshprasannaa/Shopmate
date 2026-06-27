/**
 * ShopMate Backend Server
 * Main entry point for the Express application
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Create app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import routes
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shops.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User.js';
import Shop from './models/Shop.js';
import Product from './models/Product.js';
import { dummyUsers, dummyShops, dummyProducts } from './config/dummyData.js';

// Database Seeding Logic
const seedDatabase = async () => {
  try {
    // Clear any existing database data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});

    // Seed Users (use User.create to run pre-save hooks for password hashing)
    const createdUsers = await User.create(dummyUsers);
    console.log(`✓ Seeded ${createdUsers.length} users`);

    // Get owner user
    const ownerUser = createdUsers.find(u => u.role === 'shop_owner') || createdUsers[0];

    // Seed Shops
    const shopsWithOwners = dummyShops.map(shop => ({
      ...shop,
      owner: ownerUser._id,
      isActive: true,
      isVerified: true
    }));
    const createdShops = await Shop.create(shopsWithOwners);
    console.log(`✓ Seeded ${createdShops.length} shops`);

    // Seed Products
    const productsWithShops = dummyProducts.map((product, index) => {
      // Find the shop that has the same category as the product, or fallback to the first shop
      const shop = createdShops.find(s => s.category === product.category) || createdShops[0];
      return {
        ...product,
        shop: shop._id,
        sku: `${shop._id.toString().slice(-4)}-${index}-${Date.now()}`,
        isActive: true
      };
    });
    const createdProducts = await Product.create(productsWithShops);
    console.log(`✓ Seeded ${createdProducts.length} products`);

    console.log('✓ Database Seeding completed successfully');
  } catch (error) {
    console.error('⚠️ Database Seeding error:', error.message);
  }
};

// Database Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopmate';
    if (uri.includes('h9qxxx.mongodb.net') || uri.includes('placeholder')) {
      throw new Error('Placeholder/Mock Atlas URL detected');
    }
    await mongoose.connect(uri);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.warn('⚠️  MongoDB Connection Error:', error.message);
    console.log('ℹ️  Starting in-memory MongoDB Server for offline/mock mode...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log('✓ MongoDB Memory Server Connected');
      
      // Seed database with mock data
      await seedDatabase();
    } catch (dbError) {
      console.error('❌ Failed to start and seed database memory server:', dbError);
    }
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    application: "ShopMart",
    message: "Welcome to the ShopMart Backend API",
    status: "Backend server is running successfully.",
    version: "1.0.0"
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
