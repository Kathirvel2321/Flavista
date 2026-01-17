import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Internal ID (e.g., "Indian")
  displayName: { type: String, required: true },        // Display Text (e.g., "South Indian")
  image: { type: String, required: true }               // Image URL/Path
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;