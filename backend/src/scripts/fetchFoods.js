import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';

dotenv.config();

const SP_API_KEY = process.env.SPOONACULAR_API_KEY;
const SP_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const fetchFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const response = await axios.get(SP_API_URL, {
      params: {
        apiKey: SP_API_KEY,
        number: 10,
        addRecipeInformation: true
      }
    });

    const foods = response.data.results || response.data.recipes || [];

    for (const item of foods) {
      const exists = await Food.findOne({ spoonacularId: item.id });
      if (exists) continue;

      const description = (item.summary || item.instructions || '').replace(/<[^>]+>/g, '');
      const ingredients = Array.isArray(item.extendedIngredients) ? item.extendedIngredients.map(i => i.name) : [];

      const newFood = new Food({
        spoonacularId: item.id,
        name: item.title,
        image: item.image,
        price: Math.floor(Math.random() * 200) + 50,
        description,
        cuisine: (item.cuisines && item.cuisines[0]) || 'Unknown',
        ingredients,
        spicyLevel: Math.floor(Math.random() * 5) + 1,
        isVeg: !!item.vegetarian,
        tags: item.dishTypes || []
      });

      await newFood.save();
    }

    console.log('Foods fetched and saved successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error fetching or saving foods:', error.message);
    if (error.response) console.error('API response:', error.response.status, error.response.data);
    else console.error(error);
  }
};

fetchFoods();