/**
 * Order Model
 * Defines the schema for customer orders
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order Reference
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },

    // User Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Items in Order
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      total: Number
    }],

    // Pricing Details
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },

    // Delivery Information
    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
      region: String
    },

    // Order Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    },

    // Additional Details
    notes: String,
    cancelReason: String,
    returnReason: String,

    // Tracking
    trackingNumber: String,
    estimatedDelivery: Date,

    // Timeline
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },
  {
    timestamps: true
  }
);

// Auto-generate order number, tracking number, and estimated delivery
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  if (!this.trackingNumber) {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    this.trackingNumber = `TRK-${randomDigits}`;
  }
  if (!this.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Default 3 days estimation
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

// Index for faster queries
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
