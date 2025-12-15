import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImageUrl: { type: String, default: '/default-avatar.png' }, // Add this
  createdAt: { type: Date, default: Date.now },

  preferences: {
    cuisine: { type: [String], default: [] },
    spicyLevel: { type: String, enum: ['Mild', 'Medium', 'Hot'], default: 'Medium' },
    vegonly: { type: Boolean, default: false },
  },
  saveFoodItems: { type: [mongoose.Schema.Types.ObjectId], ref: 'FoodItem', default: [] },
},
{timestamps: true}

);
export default mongoose.model("User", userSchema);