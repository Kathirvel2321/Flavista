import Area from '../models/Area.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import { calculateDeliveryFee, calculateEstimatedTime, haversineDistance, isWithinServiceRadius } from '../utils/delivery.js';

/**
 * Check delivery availability for an area
 * Finds restaurants that deliver to the area and calculates fees/ETA
 */
export const checkDelivery = async (req, res) => {
  try {
    const { areaName, postalCode, lat, lng } = req.body;

    // Find area by name or postal code
    let area;
    if (areaName) {
      area = await Area.findOne({ name: new RegExp(`^${areaName}$`, 'i') });
    } else if (postalCode) {
      area = await Area.findOne({ postalCodes: postalCode });
    }

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found'
      });
    }

    // Check if user location is within service radius
    const userCoords = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;
    if (userCoords && !isWithinServiceRadius(userCoords, area)) {
      return res.status(400).json({
        success: false,
        message: 'User location is outside service radius',
        serviceRadius: area.serviceRadius
      });
    }

    // Find restaurants delivering to this area
    const restaurants = await Restaurant.find({ deliveryAreas: area._id })
      .populate('menu')
      .select('-__v');

    // Add delivery info to each restaurant
    const results = restaurants.map(restaurant => {
      let distanceKm = null;
      if (userCoords && restaurant.coords) {
        distanceKm = haversineDistance(userCoords, restaurant.coords);
      }

      const deliveryInfo = calculateDeliveryFee(area, restaurant, distanceKm);
      const estimatedTime = calculateEstimatedTime(area, distanceKm);

      return {
        _id: restaurant._id,
        name: restaurant.name,
        location: restaurant.location,
        rating: restaurant.rating,
        imaage: restaurant.imaage,
        menu: restaurant.menu,
        deliveryFee: deliveryInfo.fee,
        deliveryFeeBreakdown: deliveryInfo.breakdown,
        estimatedDeliveryTime: estimatedTime,
        distanceKm: distanceKm,
        isOpen: restaurant.isOpen
      };
    });

    res.json({
      success: true,
      area: {
        _id: area._id,
        name: area.name,
        city: area.city,
        baseFee: area.baseFee,
        perKmFee: area.perKmFee
      },
      restaurantsCount: results.length,
      restaurants: results
    });
  } catch (error) {
    console.error('Error checking delivery:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get all delivery areas
 */
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find({ isActive: true })
      .select('-__v')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: areas.length,
      areas
    });
  } catch (error) {
    console.error('Error fetching areas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get area by ID
 */
export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).select('-__v');

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }

    // Also fetch restaurants in this area
    const restaurants = await Restaurant.find({ deliveryAreas: area._id })
      .select('name location rating');

    res.json({
      success: true,
      area,
      restaurantsCount: restaurants.length,
      restaurants
    });
  } catch (error) {
    console.error('Error fetching area:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get area by name
 */
export const getAreaByName = async (req, res) => {
  try {
    const { name } = req.params;
    const area = await Area.findOne({ name: new RegExp(`^${name}$`, 'i') }).select('-__v');

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }

    res.json({
      success: true,
      area
    });
  } catch (error) {
    console.error('Error fetching area:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
