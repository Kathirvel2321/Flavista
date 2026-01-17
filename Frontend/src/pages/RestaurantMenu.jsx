import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  IoArrowBack,
  IoStar,
  IoTime,
  IoLocation,
  IoAdd,
  IoLogIn,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import FloatingCartBar from "../components/FloatingCartBar";
import Loader from "../components/Loader";

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 🔒 Normalize ANY backend response to array
  const normalizeArray = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.foods)) return res.foods;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch restaurant
        const restaurantRes = await fetch(
          `http://flavista.onrender.com/api/restaurants/${id}`
        );

        if (!restaurantRes.ok) throw new Error("Restaurant not found");

        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);

        // 2️⃣ Cuisine → Category mapping
        const categoryMap = {
          Continental: "Italian",
          Snacks: "American",
          Asian: "Chinese",
          Fusion: "Indian",
        };

        const cuisine = restaurantData?.cuisine || "Indian";
        const category = categoryMap[cuisine] || cuisine;

        // 3️⃣ Fetch foods by category
        const foodRes = await fetch(
          `http://flavista.onrender.com/api/foods/category/${category}`
        );

        let foods = [];
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          foods = normalizeArray(foodData);
        }

        // 4️⃣ Fallback → Trending
        if (!foods.length) {
          const trendingRes = await fetch(
            "http://flavista.onrender.com/api/foods/trending"
          );
          const trendingData = await trendingRes.json();
          foods = normalizeArray(trendingData);
        }

        setMenuItems(foods);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleAddToCart = (item) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    addToCart({
      ...item,
      image: item.customImage || item.image,
      quantity: 1,
    });
  };

  if (loading || !restaurant) return <Loader />;

  return (
    <>
      <div className="sticky top-0 z-30">
        <Navbar />
      </div>

      <div className="min-h-screen bg-background-dark text-white font-display pb-10">
        {/* HEADER */}
        <div className="relative h-64 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-black/50 to-transparent z-10" />
          <img
            src={restaurant.image || "/restaurantimage/rest1.webp"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-24 left-4 md:left-10 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
          >
            <IoArrowBack />
          </button>

          <div className="absolute bottom-0 w-full p-4 md:p-10 z-20">
            <h1 className="text-3xl md:text-5xl font-bold">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/80 mt-2">
              <span className="flex items-center gap-1 text-yellow-400">
                <IoStar /> {restaurant.rating || 4.5}
              </span>
              <span>{restaurant.cuisine}</span>
              <span className="flex items-center gap-1">
                <IoLocation /> {restaurant.location || "Jaipur"}
              </span>
              <span className="flex items-center gap-1">
                <IoTime /> {restaurant.time || "30-40 min"}
              </span>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="container mx-auto px-4 md:px-10 mt-8">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6">
            Recommended
          </h2>

          {menuItems.length === 0 ? (
            <p className="text-white/50 text-center py-10">
              No items available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/10 transition"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20">
                    <img
                      src={item.customImage || item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-white/50 text-sm line-clamp-2">
                        {item.tagline || "Delicious & freshly prepared"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-orange-400 font-bold">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white text-black px-4 py-1.5 rounded-lg font-bold hover:bg-orange-500 hover:text-white flex items-center gap-1"
                      >
                        ADD <IoAdd />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGIN MODAL */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-3xl max-w-sm w-full text-center border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
                <IoLogIn size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Login Required</h3>
              <p className="text-white/60 mb-6 text-sm">
                Please login to add items to your cart.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-bold"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        <FloatingCartBar />
      </div>
    </>
  );
};

export default RestaurantMenu;
