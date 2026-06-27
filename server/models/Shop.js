/**
 * Shop Model
 * Defines the schema for regional shops
 */

import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide shop name'],
      trim: true,
      unique: true,
      minlength: [3, 'Shop name must be at least 3 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    category: {
      type: String,
      enum: ['Electronics', 'Clothing', 'Grocery', 'Furniture', 'Books', 'Beauty', 'Sports', 'Home & Kitchen', 'Other'],
      required: [true, 'Please select a category']
    },

    // Location & Region
    region: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'Central'],
      required: [true, 'Please select a region']
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },

    // Owner Information
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Shop Details
    shopImage: {
      type: String,
      default: null
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    website: {
      type: String,
      default: null
    },

    // Business Hours
    openingTime: {
      type: String,
      default: '09:00'
    },
    closingTime: {
      type: String,
      default: '21:00'
    },

    // Ratings & Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },

    // Shop Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },

    // Statistics
    totalProducts: {
      type: Number,
      default: 0
    },
    orderCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
shopSchema.index({ region: 1, category: 1 });
shopSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Shop', shopSchema);
