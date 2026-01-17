import mongoose from "mongoose";

const guestReviewSchema = mongoose.Schema({
  foodId: { type: String, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, default: "Just Now" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GuestReview", guestReviewSchema);