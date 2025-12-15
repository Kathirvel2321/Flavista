import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.post('/', addToCart);
router.get('/', getCart);
router.put('/item', updateCartItem);
router.delete('/item/:foodId', removeFromCart);
router.delete('/', clearCart);

export default router;
