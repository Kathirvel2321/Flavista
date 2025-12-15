import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import { getAllFoods, getFoodById, searchFoods, createFood } from '../controllers/foodController.js';

const router = express.Router();

// Get all foods (with optional area filtering)
// Usage: GET /api/foods?area=Jaipur%20Downtown&page=1&limit=10
router.get('/', getAllFoods);

// Search foods (with optional area, cuisine, price filters)
// Usage: GET /api/foods/search?q=biryani&area=Jaipur%20Downtown&cuisine=Indian&priceMin=100&priceMax=500
router.get('/search', searchFoods);

// Get food by ID
router.get('/:id', getFoodById);

// Create food (Protected - Admin only)
router.post('/', protect, createFood);

export default router;