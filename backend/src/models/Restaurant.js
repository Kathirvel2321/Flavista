import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  imaage : { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },

  deliveryZones: { type: [String], default: [] },
  deliveryAreas: { type: [mongoose.Schema.Types.ObjectId], ref: 'Area', default: [] },
  menu: { type: [mongoose.Schema.Types.ObjectId], ref: 'Food', default: [] },
  description : { type: String },
  coords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  isOpen: { type: Boolean, default: true }
},
  { timestamps: true }
);

restaurantSchema.index({ deliveryAreas: 1 });
restaurantSchema.index({ name: 1 });

export default mongoose.model("Restaurant", restaurantSchema);