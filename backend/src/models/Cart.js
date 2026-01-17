import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, default: 1, min: 1 },
      price: { type: Number },
      _id: false
    }
  ],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.index({ userId: 1 });

export default mongoose.model('Cart', cartSchema);
