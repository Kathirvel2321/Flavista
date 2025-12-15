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
        name: 'South Indian Paradise',
        address: '123 Raja Street, Jaipur',
        city: 'Jaipur',
        location: '123 Raja Street, Jaipur, Rajasthan',
        cuisine: 'South Indian',
        rating: 4.5,
        imaage: 'https://via.placeholder.com/300?text=South+Indian+Paradise',
        image: 'https://via.placeholder.com/300?text=South+Indian+Paradise',
        menu: foods.slice(0, 3).map(f => f._id),
        deliveryZones: ['Jaipur Downtown', 'Jaipur Suburbs'],
        deliveryAreas: [areaMap['Jaipur Downtown'], areaMap['Jaipur Suburbs']].filter(Boolean),
        coords: { lat: 26.9124, lng: 75.7873 },
        isOpen: true
      },
      {
        name: 'North Indian Kitchen',
        address: '456 Ashok Road, Delhi',
        city: 'Delhi',
        location: '456 Ashok Road, Delhi',
        cuisine: 'North Indian',
        rating: 4.2,
        imaage: 'https://via.placeholder.com/300?text=North+Indian+Kitchen',
        image: 'https://via.placeholder.com/300?text=North+Indian+Kitchen',
        menu: foods.slice(3, 6).map(f => f._id),
        deliveryZones: ['Delhi Central', 'Delhi South'],
        deliveryAreas: [areaMap['Delhi Central'], areaMap['Delhi South']].filter(Boolean),
        coords: { lat: 28.6139, lng: 77.2090 },
        isOpen: true
      },
      {
        name: 'Italian Trattoria',
        address: '789 Market Street, Mumbai',
        city: 'Mumbai',
        location: '789 Market Street, Mumbai',
        cuisine: 'Italian',
        rating: 4.7,
        imaage: 'https://via.placeholder.com/300?text=Italian+Trattoria',
        image: 'https://via.placeholder.com/300?text=Italian+Trattoria',
        menu: foods.slice(6, 9).map(f => f._id),
        deliveryZones: ['Mumbai Central', 'Mumbai Suburbs'],
        deliveryAreas: [areaMap['Mumbai Central'], areaMap['Mumbai Suburbs']].filter(Boolean),
        coords: { lat: 19.0760, lng: 72.8777 },
        isOpen: true
      },
      {
        name: 'Chinese Express',
        address: '321 Food Street, Bangalore',
        city: 'Bangalore',
        location: '321 Food Street, Bangalore',
        cuisine: 'Chinese',
        rating: 4.0,
        imaage: 'https://via.placeholder.com/300?text=Chinese+Express',
        image: 'https://via.placeholder.com/300?text=Chinese+Express',
        menu: foods.slice(9, 12).map(f => f._id),
        deliveryZones: ['Bangalore Downtown', 'Bangalore East'],
        deliveryAreas: [areaMap['Bangalore Downtown'], areaMap['Bangalore East']].filter(Boolean),
        coords: { lat: 13.0827, lng: 80.2707 },
        isOpen: true
      },
      {
        name: 'Fast Food Hub',
        address: '654 Main Street, Pune',
        city: 'Pune',
        location: '654 Main Street, Pune',
        cuisine: 'Fast Food',
        rating: 3.8,
        imaage: 'https://via.placeholder.com/300?text=Fast+Food+Hub',
        image: 'https://via.placeholder.com/300?text=Fast+Food+Hub',
        menu: foods.slice(12, 15).map(f => f._id),
        deliveryZones: ['Pune Central', 'Pune West'],
        deliveryAreas: [areaMap['Pune Central'], areaMap['Pune West']].filter(Boolean),
        coords: { lat: 18.5204, lng: 73.8567 },
        isOpen: true
      }
    ];

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Created ${createdRestaurants.length} restaurants successfully!`);

    // Show summary
    console.log('\n📋 Restaurants Created:');
    createdRestaurants.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (${r.city}) - ${r.menu.length} foods`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding complete!');
  } catch (error) {
    console.error('Error seeding restaurants:', error.message);
    process.exit(1);
  }
};

seedRestaurants();
