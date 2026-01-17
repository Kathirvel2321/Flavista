import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    paymentResult
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    // Get restaurant from the first item in the order
    const firstFoodItem = await FoodItem.findById(orderItems[0].food);
    if (!firstFoodItem) {
      res.status(404);
      throw new Error('Food item not found, cannot create order.');
    }

    const order = new Order({
      orderItems,
      restaurantId: firstFoodItem.restaurant,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: isPaid || false,
      paidAt: paidAt || null,
      paymentResult: paymentResult || {},
      statusHistory: [{
        status: 'Processing',
        timestamp: Date.now(),
        description: 'Order placed successfully'
      }]
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('restaurantId', 'name image');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('restaurantId');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    order.statusHistory.push({
      status: req.body.status,
      timestamp: Date.now(),
      description: `Order is ${req.body.status}`
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (order.status !== 'Processing') {
      res.status(400);
      throw new Error('Cannot cancel order at this stage');
    }

    order.status = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: Date.now(),
      description: 'Order cancelled by user'
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };