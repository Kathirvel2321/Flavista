import React, { useEffect, useState } from "react";
import { IoStar, IoTime, IoBicycle, IoLocation } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const TopRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("https://flavista.onrender.com/api/restaurants");
        if (res.ok) {
          const data = await res.json();
          const restaurantList = Array.isArray(data)
            ? data
            : data.restaurants || data.data || [];

          const topRated = restaurantList
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);

          setRestaurants(topRated);
        }
      } catch (error) {
        console.error("Error fetching top restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div
      className=" Restaurants bg-background-dark py-16 px-4 md:px-10 font-display text-white"
      style={{
        backgroundImage: `
      radial-gradient(
      circle at 30% 50%,
      rgba(219,99,34,0.2),
      transparent 20%),
      radial-gradient(
      circle at 70% 80%,
      rgba(219,99,34,0.2),
      transparent 20%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2">
              Top Brands
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Restaurants
            </h2>
          </div>
          <button
            onClick={() => navigate("/restaurants")}
            className="hidden md:block text-white/60 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
          >
            See All Restaurants
          </button>
        </div>

        {loading ? (
          <Loader fullScreen={false} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className="group bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-orange-500/10"
              >
                {/* Image Container */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={restaurant.image || "/restaurantimage/rest1.webp"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12 flex items-end justify-between">
                    <span className="text-lg font-bold text-white">
                      {restaurant.offer || "Great Offers"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {restaurant.rating || 4.5} <IoStar />
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-4 flex items-center gap-2">
                    {restaurant.cuisine || "Multi-Cuisine"}
                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <IoLocation className="text-orange-500" />{" "}
                      {restaurant.location || "Jaipur"}
                    </span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-white/50 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <IoTime className="text-orange-500" />{" "}
                      {restaurant.time || "30-40 min"}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <IoBicycle className="text-blue-400" /> Free
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRestaurants;
