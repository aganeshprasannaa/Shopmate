/**
 * Admin Routes
 * Handles administrative operations
 */

import express from 'express';
import {
  addShop,
  addProduct,
  updateProduct,
  updateOrderStatus,
  getDashboardStats,
  getAllOrders,
  getAllUsers
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, isAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Shops
router.post('/shops', addShop);

// Products
router.post('/products', addProduct);
router.put('/products/:productId', updateProduct);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

// Users
router.get('/users', getAllUsers);

export default router;
