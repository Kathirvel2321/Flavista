import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import './src/config/passport.js';

import authRoutes from './src/routes/authRoutes.js';
import foodRoutes from './src/routes/foodRoutes.js';
import restaurantsRoutes from './src/routes/restaurantsRoutes.js';
import deliveryRoutes from './src/routes/deliveryRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import reviewRoutes from './src/routes/ReviewRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

dotenv.config();
// Trust the proxy to ensure Google Auth callback uses HTTPS
app.enable('trust proxy');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.json("Flavista Backend Running");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on", process.env.PORT || 5000)
    );
  })
  .catch((err) => console.log(err));