# Flavista API - Complete Workflow Examples

## Quick Reference
- Base URL: `http://localhost:5000/api`
- Port: 5000
- Auth: JWT Bearer token in header `Authorization: Bearer <token>`

---

## 1️⃣ Authentication

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "preferences": { ... }
  }
}
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User Profile (Protected)
```bash
TOKEN="your_jwt_token_here"

curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 2️⃣ Browse Delivery Areas

### Get All Delivery Areas
```bash
curl http://localhost:5000/api/delivery/areas
```
**Response:**
```json
{
  "success": true,
  "count": 10,
  "areas": [
    {
      "_id": "...",
      "name": "Jaipur Downtown",
      "city": "Jaipur",
      "baseFee": 30,
      "perKmFee": 6,
      "estimatedDeliveryTimeMinutes": 35,
      "serviceRadius": 8
    },
    ...
  ]
}
```

### Get Area by Name
```bash
curl http://localhost:5000/api/delivery/area/Jaipur%20Downtown
```

---

## 3️⃣ Search Foods by Area

### Get All Foods (No Filter)
```bash
curl "http://localhost:5000/api/foods?page=1&limit=10"
```

### Get Foods for Specific Area
```bash
curl "http://localhost:5000/api/foods?area=Jaipur%20Downtown&page=1&limit=20"
```

### Search Foods with Multiple Filters
```bash
# Search for "biryani" in "Jaipur Downtown" within price range ₹200-500
curl "http://localhost:5000/api/foods/search?q=biryani&area=Jaipur%20Downtown&priceMin=200&priceMax=500"
```

### Search by Cuisine
```bash
curl "http://localhost:5000/api/foods/search?cuisine=Indian&area=Jaipur%20Downtown"
```

**Response:**
```json
{
  "success": true,
  "search": "biryani",
  "area": "Jaipur Downtown",
  "count": 5,
  "total": 5,
  "page": 1,
  "pages": 1,
  "foods": [
    {
      "_id": "...",
      "name": "Mutton Biryani",
      "price": 350,
      "cuisine": "Indian",
      "rating": 4.5,
      "isVeg": false,
      "spicyLevel": "Hot"
    },
    ...
  ]
}
```

---

## 4️⃣ Browse Restaurants

### Get All Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Get Restaurants in Specific Area (With Delivery Fees)
```bash
# Without user location (flat fee)
curl "http://localhost:5000/api/restaurants?area=Jaipur%20Downtown"

# With user location (distance-based fee)
curl "http://localhost:5000/api/restaurants?area=Jaipur%20Downtown&lat=26.9124&lng=75.7873"
```

**Response:**
```json
{
  "success": true,
  "area": "Jaipur Downtown",
  "count": 2,
  "restaurants": [
    {
      "_id": "...",
      "name": "South Indian Paradise",
      "location": "123 Raja Street, Jaipur",
      "rating": 4.5,
      "menu": [ {...}, {...} ],
      "deliveryFee": 36,
      "deliveryFeeBreakdown": {
        "baseFee": 30,
        "distanceFee": 6,
        "distanceKm": 2
      },
      "estimatedDeliveryTime": 37,
      "distanceKm": 2.3
    },
    ...
  ]
}
```

### Get Specific Restaurant Details
```bash
RESTAURANT_ID="60d5ec49c1234567890abcde"

# Without area (basic info)
curl "http://localhost:5000/api/restaurants/$RESTAURANT_ID"

# With area and location (includes delivery fee & ETA)
curl "http://localhost:5000/api/restaurants/$RESTAURANT_ID?area=Jaipur%20Downtown&lat=26.9124&lng=75.7873"
```

---

## 5️⃣ Shopping Cart

### Add Item to Cart (Protected)
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "60d5ec49c1234567890abcde",
    "quantity": 2,
    "restaurantId": "60d5ec49c1234567890abcde",
    "areaId": "60d5ec49c1234567890abcde"
  }'
```

### Get Your Cart
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "_id": "...",
    "userId": "...",
    "restaurantId": "...",
    "areaId": "...",
    "items": [
      {
        "foodId": { "_id": "...", "name": "Biryani", "price": 350 },
        "quantity": 2,
        "price": 350
      }
    ],
    "subtotal": 700,
    "deliveryFee": 30,
    "tax": 35,
    "total": 765
  }
}
```

### Update Item Quantity
```bash
curl -X PUT http://localhost:5000/api/cart/item \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "60d5ec49c1234567890abcde",
    "quantity": 3
  }'
```

### Remove Item from Cart
```bash
FOOD_ID="60d5ec49c1234567890abcde"

