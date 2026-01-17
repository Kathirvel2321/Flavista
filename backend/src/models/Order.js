import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      food: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FoodItem' },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  status: { type: String, default: 'Processing' }, // Processing, Preparing, On the way, Delivered, Cancelled
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      description: { type: String }
    }
  ],
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;