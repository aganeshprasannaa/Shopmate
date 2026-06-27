/**
 * Product Routes
 * Handles product browsing endpoints
 */

import express from 'express';
import {
  getAllProducts,
  getProductsByShop,
  getProductDetails,
  searchProducts,
  getFeaturedProducts,
  addProductReview
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/shop/:shopId', getProductsByShop);
router.get('/details/:productId', getProductDetails);
router.get('/search', searchProducts);
router.post('/:productId/review', verifyToken, addProductReview);

export default router;
