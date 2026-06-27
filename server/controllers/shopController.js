/**
 * Shop Controllers
 * Handles shop browsing and details
 */

import Shop from '../models/Shop.js';

// Get all shops with filters
export const getAllShops = async (req, res) => {
  try {
    const { region, category, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = { isActive: true, isVerified: true };

    if (region) filter.region = region;
    if (category) filter.category = category;

    // Search query
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const shops = await Shop.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Shop.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: shops,
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

// Get shops by region
export const getShopsByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const validRegions = ['North', 'South', 'East', 'West', 'Central'];

    if (!validRegions.includes(region)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid region'
      });
    }

    const shops = await Shop.find({ region, isActive: true, isVerified: true })
      .sort('-rating')
      .select('-__v');

    res.status(200).json({
      success: true,
      region,
      shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get shop details
export const getShopDetails = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId).populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (!shop.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Shop is currently inactive'
      });
    }

    res.status(200).json({
      success: true,
      shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get shop categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Shop.distinct('category', { isActive: true });
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search shops
export const searchShops = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 2 characters'
      });
    }

    const shops = await Shop.find(
      {
        $text: { $search: query },
        isActive: true,
        isVerified: true
      },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
