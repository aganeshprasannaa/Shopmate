/**
 * Product Controllers
 * Handles product browsing and details
 */

import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { shopId, category, minPrice, maxPrice, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const filter = { isActive: true };

    if (shopId) filter.shop = shopId;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('shop', 'name region address')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by shop
export const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { category, sort = '-createdAt' } = req.query;

    const filter = { shop: shopId, isActive: true };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .sort(sort)
      .select('-__v');

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product details
export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('shop', 'name rating address contact')
      .populate('totalReviews.user', 'name profileImage');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 2 characters'
      });
    }

    const products = await Product.find(
      {
        $text: { $search: query },
        isActive: true
      },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
      .limit(20);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('shop', 'name region')
      .limit(30);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add product review
export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add review
    product.totalReviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update rating
    const avgRating = product.totalReviews.reduce((sum, review) => sum + review.rating, 0) / product.totalReviews.length;
    product.rating = Math.round(avgRating * 10) / 10;
    product.reviewCount = product.totalReviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
