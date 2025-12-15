import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import { calculateDeliveryFee, calculateEstimatedTime } from '../utils/delivery.js';

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity, restaurantId, areaId } = req.body;
    const userId = req.user.id;

    // Validate food exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId,
        areaId,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0
      });
    }

    // Update restaurant if changing
    if (restaurantId && cart.restaurantId !== restaurantId) {
      cart.restaurantId = restaurantId;
      cart.items = []; // Clear items on restaurant change
    }

    // Check if item already exists
    const existingItem = cart.items.find(item => item.foodId.toString() === foodId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        quantity,
        price: food.price || 0
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = Math.round(cart.subtotal * 0.05); // 5% tax

    if (areaId) {
      cart.areaId = areaId;
    }

    await cart.save();
    await cart.populate('items.foodId');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId })
      .populate('items.foodId')
      .populate('restaurantId')
      .populate('areaId');

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0
      });
    }

    // Recalculate total
    cart.total = cart.subtotal + cart.deliveryFee + cart.tax;

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update item quantity in cart
 */
export const updateCartItem = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.foodId.toString() === foodId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
    } else {
      item.quantity = quantity;
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = Math.round(cart.subtotal * 0.05);
    cart.total = cart.subtotal + cart.deliveryFee + cart.tax;

    await cart.save();
    await cart.populate('items.foodId');

    res.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = Math.round(cart.subtotal * 0.05);
    cart.total = cart.subtotal + cart.deliveryFee + cart.tax;

    await cart.save();
    await cart.populate('items.foodId');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndUpdate({ userId }, {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0
    });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
