import express from 'express';
import { searchFood, getSearchSuggestions, getFoodById, getFoodsByCategory, seedDatabase, getTrendingFoods } from '../controllers/foodController.js';

const router = express.Router();

router.get('/search', searchFood);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingFoods);
router.get('/category/:category', getFoodsByCategory);
router.post('/seed', seedDatabase);
router.get('/:id', getFoodById);

export default router;