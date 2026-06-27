/**
 * Shop Routes
 * Handles shop browsing endpoints
 */

import express from 'express';
import {
  getAllShops,
  getShopsByRegion,
  getShopDetails,
  getCategories,
  searchShops
} from '../controllers/shopController.js';

const router = express.Router();

// Shop routes
router.get('/', getAllShops);
router.get('/region/:region', getShopsByRegion);
router.get('/details/:shopId', getShopDetails);
router.get('/categories/list', getCategories);
router.get('/search', searchShops);

export default router;
