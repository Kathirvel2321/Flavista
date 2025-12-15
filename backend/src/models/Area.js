import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: { type: String },
  postalCodes: { type: [String], default: [] },
  baseFee: { type: Number, default: 30 },
  perKmFee: { type: Number, default: 5 },
  deliveryFee: { type: Number, default: 0 }, // kept for backward compatibility
  estimatedDeliveryTime: { type: String, default: "30-45 mins" },
  estimatedDeliveryTimeMinutes: { type: Number, default: 40 },
  serviceRadius: { type: Number, default: 15 }, // km
  coords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  isActive: { type: Boolean, default: true }
},
  { timestamps: true }
);

areaSchema.index({ name: 1 });
areaSchema.index({ city: 1 });

export default mongoose.model("Area", areaSchema); 