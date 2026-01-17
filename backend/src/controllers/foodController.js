import asyncHandler from 'express-async-handler';
import FoodItem from '../models/FoodItem.js';
import mongoose from 'mongoose';

// @desc    Search for food (DB -> Spoonacular -> DB)
// @route   GET /api/foods/search?query=pizza
// @access  Public
const searchFood = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Query parameter is required');
  }

  const trimmedQuery = query.trim();
  // Escape special characters for regex to prevent crashes and ensure literal matching
  const safeQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 1. Check Database (Case-insensitive regex match)
  // We look for an exact name match or close to it to avoid duplicates
  const dbFood = await FoodItem.findOne({ 
    name: { $regex: new RegExp(`^${safeQuery}$`, 'i') } 
  });

  if (dbFood) {
    // console.log('Serving from Database');
    return res.json(dbFood);
  }

  // 2. Fetch from Spoonacular API
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    res.status(500);
    throw new Error('Spoonacular API Key is missing in .env');
  }

  // console.log('Fetching from Spoonacular...');
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${trimmedQuery}&number=1&addRecipeInformation=true&apiKey=${apiKey}`
  );

  if (!response.ok) {
    res.status(response.status);
    throw new Error('Failed to fetch from Spoonacular API');
  }

  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const item = data.results[0];
    
    // Create new FoodItem from API data
    const newFood = new FoodItem({
      name: item.title,
      image: item.image,
      description: item.summary ? item.summary.replace(/<[^>]*>?/gm, '').slice(0, 300) + '...' : 'Delicious food item.', // Strip HTML tags
      price: Math.floor(Math.random() * (400 - 150 + 1) + 150), // Generate a realistic random price
      category: item.dishTypes && item.dishTypes.length > 0 ? item.dishTypes[0] : 'Main Course',
      spoonacularId: item.id.toString()
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Get search suggestions
// @route   GET /api/foods/suggestions?query=piz
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json([]);
  }

  const trimmedQuery = query.trim();
  const safeQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 1. Local DB matches (limit 5)
  const dbItems = await FoodItem.find({ 
    name: { $regex: new RegExp(safeQuery, 'i') } 
  }).limit(5).select('name');
  
  let suggestions = dbItems.map(item => item.name);

  // 2. Spoonacular Autocomplete (if API key exists)
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/autocomplete?query=${trimmedQuery}&number=5&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const apiSuggestions = data.map(item => item.title);
        // Merge and remove duplicates
        suggestions = [...new Set([...suggestions, ...apiSuggestions])];
      }
    } catch (error) {
      console.error('Spoonacular Autocomplete Error:', error);
    }
  }

  res.json(suggestions.slice(0, 8)); // Return top 8 suggestions
});

// @desc    Get trending foods
// @route   GET /api/foods/trending
// @access  Public
const getTrendingFoods = asyncHandler(async (req, res) => {
  const foods = await FoodItem.find({ isTrending: true });
  if (foods.length > 0) {
    res.json(foods);
  } else {
    // Fallback to top rated if no trending items marked
    const topRated = await FoodItem.find({}).sort({ rating: -1 }).limit(8);
    res.json(topRated);
  }
});

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Handle route conflict if 'trending' is captured as ID
  if (id === 'trending') {
    return getTrendingFoods(req, res, next);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Food not found');
  }

  const food = await FoodItem.findById(id);
  if (food) {
    res.json(food);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Get foods by category
// @route   GET /api/foods/category/:category
// @access  Public
const getFoodsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  // Case insensitive match for category
  const foods = await FoodItem.find({ 
    category: { $regex: new RegExp(`^${category}$`, 'i') } 
  });
  res.json(foods);
});

// @desc    Seed database with 30 best dishes (6 per category)
// @route   POST /api/foods/seed
// @access  Public
const seedDatabase = asyncHandler(async (req, res) => {
  await FoodItem.deleteMany({}); // Clear existing data to ensure a fresh seed

  const seedData = [
    // Italian
    { name: "Margherita Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", description: "Classic delight with 100% real mozzarella cheese and fresh basil.", price: 250, category: "Italian", rating: 4.5, spicyLevel: 1 },
    { name: "Pasta Carbonara", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3", description: "Creamy sauce with bacon, egg, and parmesan cheese.", price: 320, category: "Italian", rating: 4.7, spicyLevel: 1 },
    { name: "Lasagna", image: "https://images.unsplash.com/photo-1574868291534-18430db33f92", description: "Layers of pasta, rich meat sauce, and melted cheese.", price: 350, category: "Italian", rating: 4.8, spicyLevel: 2 },
    { name: "Mushroom Risotto", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371", description: "Creamy rice dish cooked with wild mushrooms and herbs.", price: 300, category: "Italian", rating: 4.4, spicyLevel: 1 },
    { name: "Bruschetta", image: "https://images.unsplash.com/photo-1572695157369-a0eac271ad61", description: "Grilled bread topped with fresh tomatoes, garlic, and basil.", price: 180, category: "Italian", rating: 4.3, spicyLevel: 1 },
    { name: "Fettuccine Alfredo", image: "https://images.unsplash.com/photo-1645112411341-6c4fd0237b69", description: "Rich creamy parmesan sauce served over fettuccine pasta.", price: 290, category: "Italian", rating: 4.6, spicyLevel: 1 },

    // Indian
    { name: "Butter Chicken", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398", description: "Tender chicken cooked in a rich tomato and butter gravy.", price: 380, category: "Indian", rating: 4.9, spicyLevel: 2 },
    { name: "Paneer Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0", description: "Spiced grilled cottage cheese cubes with veggies.", price: 280, category: "Indian", rating: 4.7, spicyLevel: 3 },
    { name: "Chicken Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0", description: "Aromatic basmati rice cooked with exotic spices and chicken.", price: 350, category: "Indian", rating: 4.8, spicyLevel: 3 },
    { name: "Masala Dosa", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc", description: "Crispy rice crepe filled with spiced potato masala.", price: 150, category: "Indian", rating: 4.6, spicyLevel: 2 },
    { name: "Rogan Josh", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641", description: "Aromatic lamb curry from Kashmir with traditional spices.", price: 420, category: "Indian", rating: 4.7, spicyLevel: 3 },
    { name: "Dal Makhani", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d", description: "Creamy black lentils cooked overnight with butter and cream.", price: 220, category: "Indian", rating: 4.5, spicyLevel: 1 },

    // Chinese
    { name: "Kung Pao Chicken", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e", description: "Spicy stir-fry dish made with chicken, peanuts, and vegetables.", price: 320, category: "Chinese", rating: 4.6, spicyLevel: 3 },
    { name: "Dim Sum Platter", image: "https://images.unsplash.com/photo-1563245372-f21720e32c4d", description: "Assorted steamed dumplings with various fillings.", price: 350, category: "Chinese", rating: 4.7, spicyLevel: 1 },
    { name: "Hakka Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246", description: "Stir-fried noodles with crunchy vegetables and soy sauce.", price: 200, category: "Chinese", rating: 4.4, spicyLevel: 2 },
    { name: "Spring Rolls", image: "https://images.unsplash.com/photo-1544025162-d76690b67f61", description: "Crispy golden rolls filled with shredded vegetables.", price: 180, category: "Chinese", rating: 4.5, spicyLevel: 1 },
    { name: "Schezwan Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb74b", description: "Spicy fried rice tossed with schezwan sauce and veggies.", price: 240, category: "Chinese", rating: 4.6, spicyLevel: 3 },
    { name: "Manchurian", image: "https://images.unsplash.com/photo-1567510615292-477a31467d6b", description: "Vegetable balls tossed in a spicy, sweet and tangy sauce.", price: 220, category: "Chinese", rating: 4.5, spicyLevel: 2 },

    // American
    { name: "Classic Cheeseburger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", description: "Juicy beef patty topped with cheddar, lettuce, and tomato.", price: 280, category: "American", rating: 4.7, spicyLevel: 1 },
    { name: "BBQ Ribs", image: "https://images.unsplash.com/photo-1544025162-d76690b67f61", description: "Tender pork ribs glazed with smoky BBQ sauce.", price: 450, category: "American", rating: 4.8, spicyLevel: 2 },
    { name: "Mac and Cheese", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6", description: "Classic comfort food with rich cheesy pasta.", price: 250, category: "American", rating: 4.5, spicyLevel: 0 },
    { name: "Hot Dog", image: "https://images.unsplash.com/photo-1612392062631-94dd858cba88", description: "Grilled sausage in a bun with mustard and ketchup.", price: 150, category: "American", rating: 4.2, spicyLevel: 1 },
    { name: "Buffalo Wings", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f", description: "Spicy chicken wings served with ranch dip.", price: 300, category: "American", rating: 4.6, spicyLevel: 3 },
    { name: "Grilled Sandwich", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af", description: "Perfectly toasted bread with melted cheese and fillings.", price: 180, category: "American", rating: 4.3, spicyLevel: 1 },

    // Dessert
    { name: "Chocolate Lava Cake", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", description: "Warm chocolate cake with a molten gooey center.", price: 220, category: "Dessert", rating: 4.9, spicyLevel: 0 },
    { name: "New York Cheesecake", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50", description: "Classic creamy cheesecake with a graham cracker crust.", price: 250, category: "Dessert", rating: 4.8, spicyLevel: 0 },
    { name: "Ice Cream Sundae", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb", description: "Scoops of vanilla ice cream topped with syrup and nuts.", price: 180, category: "Dessert", rating: 4.6, spicyLevel: 0 },
    { name: "Brownie with Ice Cream", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e", description: "Fudgy chocolate brownie served with vanilla ice cream.", price: 200, category: "Dessert", rating: 4.7, spicyLevel: 0 },
    { name: "Fruit Tart", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13", description: "Crispy pastry shell filled with custard and fresh fruits.", price: 220, category: "Dessert", rating: 4.5, spicyLevel: 0 },
    { name: "Waffles", image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Crispy golden waffles served with maple syrup and berries.", price: 190, category: "Dessert", rating: 4.6, spicyLevel: 0 },

    // Arabian
    { name: "Chicken Shawarma", image: "https://images.unsplash.com/photo-1633321769045-20971dc9f3b6", description: "Marinated chicken roasted slowly and wrapped in pita bread with garlic sauce and pickles.", price: 180, category: "Arabian", rating: 4.7, spicyLevel: 2 },
    { name: "Falafel Wrap", image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7", description: "Crispy fried balls of ground chickpeas served in a wrap with tahini and fresh veggies.", price: 150, category: "Arabian", rating: 4.5, spicyLevel: 1 },
    { name: "Mutton Mandi", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0", description: "Traditional Yemeni dish consisting of tender meat and rice cooked with a special blend of spices in a tandoor.", price: 450, category: "Arabian", rating: 4.8, spicyLevel: 2 },
    { name: "Hummus with Pita", image: "https://images.unsplash.com/photo-1577906096429-f736f9f3b212", description: "Creamy dip made from chickpeas, tahini, lemon, and garlic, served with warm pita bread.", price: 160, category: "Arabian", rating: 4.6, spicyLevel: 0 },
    { name: "Shish Tawook", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", description: "Skewered chicken cubes marinated in yogurt, lemon, and garlic, grilled to perfection.", price: 320, category: "Arabian", rating: 4.7, spicyLevel: 2 },
    { name: "Kunafa", image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7", description: "Sweet Middle Eastern pastry made with spun pastry soaked in syrup and layered with cheese or cream.", price: 250, category: "Arabian", rating: 4.9, spicyLevel: 0 }
  ];

  await FoodItem.insertMany(seedData);
  res.status(201).json({ message: 'Database seeded successfully', count: seedData.length });
});

export { searchFood, getSearchSuggestions, getTrendingFoods, getFoodById, getFoodsByCategory, seedDatabase };