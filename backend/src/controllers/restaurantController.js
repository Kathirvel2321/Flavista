import Restaurant from '../models/Restaurant.js';
import Area from '../models/Area.js';
import { calculateDeliveryFee, calculateEstimatedTime, haversineDistance } from '../utils/delivery.js';

/**
 * Get all restaurants with optional area filtering and delivery info
 */
export const getAllRestaurants = async (req, res) => {
  try {
    const { area, areaName, lat, lng } = req.query;

    let query = {};
    let areaDoc = null;
    let userCoords = null;

    // If area provided, filter restaurants delivering to that area
    if (area || areaName) {
      const areaQuery = area || areaName;
      areaDoc = await Area.findOne({ name: new RegExp(`^${areaQuery}$`, 'i') });

      if (areaDoc) {
        query.deliveryAreas = areaDoc._id;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Delivery area not found'
        });
      }
    }

    // Parse user coordinates if provided
    if (lat && lng) {
      userCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }

    // Fetch restaurants
    const restaurants = await Restaurant.find(query)
      .populate('menu')
      .populate('deliveryAreas')
      .select('-__v');

    // Add delivery info to each restaurant if area is provided
    let results = restaurants;
    if (areaDoc) {
      results = restaurants.map(restaurant => {
        let distanceKm = null;
        if (userCoords && restaurant.coords) {
          distanceKm = haversineDistance(userCoords, restaurant.coords);
        }

        const deliveryInfo = calculateDeliveryFee(areaDoc, restaurant, distanceKm);
        const estimatedTime = calculateEstimatedTime(areaDoc, distanceKm);

        return {
          ...restaurant.toObject(),
          deliveryFee: deliveryInfo.fee,
          deliveryFeeBreakdown: deliveryInfo.breakdown,
          estimatedDeliveryTime: estimatedTime,
          distanceKm: distanceKm
        };
      });
    }

    res.json({
      success: true,
      area: areaDoc ? areaDoc.name : 'All Areas',
      count: results.length,
      restaurants: results
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get restaurant by ID with full details
 */
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const { area, areaName, lat, lng } = req.query;

    const restaurant = await Restaurant.findById(id)
      .populate('menu')
      .populate('deliveryAreas')
      .select('-__v');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    let result = restaurant.toObject();

    // Add delivery info if area provided
    if (area || areaName) {
      const areaQuery = area || areaName;
      const areaDoc = await Area.findOne({ name: new RegExp(`^${areaQuery}$`, 'i') });

      if (areaDoc) {
        let distanceKm = null;
        if (lat && lng && restaurant.coords) {
          distanceKm = haversineDistance(
            { lat: parseFloat(lat), lng: parseFloat(lng) },
            restaurant.coords
          );
        }

        const deliveryInfo = calculateDeliveryFee(areaDoc, restaurant, distanceKm);
        const estimatedTime = calculateEstimatedTime(areaDoc, distanceKm);

        result.deliveryArea = areaDoc.name;
        result.deliveryFee = deliveryInfo.fee;
        result.deliveryFeeBreakdown = deliveryInfo.breakdown;
        result.estimatedDeliveryTime = estimatedTime;
        result.distanceKm = distanceKm;
      }
    }

    res.json({
      success: true,
      restaurant: result
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get restaurants by delivery area name
 */
export const getRestaurantsByArea = async (req, res) => {
  try {
    const { areaName } = req.params;
    const { lat, lng } = req.query;

    const area = await Area.findOne({ name: new RegExp(`^${areaName}$`, 'i') });
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found'
      });
    }

    const restaurants = await Restaurant.find({ deliveryAreas: area._id })
      .populate('menu')
      .populate('deliveryAreas')
      .select('-__v');

    // Add delivery info
    let userCoords = null;
    if (lat && lng) {
      userCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }

    const results = restaurants.map(restaurant => {
      let distanceKm = null;
      if (userCoords && restaurant.coords) {
        distanceKm = haversineDistance(userCoords, restaurant.coords);
      }

      const deliveryInfo = calculateDeliveryFee(area, restaurant, distanceKm);
      const estimatedTime = calculateEstimatedTime(area, distanceKm);

      return {
        ...restaurant.toObject(),
        deliveryFee: deliveryInfo.fee,
        deliveryFeeBreakdown: deliveryInfo.breakdown,
        estimatedDeliveryTime: estimatedTime,
        distanceKm: distanceKm
      };
    });

    res.json({
      success: true,
      area: area.name,
      count: results.length,
      restaurants: results
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
