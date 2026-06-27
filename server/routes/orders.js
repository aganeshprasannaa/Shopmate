/**
 * Order Routes
 * Handles order management endpoints
 */

import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  trackOrder
} from '../controllers/orderController.js';
import { verifyToken, isCustomer } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', verifyToken, isCustomer, createOrder);
router.get('/', verifyToken, getUserOrders);
router.get('/:orderId', verifyToken, getOrderDetails);
router.put('/:orderId/cancel', verifyToken, cancelOrder);
router.get('/:orderId/track', verifyToken, trackOrder);

export default router;
