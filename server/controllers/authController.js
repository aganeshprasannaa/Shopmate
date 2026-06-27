/**
 * Authentication Controllers
 * Handles user registration, login, and profile management
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Mock database for offline mode
const mockUsers = new Map([
  ['admin@example.com', {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$9JvFx8PCtfQmhBvz8n3Rh.eCPz8J5c5C5Z5X5V5T5R5P5N5L5J5H.q', // password123
    role: 'admin',
    region: 'Mumbai',
    isActive: true
  }],
  ['owner@example.com', {
    id: '2',
    name: 'Shop Owner',
    email: 'owner@example.com',
    password: '$2a$10$9JvFx8PCtfQmhBvz8n3Rh.eCPz8J5c5C5Z5X5V5T5R5P5N5L5J5H.q', // password123
    role: 'shop_owner',
    region: 'Delhi',
    isActive: true
  }],
  ['john@example.com', {
    id: '3',
    name: 'John Customer',
    email: 'john@example.com',
    password: '$2a$10$9JvFx8PCtfQmhBvz8n3Rh.eCPz8J5c5C5Z5X5V5T5R5P5N5L5J5H.q', // password123
    role: 'customer',
    region: 'Bangalore',
    isActive: true
  }]
]);

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, region } = req.body;

    // Validation
    if (!name || !email || !password || !region) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      region,
      role: 'customer'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user = null;
    let isPasswordValid = false;

    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Use real database
      user = await User.findOne({ email }).select('+password');
      if (user) {
        isPasswordValid = await user.matchPassword(password);
      }
    } else {
      // Use mock data for offline mode
      const mockUser = mockUsers.get(email);
      if (mockUser) {
        user = mockUser;
        isPasswordValid = await bcryptjs.compare(password, mockUser.password);
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Generate token
    const token = generateToken(user.id || user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city, pincode },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isPasswordValid = await user.matchPassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
