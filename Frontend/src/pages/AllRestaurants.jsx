import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoTime, IoBicycle, IoArrowBack, IoLocation } from 'react-icons/io5';
import Loader from '../components/Loader';

const AllRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('https://flavista.onrender.com/api/restaurants');
        if (res.ok) {
          const data = await res.json();
          const restaurantList = Array.isArray(data) 
            ? data 
            : data.restaurants || data.data || [];
          setRestaurants(restaurantList);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="backgroundimage min-h-screen bg-background-dark p-4 md:p-10 font-display text-white">
        
        <button 
          onClick={() => navigate('/')} 
          className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-8 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
          All Restaurants
        </h1>

        {loading ? (
          <Loader fullScreen={false} />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id} 
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              className="group bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-orange-500/10"
            >
              {/* Image Container */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={restaurant.image || "/restaurantimage/rest1.webp"} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12 flex items-end justify-between">
                  <span className="text-lg font-bold text-white">{restaurant.offer || "Tasty"}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {restaurant.rating || 4.5} <IoStar />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4 flex items-center gap-2">
                  {restaurant.cuisine || "Multi-Cuisine"}
                  <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                  <span className="flex items-center gap-1"><IoLocation className="text-orange-500" /> {restaurant.location || "Jaipur"}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-white/50 font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1"><IoTime className="text-orange-500" /> {restaurant.time || "30-45 min"}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="flex items-center gap-1"><IoBicycle className="text-blue-400" /> Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </>
  );
};

export default AllRestaurants;