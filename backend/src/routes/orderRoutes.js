import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/cancel', cancelOrder);

export default router;
