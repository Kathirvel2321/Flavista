import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './src/routes/authRoutes.js';
import foodRoutes from './src/routes/foodRoutes.js';
import restaurantsRoutes from './src/routes/restaurantsRoutes.js';
import deliveryRoutes from './src/routes/deliveryRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json("Flavista Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on", process.env.PORT || 5000)
    );
  })
  .catch((err) => console.log(err));