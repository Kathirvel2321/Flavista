import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import Area from '../models/Area.js';

/**
 * Get all foods with optional area filtering
 * If area is provided, only return foods from restaurants delivering to that area
 */
export const getAllFoods = async (req, res) => {
  try {
    const { area, areaName, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    let foodIds = null;

    // Filter by area if provided
    if (area || areaName) {
      const areaQuery = area || areaName;
      const areaDoc = await Area.findOne({ name: new RegExp(`^${areaQuery}$`, 'i') });

      if (areaDoc) {
        // Find restaurants delivering to this area
        const restaurants = await Restaurant.find({ deliveryAreas: areaDoc._id }).select('menu');
        
        // Collect all food IDs from those restaurants
        foodIds = restaurants.flatMap(r => r.menu);
        
        if (foodIds.length > 0) {
          query = { _id: { $in: foodIds } };
        } else {
          // No restaurants in this area
          return res.json({
            success: true,
            area: areaDoc.name,
            count: 0,
            foods: []
          });
        }
      }
    }

    // Fetch foods with pagination
    const foods = await Food.find(query)
      .limit(limitNum)
      .skip(skip)
      .select('-__v');

    const totalCount = await Food.countDocuments(query);

    res.json({
      success: true,
      area: area || areaName || 'All Areas',
      count: foods.length,
      total: totalCount,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      foods
    });
  } catch (error) {
    console.error('Error fetching foods:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get food by ID
 */
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id).select('-__v');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json({
      success: true,
      food
    });
  } catch (error) {
    console.error('Error fetching food:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Search foods by name, cuisine with optional area filtering
 */
export const searchFoods = async (req, res) => {
  try {
    const { q, cuisine, area, areaName, priceMin, priceMax, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { cuisine: new RegExp(q, 'i') }
      ];
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = new RegExp(`^${cuisine}$`, 'i');
    }

    // Filter by price range
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    // Filter by area
    let foodIds = null;
    if (area || areaName) {
      const areaQuery = area || areaName;
      const areaDoc = await Area.findOne({ name: new RegExp(`^${areaQuery}$`, 'i') });

      if (areaDoc) {
        const restaurants = await Restaurant.find({ deliveryAreas: areaDoc._id }).select('menu');
        foodIds = restaurants.flatMap(r => r.menu);

        if (foodIds.length === 0) {
          return res.json({
            success: true,
            search: q || 'All foods',
            area: areaDoc.name,
            count: 0,
            foods: []
          });
        }

        query._id = { $in: foodIds };
      }
    }

    // Execute search
    const foods = await Food.find(query)
      .limit(limitNum)
      .skip(skip)
      .select('-__v');

    const totalCount = await Food.countDocuments(query);

    res.json({
      success: true,
      search: q || 'All foods',
      area: area || areaName || 'All Areas',
      count: foods.length,
      total: totalCount,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      foods
    });
  } catch (error) {
    console.error('Error searching foods:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create food (Admin only)
 */
export const createFood = async (req, res) => {
  try {
    const { name, description, price, cuisine, category, image, ingredients, isVeg, spicyLevel } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const food = new Food({
      name,
      description,
      price,
      cuisine,
      category,
      image,
      ingredients: ingredients || [],
      isVeg: isVeg || false,
      spicyLevel: spicyLevel || 'Mild',
      rating: 0
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: 'Food created',
      food
    });
  } catch (error) {
    console.error('Error creating food:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
