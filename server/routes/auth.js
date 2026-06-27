/**
 * Authentication Routes
 * Handles all authentication endpoints
 */

import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/current', verifyToken, getCurrentUser);
router.put('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);

export default router;
