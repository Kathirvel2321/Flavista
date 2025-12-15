import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Restaurant from '../models/Restaurant.js';
import Area from '../models/Area.js';
import { calculateDeliveryFee, calculateEstimatedTime } from '../utils/delivery.js';

/**
 * Create an order from cart
 */
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, deliveryLat, deliveryLng, paymentMethod, specialInstructions } = req.body;
    const userId = req.user.id;

    // Get cart
    const cart = await Cart.findOne({ userId }).populate('restaurantId').populate('areaId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate restaurant and area
    if (!cart.restaurantId || !cart.areaId) {
      return res.status(400).json({ success: false, message: 'Restaurant or area not selected' });
    }

    const area = cart.areaId;
    const restaurant = cart.restaurantId;

    // Calculate delivery fee
    let distanceKm = null;
    if (deliveryLat && deliveryLng && restaurant.coords) {
      const userCoords = { lat: parseFloat(deliveryLat), lng: parseFloat(deliveryLng) };
      const R = 6371;
      const toRad = deg => deg * Math.PI / 180;
      const dLat = toRad(restaurant.coords.lat - userCoords.lat);
      const dLng = toRad(restaurant.coords.lng - userCoords.lng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(userCoords.lat)) * Math.cos(toRad(restaurant.coords.lat)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanceKm = R * c;
    }

    const deliveryInfo = calculateDeliveryFee(area, restaurant, distanceKm);
    const estimatedTime = calculateEstimatedTime(area, distanceKm);

    // Create order
    const order = new Order({
      userId,
      restaurantId: restaurant._id,
      areaId: area._id,
      items: cart.items,
      subtotal: cart.subtotal,
      deliveryFee: deliveryInfo.fee,
      tax: cart.tax,
      total: cart.subtotal + deliveryInfo.fee + cart.tax,
      deliveryAddress,
      deliveryCoords: deliveryLat && deliveryLng ? { lat: parseFloat(deliveryLat), lng: parseFloat(deliveryLng) } : null,
      estimatedDeliveryTime: estimatedTime,
      paymentMethod: paymentMethod || 'cash',
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    await order.populate('restaurantId areaId items.foodId');

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      restaurantId: null,
      areaId: null
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('restaurantId areaId items.foodId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('restaurantId areaId items.foodId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Can only cancel if pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
