import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import Area from '../models/Area.js';

dotenv.config();

const seedRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get some foods from database
    const foods = await Food.find().limit(20);
    console.log(`Found ${foods.length} foods in database`);

    if (foods.length === 0) {
      console.log('No foods found. Run food import first: node src/scripts/fetchFoods.js');
      await mongoose.disconnect();
      return;
    }

    // Get areas from database
    const areas = await Area.find();
    if (areas.length === 0) {
      console.log('⚠️  No areas found. Run area seeding first: node src/scripts/seedAreas.js');
      await mongoose.disconnect();
      return;
    }

    // Map areas by name
    const areaMap = {};
    areas.forEach(area => {
      areaMap[area.name] = area._id;
    });

    console.log(`Found ${areas.length} delivery areas`);

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    // Create restaurants with coordinates and area references
    const restaurants = [
      {
        name: "Flavista Gourmet",
        image: "/restaurantimage/rest1.webp",
        rating: 4.9,
        cuisine: "Continental",
        location: "Downtown, Jaipur",
        deliveryAreas: areas.slice(0, 2).map(a => a._id),
        menu: foods.slice(0, 8).map(f => f._id),
        coords: { lat: 26.9124, lng: 75.7873 },
        isOpen: true,
        offer: "Flat 20% OFF",
        time: "30-45 min"
      },
      {
        name: "Urban Cravings",
        image: "/restaurantimage/rest2.webp",
        rating: 4.7,
        cuisine: "Indian",
        location: "Suburbs, Jaipur",
        deliveryAreas: areas.slice(1, 3).map(a => a._id),
        menu: foods.slice(5, 12).map(f => f._id),
        coords: { lat: 26.8842, lng: 75.8218 },
        isOpen: true,
        offer: "Free Mocktail",
        time: "25-40 min"
      },
      {
        name: "The Cloud Kitchen",
        image: "/restaurantimage/rest3.webp",
        rating: 4.6,
        cuisine: "Chinese",
        location: "Tech Park, Bangalore",
        deliveryAreas: areas.slice(2, 4).map(a => a._id),
        menu: foods.slice(10, 18).map(f => f._id),
        coords: { lat: 12.9716, lng: 77.5946 },
        isOpen: true,
        offer: "15% OFF",
        time: "20-35 min"
      },
      {
        name: "Midnight Munchies",
        image: "/restaurantimage/rest1.webp",
        rating: 4.8,
        cuisine: "Snacks",
        location: "Koramangala, Bangalore",
        deliveryAreas: areas.slice(0, 3).map(a => a._id),
        menu: foods.slice(2, 10).map(f => f._id),
        coords: { lat: 12.9352, lng: 77.6245 },
        isOpen: true,
        offer: "Free Delivery",
        time: "40-50 min"
      },
      {
        name: "Spicy Wok",
        image: "/restaurantimage/rest2.webp",
        rating: 4.3,
        cuisine: "Asian",
        location: "Indiranagar, Bangalore",
        deliveryAreas: areas.slice(1, 4).map(a => a._id),
        menu: foods.slice(8, 15).map(f => f._id),
        coords: { lat: 12.9784, lng: 77.6408 },
        isOpen: true,
        offer: "Combo @ 199",
        time: "15-25 min"
      },
      {
        name: "Cheesy Crust",
        image: "/restaurantimage/rest3.webp",
        rating: 4.5,
        cuisine: "Italian",
        location: "Whitefield, Bangalore",
        deliveryAreas: areas.slice(0, 2).map(a => a._id),
        menu: foods.slice(12, 20).map(f => f._id),
        coords: { lat: 12.9698, lng: 77.7500 },
        isOpen: true,
        offer: "BOGO Pizza",
        time: "30-40 min"
      }
    ];

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Created ${createdRestaurants.length} restaurants successfully!`);

    // Show summary
    console.log('\n📋 Restaurants Created:');
    createdRestaurants.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (${r.location}) - ${r.menu.length} foods`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding complete!');
  } catch (error) {
    console.error('Error seeding restaurants:', error.message);
    process.exit(1);
  }
};

seedRestaurants();
