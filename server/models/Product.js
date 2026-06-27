/**
 * Product Model
 * Defines the schema for products in shops
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Product Information
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: true
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      default: null
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // Stock Management
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative']
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },

    // Relationships
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },

    // Images
    images: [{
      type: String,
      default: null
    }],
    thumbnail: {
      type: String,
      default: null
    },

    // Specifications
    specifications: {
      color: String,
      size: String,
      weight: String,
      dimensions: String,
      material: String,
      warranty: String
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
    totalReviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],

    // Product Status
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },

    // SEO
    tags: [String],
    slug: String,

    // Statistics
    viewCount: {
      type: Number,
      default: 0
    },
    purchaseCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
productSchema.index({ shop: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

export default mongoose.model('Product', productSchema);
