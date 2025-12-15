import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  spoonacularId: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, default: 0 },
  description: { type: String },
  category: { type: String },
  nutritionInfo: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  cuisine: { type: String },
  ingredients: { type: [String], default: [] },
  spicyLevel: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5]
  },

  isVeg: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true }
);
export default mongoose.model("Food", foodSchema);