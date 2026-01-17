# Flavista Backend API Documentation

## Overview
Flavista is a full-featured food delivery platform with restaurants, delivery areas, cart management, and order tracking.

## Quick Start

### 1. Setup
```bash
npm install
# Create .env file with:
# - MONGO_URI
# - JWT_SECRET
# - SPOONACULAR_API_KEY
# - PORT=5000
```

### 2. Seed Database
```bash
# Seed areas (delivery zones)
node src/scripts/seedAreas.js

# Seed foods (from Spoonacular API)
node src/scripts/fetchFoods.js

# Seed restaurants
node src/scripts/seedRestaurants.js

# Check restaurants were created
node src/scripts/checkRestaurants.js
```

### 3. Start Server
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Authentication (`/api/auth`)
- **POST** `/register` - Register new user
  - Body: `{ username, email, password }`
  - Response: User object with JWT token

- **POST** `/login` - Login user
  - Body: `{ email, password }`
  - Response: JWT token

- **GET** `/profile` - Get logged-in user profile (Protected)
  - Header: `Authorization: Bearer <token>`
  - Response: User details, preferences, saved foods

### Foods (`/api/foods`)
- **GET** `/` - List all foods (with pagination)
  - Query: `?page=1&limit=10`
  - Response: Array of foods

- **GET** `/search` - Search foods by name/cuisine
  - Query: `?q=biryani&cuisine=Indian&area=Jaipur%20Downtown`
  - Response: Matching foods

- **GET** `/:id` - Get food details
  - Response: Food object with ingredients, nutrition, ratings

- **POST** `/` - Create food (Protected, Admin only)
  - Body: Food object
  - Response: Created food

### Restaurants (`/api/restaurants`)
- **GET** `/` - List all restaurants
  - Query: `?area=Jaipur%20Downtown` (optional)
  - Response: Array of restaurants with delivery info

- **GET** `/:id` - Get restaurant details
  - Response: Restaurant object with menu

- **GET** `/area/:areaName` - Restaurants delivering to area
  - Response: Restaurants in that area

### Delivery Areas (`/api/delivery`)
- **POST** `/check` - Check delivery availability
  - Body: `{ areaName: "Jaipur Downtown", lat: 26.9124, lng: 75.7873 }`
  - Response: Available restaurants with fees and ETA
  ```json
  {
    "success": true,
    "area": { "name": "Jaipur Downtown", "baseFee": 30, "perKmFee": 6 },
    "restaurants": [
      {
        "name": "South Indian Paradise",
        "deliveryFee": 36,
        "estimatedDeliveryTime": 35,
        "distanceKm": 2.3
      }
    ]
  }
  ```

- **GET** `/areas` - List all delivery areas
  - Response: Array of areas with base fees and ETA

- **GET** `/areas/:id` - Get area details
  - Response: Area object with restaurants serving it

- **GET** `/area/:name` - Get area by name
  - Response: Area object

### Cart (`/api/cart`) - Protected
- **POST** `/` - Add item to cart
  - Body: `{ foodId, quantity, restaurantId, areaId }`
  - Response: Updated cart

- **GET** `/` - Get user's cart
  - Response: Cart with items, subtotal, delivery fee, total

- **PUT** `/item` - Update item quantity
  - Body: `{ foodId, quantity }`
  - Response: Updated cart

- **DELETE** `/item/:foodId` - Remove item from cart
  - Response: Updated cart

- **DELETE** `/` - Clear entire cart
  - Response: Success message

### Orders (`/api/orders`) - Protected
- **POST** `/` - Create order from cart
  - Body: 
  ```json
  {
    "deliveryAddress": "123 Main Street, Jaipur",
    "deliveryLat": 26.9124,
    "deliveryLng": 75.7873,
    "paymentMethod": "cash|card|wallet",
    "specialInstructions": "No onions"
  }
  ```
  - Response: Created order with ID, total, ETA

- **GET** `/` - Get user's orders
  - Query: `?status=pending|confirmed|preparing|on-the-way|delivered|cancelled`
  - Response: Array of orders

- **GET** `/:orderId` - Get order details
  - Response: Order object with items, delivery info, status

- **PUT** `/:orderId/cancel` - Cancel order
  - Response: Cancelled order

---

