import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Area from '../models/Area.js';

dotenv.config();

const seedAreas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing areas
    await Area.deleteMany({});
    console.log('🗑️  Cleared existing areas');

    // Create sample delivery areas with realistic data
    const areas = [
      {
        name: 'Jaipur Downtown',
        city: 'Jaipur',
        postalCodes: ['302001', '302002', '302003'],
        baseFee: 30,
        perKmFee: 6,
        estimatedDeliveryTimeMinutes: 35,
        estimatedDeliveryTime: '30-40 mins',
        serviceRadius: 8,
        coords: { lat: 26.9124, lng: 75.7873 },
        isActive: true
      },
      {
        name: 'Jaipur Suburbs',
        city: 'Jaipur',
        postalCodes: ['302004', '302005', '302006'],
        baseFee: 40,
        perKmFee: 7,
        estimatedDeliveryTimeMinutes: 45,
        estimatedDeliveryTime: '40-50 mins',
        serviceRadius: 12,
        coords: { lat: 26.8842, lng: 75.8218 },
        isActive: true
      },
      {
        name: 'Delhi Central',
        city: 'Delhi',
        postalCodes: ['110001', '110002', '110003'],
        baseFee: 35,
        perKmFee: 6.5,
        estimatedDeliveryTimeMinutes: 38,
        estimatedDeliveryTime: '35-45 mins',
        serviceRadius: 10,
        coords: { lat: 28.6139, lng: 77.2090 },
        isActive: true
      },
      {
        name: 'Delhi South',
        city: 'Delhi',
        postalCodes: ['110016', '110017', '110018'],
        baseFee: 45,
        perKmFee: 7,
        estimatedDeliveryTimeMinutes: 50,
        estimatedDeliveryTime: '45-55 mins',
        serviceRadius: 15,
        coords: { lat: 28.5244, lng: 77.1855 },
        isActive: true
      },
      {
        name: 'Mumbai Central',
        city: 'Mumbai',
        postalCodes: ['400001', '400002', '400003'],
        baseFee: 40,
        perKmFee: 8,
        estimatedDeliveryTimeMinutes: 40,
        estimatedDeliveryTime: '35-45 mins',
        serviceRadius: 8,
        coords: { lat: 19.0760, lng: 72.8777 },
        isActive: true
      },
      {
        name: 'Mumbai Suburbs',
        city: 'Mumbai',
        postalCodes: ['400101', '400102', '400103'],
        baseFee: 50,
        perKmFee: 8.5,
        estimatedDeliveryTimeMinutes: 55,
        estimatedDeliveryTime: '50-60 mins',
        serviceRadius: 20,
        coords: { lat: 19.0596, lng: 72.8295 },
        isActive: true
      },
      {
        name: 'Bangalore Downtown',
        city: 'Bangalore',
        postalCodes: ['560001', '560002', '560003'],
        baseFee: 35,
        perKmFee: 5.5,
        estimatedDeliveryTimeMinutes: 35,
        estimatedDeliveryTime: '30-40 mins',
        serviceRadius: 9,
        coords: { lat: 13.0827, lng: 80.2707 },
        isActive: true
      },
      {
        name: 'Bangalore East',
        city: 'Bangalore',
        postalCodes: ['560004', '560005', '560006'],
        baseFee: 40,
        perKmFee: 6,
        estimatedDeliveryTimeMinutes: 42,
        estimatedDeliveryTime: '38-48 mins',
        serviceRadius: 12,
        coords: { lat: 13.0345, lng: 80.3003 },
        isActive: true
      },
      {
        name: 'Pune Central',
        city: 'Pune',
        postalCodes: ['411001', '411002', '411003'],
        baseFee: 28,
        perKmFee: 5,
        estimatedDeliveryTimeMinutes: 32,
        estimatedDeliveryTime: '28-38 mins',
        serviceRadius: 8,
        coords: { lat: 18.5204, lng: 73.8567 },
        isActive: true
      },
      {
        name: 'Pune West',
        city: 'Pune',
        postalCodes: ['411004', '411005', '411006'],
        baseFee: 35,
        perKmFee: 5.5,
        estimatedDeliveryTimeMinutes: 40,
        estimatedDeliveryTime: '35-45 mins',
        serviceRadius: 10,
        coords: { lat: 18.4988, lng: 73.8156 },
        isActive: true
      }
    ];

    const createdAreas = await Area.insertMany(areas);
    console.log(`✅ Created ${createdAreas.length} delivery areas successfully!`);

    console.log('\n📋 Areas Created:');
    createdAreas.forEach((area, i) => {
      console.log(`${i + 1}. ${area.name} (${area.city}) - Base Fee: ₹${area.baseFee}, Per km: ₹${area.perKmFee}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Area seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding areas:', error.message);
    process.exit(1);
  }
};

seedAreas();
