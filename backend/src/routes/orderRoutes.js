import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getMyOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

export default router;