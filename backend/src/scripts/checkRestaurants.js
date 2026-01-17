import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Restaurant.countDocuments();
    const sample = await Restaurant.find().limit(5).select('name location cuisine rating').lean();
    console.log(`Restaurants in DB: ${count}`);
    console.log('Sample:', sample);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error checking restaurants:', err.message);
    process.exit(1);
  }
};

run();
