import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
      _id: false
    }
  ],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  deliveryAddress: { type: String },
  deliveryCoords: {
    lat: Number,
    lng: Number
  },
  estimatedDeliveryTime: { type: Number }, // minutes
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'on-the-way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['card', 'cash', 'wallet'], default: 'cash' },
  specialInstructions: { type: String }
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
