import express from 'express';
import { getAllRestaurants, getRestaurantById, getRestaurantsByArea } from '../controllers/restaurantController.js';

const router = express.Router();

// Get all restaurants (with optional area filtering and delivery fees)
// Usage: GET /api/restaurants?area=Jaipur%20Downtown&lat=26.9124&lng=75.7873
router.get('/', getAllRestaurants);

// Get restaurants by area name (with delivery fees)
// Usage: GET /api/restaurants/area/Jaipur%20Downtown?lat=26.9124&lng=75.7873
router.get('/area/:areaName', getRestaurantsByArea);

// Get restaurant by ID (with optional area and delivery fees)
// Usage: GET /api/restaurants/60d5ec49c1234567890abcde?area=Jaipur%20Downtown&lat=26.9124&lng=75.7873
router.get('/:id', getRestaurantById);

export default router;