## Database Models

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  preferences: { cuisine, spicyLevel, vegOnly },
  savedFoods: [ObjectId -> Food],
  orderHistory: [ObjectId -> Order],
  createdAt, updatedAt
}
```

### Food
```javascript
{
  name: String,
  description: String,
  price: Number,
  cuisine: String,
  category: String,
  image: String,
  ingredients: [String],
  nutritionInfo: Object,
  rating: Number (0-5),
  spicyLevel: String (Mild|Medium|Hot),
  isVeg: Boolean,
  spoonacularId: Number (external API ID)
}
```

### Restaurant
```javascript
{
  name: String,
  location: String,
  rating: Number (0-5),
  imaage: String,
  menu: [ObjectId -> Food],
  deliveryZones: [String],
  deliveryAreas: [ObjectId -> Area],
  coords: { lat, lng },
  isOpen: Boolean
}
```

### Area (Delivery Zone)
```javascript
{
  name: String (unique),
  city: String,
  postalCodes: [String],
  baseFee: Number (₹),
  perKmFee: Number (₹/km),
  estimatedDeliveryTimeMinutes: Number,
  serviceRadius: Number (km),
  coords: { lat, lng },
  isActive: Boolean
}
```

### Order
```javascript
{
  userId: ObjectId,
  restaurantId: ObjectId,
  areaId: ObjectId,
  items: [{ foodId, quantity, price }],
  subtotal, deliveryFee, tax, total: Number,
  deliveryAddress: String,
  deliveryCoords: { lat, lng },
  estimatedDeliveryTime: Number (minutes),
  status: String (pending|confirmed|preparing|on-the-way|delivered|cancelled),
  paymentMethod: String (cash|card|wallet),
  createdAt, updatedAt
}
```

### Cart
```javascript
{
  userId: ObjectId (unique),
  restaurantId: ObjectId,
  areaId: ObjectId,
  items: [{ foodId, quantity, price }],
  subtotal, deliveryFee, tax, total: Number
}
```

---

## Delivery Fee Calculation

Fee = baseFee + (ceil(distanceKm) × perKmFee)

**Example:**
- Base Fee: ₹30
- Per KM Fee: ₹6
- Distance: 2.3 km
- Total Fee: ₹30 + (3 × ₹6) = ₹48

ETA = baseETA + (distanceKm × 1.5 minutes/km)

---

## Example Workflows

### 1. Browse & Search Foods by Area
```bash
# 1. Get all areas
curl http://localhost:5000/api/delivery/areas

# 2. Check delivery to area
curl -X POST http://localhost:5000/api/delivery/check \
  -H "Content-Type: application/json" \
  -d '{"areaName": "Jaipur Downtown", "lat": 26.9124, "lng": 75.7873}'

# 3. Search foods in that area
curl "http://localhost:5000/api/foods/search?q=biryani&area=Jaipur%20Downtown"
```

### 2. Add to Cart & Checkout
```bash
# 1. Add food to cart (requires auth token)
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "...", 
    "quantity": 2, 
    "restaurantId": "...", 
    "areaId": "..."
  }'

# 2. Get cart
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"

# 3. Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddress": "123 Main St",
    "deliveryLat": 26.9124,
    "deliveryLng": 75.7873,
    "paymentMethod": "cash"
  }'
```

### 3. Track Order
```bash
# Get all orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>"

# Get specific order
curl http://localhost:5000/api/orders/<orderId> \
  -H "Authorization: Bearer <token>"
```

---

## Utility Functions (src/utils/delivery.js)

- `haversineDistance(point1, point2)` - Calculate distance between coordinates
- `calculateDeliveryFee(area, restaurant, distanceKm)` - Compute fee with breakdown
- `calculateEstimatedTime(area, distanceKm)` - Estimate delivery time in minutes
- `isWithinServiceRadius(userCoords, area)` - Check if delivery is possible

---

## Environment Variables (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
SPOONACULAR_API_KEY=your-api-key
PORT=5000
```

---

## Performance Optimizations
- Indexes on: `Area.name`, `Restaurant.deliveryAreas`, `Order.userId`, `Cart.userId`
- Lean queries for read-only operations
- Population only when needed

---

## Future Enhancements
- Real-time order tracking with WebSockets
- AI recommendation engine
- Payment gateway integration (Stripe, Razorpay)
- Admin dashboard for managing restaurants/areas/orders
- Push notifications for order updates
- Rating and review system
- Loyalty points/rewards program
- Advanced search filters (ratings, delivery time, price range)

---

## Support & Testing
Use Postman or Thunder Client with the endpoints above. All protected routes require JWT token in header: `Authorization: Bearer <token>`
