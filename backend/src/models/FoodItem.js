import mongoose from 'mongoose';

const foodItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  customImage: { type: String },
  description: { type: String },
  price: { type: Number, required: true, default: 250 }, // Default price since API doesn't provide menu prices
  category: { type: String, default: 'General' },
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
  spicyLevel: {
    type: Number,
    required: true,
    default: 0,
  },
  // ✅ Add these new fields
  ingredients: {
    type: [String],
    default: []
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  tagline: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  nutritionInfo: {
    type: String
  },
  spoonacularId: {
    type: String
  },
  isVeg: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
export default FoodItem;