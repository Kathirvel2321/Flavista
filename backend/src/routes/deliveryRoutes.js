import express from 'express';
import { checkDelivery, getAllAreas, getAreaById, getAreaByName } from '../controllers/deliveryController.js';

const router = express.Router();

// Check delivery availability for an area
router.post('/check', checkDelivery);

// Get all delivery areas
router.get('/areas', getAllAreas);

// Get area by ID
router.get('/areas/:id', getAreaById);

// Get area by name
router.get('/area/:name', getAreaByName);

export default router;