import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FoodItem from '../models/FoodItem.js';
import GuestReview from '../models/GuestReview.js';

dotenv.config();

const reviewsPool = [
  { user: "Sarah Jenkins", rating: 5, comment: "Absolutely loved the flavors! Highly recommended." },
  { user: "Mike T.", rating: 4, comment: "Great taste, but delivery took a bit long." },
  { user: "Emily R.", rating: 5, comment: "Best I've had in a long time. Will order again!" },
  { user: "David K.", rating: 5, comment: "A culinary masterpiece. The presentation was also top-notch." },
  { user: "Jessica L.", rating: 4, comment: "Very tasty and fresh ingredients." },
  { user: "Chris P.", rating: 3, comment: "It was okay, a bit too spicy for me." },
  { user: "Amanda W.", rating: 5, comment: "My favorite dish from this place!" },
  { user: "Robert B.", rating: 4, comment: "Good portion size and value for money." },
  { user: "Jennifer M.", rating: 5, comment: "Simply delicious. Can't wait to have it again." },
  { user: "Daniel S.", rating: 4, comment: "Authentic taste, reminded me of home." },
  { user: "Alex G.", rating: 5, comment: "The texture was perfect. 10/10 would recommend." },
  { user: "Priya S.", rating: 5, comment: "Spicy and flavorful, just how I like it!" }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing reviews to avoid duplicates
    await GuestReview.deleteMany({});
    console.log('Cleared existing reviews');

    // Fetch all foods
    const foods = await FoodItem.find({});
    console.log(`Found ${foods.length} foods`);

    if (foods.length === 0) {
      console.log('No foods found. Please seed foods first.');
      process.exit();
    }

    const reviewsToInsert = [];

    for (const food of foods) {
      // Determine if food is "trending" (using rating or isTrending flag if available)
      // If isTrending is not in schema, we assume high rated items are trending
      const isTrending = food.isTrending || food.rating >= 4.6;
      
      // Trending foods get 3-6 reviews, others get 0-2
      const numReviews = isTrending 
        ? Math.floor(Math.random() * 2) + 2 // 3 to 6
        : Math.floor(Math.random() * 3);    // 0 to 2

      for (let i = 0; i < numReviews; i++) {
        const randomReview = reviewsPool[Math.floor(Math.random() * reviewsPool.length)];
        
        // Add some randomness to dates
        const timeAgo = ["Just Now", "2 mins ago", "1 hour ago", "Yesterday", "2 days ago", "Last Week"];
        const randomDate = timeAgo[Math.floor(Math.random() * timeAgo.length)];

        reviewsToInsert.push({
          foodId: food._id, // Link review to the food's Database ID
          user: randomReview.user,
          rating: isTrending ? 5 : randomReview.rating, // Bias trending foods towards 5 stars
          comment: randomReview.comment,
          date: randomDate
        });
      }
    }

    if (reviewsToInsert.length > 0) {
      await GuestReview.insertMany(reviewsToInsert);
      console.log(`✅ Successfully inserted ${reviewsToInsert.length} reviews.`);
    } else {
      console.log('No reviews generated.');
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();
