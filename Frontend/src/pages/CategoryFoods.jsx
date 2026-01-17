import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { IoArrowBack, IoStar } from "react-icons/io5";
import FloatingCartBar from "../components/FloatingCartBar";

const CategoryFoods = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map database categories to display titles for a better UI experience
  const getDisplayTitle = (cat) => {
    const titles = {
      "American": "Street Food",
      "Indian": " Indian",
      "Dessert": "Desserts",
      "Arabian": "Arabian",
      "Italian": "Italian",
      "Chinese": "Chinese"
    };
    return titles[cat] || cat;
  };

  useEffect(() => {
    const fetchCategoryFoods = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://flavista.onrender.com/api/foods/category/${category}`);
        if (response.ok) {
          const data = await response.json();
          setFoods(data);
        }
      } catch (error) {
        console.error("Error fetching category foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryFoods();
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <>
      <div className="sticky top-0 w-full z-30">
        <Navbar />
      </div>

      <div className="min-h-screen bg-[#120b09] p-4 md:p-10 font-display">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-6 group text-sm font-medium"
          >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to Categories
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white capitalize tracking-tight">
                {getDisplayTitle(category)} <span className="text-orange-500">Collection</span>
              </h1>
              <p className="text-white/60 mt-3 text-lg max-w-2xl">
                Discover our chef's curated selection of the finest {getDisplayTitle(category)} dishes, made with passion and authentic ingredients.
              </p>
            </div>
            <span className="text-white/40 font-mono mt-4 md:mt-0">{foods.length} Items Available</span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center text-white/50 py-20 text-xl">No items found in this category yet.</div>
          ) : (
            /* Food Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {foods.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/food/${item._id}`)}
                  className="bg-white/5 rounded-3xl p-4 border border-white/5 hover:border-orange-500/30 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer group flex flex-col h-full relative overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="h-64 rounded-2xl overflow-hidden mb-5 relative">
                    <img
                      src={item.customImage || item.image || "httpss://via.placeholder.com/400x300?text=No+Image"}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-lg">
                      <IoStar className="text-yellow-400 text-sm" />
                      <span className="text-white text-xs font-bold">{item.rating || 4.5}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-2 flex flex-col flex-grow">
                    <h3 className="text-2xl text-white font-bold leading-tight mb-2 group-hover:text-orange-400 transition-colors">{item.name}</h3>
                    <p className="text-white/50 text-sm line-clamp-2 mb-6 flex-grow font-light">{item.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                      <span className="text-white font-bold text-xl">₹{item.price}</span>
                      <span className="text-orange-500 text-sm font-bold group-hover:translate-x-1 transition-transform">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FloatingCartBar />
    </>
  );
};

export default CategoryFoods;