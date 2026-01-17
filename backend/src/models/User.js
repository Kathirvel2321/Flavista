import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Made optional for Social Login
  provider: { type: String, default: "local" },
  profileImageUrl: { type: String, default: '' }, // Changed to empty string for better fallback
  createdAt: { type: Date, default: Date.now },

  preferences: {
    cuisine: { type: [String], default: [] },
    spicyLevel: { type: String, enum: ['Mild', 'Medium', 'Hot'], default: 'Medium' },
    vegonly: { type: Boolean, default: false },
  },
  saveFoodItems: { type: [mongoose.Schema.Types.ObjectId], ref: 'FoodItem', default: [] },
  resetPasswordToken: String,
  resetPasswordExpire: Date
},
{timestamps: true}

);
export default mongoose.model("User", userSchema);