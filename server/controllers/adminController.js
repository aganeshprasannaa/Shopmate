/**
 * Admin Controllers
 * Handles admin operations for shop and product management
 */

import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Admin: Add Shop
export const addShop = async (req, res) => {
  try {
    const { name, description, category, region, address, city, pincode, contactEmail, contactPhone, website } = req.body;

    if (!name || !category || !region || !address || !city || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Check if shop already exists
    const existingShop = await Shop.findOne({ name });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'Shop with this name already exists'
      });
    }

    const shop = new Shop({
      name,
      description,
      category,
      region,
      address,
      city,
      pincode,
      owner: req.user.id,
      contactEmail,
      contactPhone,
      website,
      isVerified: true // Admin can verify directly
    });

    await shop.save();

    // Update user as shop owner
    await User.findByIdAndUpdate(req.user.id, {
      role: 'shop_owner',
      shopId: shop._id
    });

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, shopId, images, specifications, tags } = req.body;

    if (!name || !description || !category || !price || stock === undefined || !shopId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Verify shop exists and user owns it
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add products to this shop'
      });
    }

    // Generate SKU
    const sku = `${shopId.toString().slice(-4)}-${Date.now()}`;

    const product = new Product({
      name,
      description,
      category,
      price,
      stock,
      shop: shopId,
      images: images || [],
      specifications: specifications || {},
      tags: tags || [],
      sku,
      isActive: true
    });

    await product.save();

    // Update shop product count
    shop.totalProducts += 1;
    await shop.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Update Product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Product.findById(productId).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify authorization
    if (product.shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (!['_id', 'shop', 'sku'].includes(key)) {
        product[key] = updates[key];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        trackingNumber: trackingNumber || order?.trackingNumber,
        ...(status === 'shipped' && { shippedAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalShops,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