curl -X DELETE "http://localhost:5000/api/cart/item/$FOOD_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Clear Entire Cart
```bash
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6️⃣ Place Order & Checkout

### Create Order from Cart (Protected)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddress": "123 Main Street, Jaipur 302001",
    "deliveryLat": 26.9124,
    "deliveryLng": 75.7873,
    "paymentMethod": "cash",
    "specialInstructions": "No onions, extra chutney"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "60d5ec49c1234567890abcde",
    "userId": "...",
    "restaurantId": { "name": "South Indian Paradise", ... },
    "areaId": { "name": "Jaipur Downtown", ... },
    "items": [ ... ],
    "subtotal": 700,
    "deliveryFee": 36,
    "tax": 35,
    "total": 771,
    "deliveryAddress": "123 Main Street, Jaipur 302001",
    "estimatedDeliveryTime": 37,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "createdAt": "2025-12-08T10:30:00Z"
  }
}
```

---

## 7️⃣ Track Order

### Get All User Orders
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

### Get Orders by Status
```bash
# Get pending orders
curl "http://localhost:5000/api/orders?status=pending" \
  -H "Authorization: Bearer $TOKEN"

# Get delivered orders
curl "http://localhost:5000/api/orders?status=delivered" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "orders": [
    {
      "_id": "...",
      "restaurantId": { "name": "South Indian Paradise", ... },
      "status": "pending",
      "total": 771,
      "estimatedDeliveryTime": 37,
      "createdAt": "2025-12-08T10:30:00Z"
    },
    ...
  ]
}
```

### Get Specific Order Details
```bash
ORDER_ID="60d5ec49c1234567890abcde"

curl "http://localhost:5000/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Cancel Order
```bash
curl -X PUT "http://localhost:5000/api/orders/$ORDER_ID/cancel" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Complete User Flow

### 1. Register & Login
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "email": "user@example.com",
    "password": "pass123"
  }'

# Save the returned TOKEN
TOKEN="returned_token_here"
```

### 2. Browse & Search
```bash
# 2. Get delivery areas
curl http://localhost:5000/api/delivery/areas

# 3. Search foods in your area
curl "http://localhost:5000/api/foods/search?q=biryani&area=Jaipur%20Downtown"

# 4. Get restaurants in your area
curl "http://localhost:5000/api/restaurants?area=Jaipur%20Downtown&lat=26.9124&lng=75.7873"
```

### 3. Add to Cart & Checkout
```bash
# 5. Add item to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "food_id_here",
    "quantity": 2,
    "restaurantId": "restaurant_id_here",
    "areaId": "area_id_here"
  }'

# 6. Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddress": "123 Main St",
    "deliveryLat": 26.9124,
    "deliveryLng": 75.7873,
    "paymentMethod": "cash"
  }'
```

### 4. Track Order
```bash
# 7. Get all orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"

# 8. Get specific order
ORDER_ID="order_id_here"
curl "http://localhost:5000/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Query Parameters Reference

### Foods Endpoint
| Parameter | Values | Example |
|-----------|--------|---------|
| `q` | search string | `q=biryani` |
| `cuisine` | cuisine name | `cuisine=Indian` |
| `area` | area name | `area=Jaipur Downtown` |
| `priceMin` | number | `priceMin=200` |
| `priceMax` | number | `priceMax=500` |
| `page` | number | `page=1` |
| `limit` | number | `limit=20` |

### Restaurants Endpoint
| Parameter | Values | Example |
|-----------|--------|---------|
| `area` | area name | `area=Jaipur Downtown` |
| `lat` | latitude | `lat=26.9124` |
| `lng` | longitude | `lng=75.7873` |

### Orders Endpoint
| Parameter | Values | Example |
|-----------|--------|---------|
| `status` | pending, confirmed, preparing, on-the-way, delivered, cancelled | `status=pending` |

---

## 💡 Tips

1. **Always include JWT token** for protected routes (cart, orders)
2. **Include area for accurate delivery fees** - Without area, fees may be flat
3. **Use coordinates for distance-based pricing** - More accurate delivery fees & ETA
4. **Payment Methods**: `cash`, `card`, `wallet`
5. **Order Statuses**: `pending`, `confirmed`, `preparing`, `on-the-way`, `delivered`, `cancelled`

---

## 🔧 Testing Tools
- **Postman**: Import these examples
- **Thunder Client**: VS Code extension
- **curl**: Command line (examples above)
- **Insomnia**: API client

---

## ✅ Backend is Complete!
All endpoints tested and working. Ready for frontend integration.
