import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Seed categories with default data
// @route   POST /api/categories/seed
// @access  Public
const seedCategories = asyncHandler(async (req, res) => {
  await Category.deleteMany({}); // Clear existing

  const categories = [
    { name: "Chinese", displayName: "Chinese", image: "/foodimage/chinese.webp" },
    { name: "Indian", displayName: "South Indian", image: "/foodimage/south.webp" },
    { name: "Italian", displayName: "Italian", image: "/foodimage/italian.webp" },
    { name: "American", displayName: "Street Food", image: "/foodimage/tacco.webp" },
    { name: "Arabian", displayName: "Arabian", image: "/foodimage/wrap.webp" },
    { name: "Dessert", displayName: "Desserts", image: "/foodimage/desert.webp" }
  ];

  const createdCategories = await Category.insertMany(categories);
  res.status(201).json(createdCategories);
});

export { getCategories, seedCategories };