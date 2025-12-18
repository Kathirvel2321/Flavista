import Navbar from "../components/Navbar.jsx";
import { TrendingFood } from "../data/Trendingfood.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useState } from "react";
const Home = () => {
  const [index, setIndex] = useState(0);


  const swiperData = [...TrendingFood, ...TrendingFood, ...TrendingFood];

  // Helper to get the current active food safely
  const currentFood = TrendingFood[index % TrendingFood.length] || TrendingFood[0];

  return (
    <div id="Home" className="relative min-h-screen w-full overflow-hidden bg-gray-900 flex flex-col">
      
    
      <link rel="preload" as="image" href={TrendingFood[0].image2} fetchPriority="high" />

      {/* BACKGROUND LAYER - Preloaded & Cross-faded */}
      {/* We render ALL images hidden. This forces the browser to load them instantly. */}
      {TrendingFood.map((food) => (
        <div
          key={food._id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            currentFood._id === food._id ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${food.image})`,
            filter: "blur(8px) brightness(0.4)",
            transform: "scale(1.1)",
            willChange: "opacity", // Performance hint for the browser
          }}
        />
      ))}

      {/* Navbar */}
      <div className="nav fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* PROFESSIONAL SEARCH BAR */}
      <div className="relative z-20 mt-28 mb-4 w-full flex justify-center">
        <div className="flex items-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 w-11/12 md:w-1/2 lg:w-1/3 shadow-2xl transition-all duration-300 hover:bg-black/40 hover:border-yellow-500/30 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Find your next meal..."
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full ml-4 text-base font-montserrat tracking-wide"
          />
        </div>
      </div>

      
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center pb-12">
        
        <div className="text-center px-4 mb-8 animate-fadeIn z-20 max-w-5xl">
          <p className="text-yellow-500 font-montserrat text-sm md:text-base tracking-[0.3em] uppercase mb-2 font-semibold">
            Chef's Special Selection
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-playfair font-medium leading-tight text-shadow-lg">
            {currentFood.name}
          </h2>
        </div>

        <Swiper
          onSlideChange={(swiper) => setIndex(swiper.realIndex)}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          slideToClickedSlide={true}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="w-full py-8 "
        >
          {swiperData.map((food, i) => (
            <SwiperSlide
              key={`${food._id}-${i}`} // Unique key for duplicated items
              className="!w-52 !h-52 md:!w-80 md:!h-80 lg:!w-96 lg:!h-96 mx-2 md:mx-6 cursor-pointer"
            >
              {({ isActive }) => (
                <div
                  className="food-card-inner w-full h-full flex items-center justify-center relative"
                >
                  {/* STICKER / FLASH MESSAGE */}
                  {isActive && (
                    <div className="absolute -top-6 right-0 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full z-30 shadow-[0_0_15px_rgba(250,204,21,0.5)] tracking-widest uppercase font-montserrat">
                      Best Seller
                    </div>
                  )}

                  <img
                    src={food.image2}
                    alt={food.name}
                    loading={isActive ? "eager" : "lazy"} // Load active image immediately, lazy load others
                    fetchPriority={isActive ? "high" : "auto"} // Prioritize the active image bandwidth
                    className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${isActive ? 'animate-float' : ''}`}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PRICE & ACTION - Professional Layout */}
        <div
          key={currentFood._id}
          className="mt-4 text-center animate-fadeIn px-4 w-full flex flex-col items-center"
        >
          <p className="text-gray-300 font-montserrat text-lg max-w-2xl mb-6 font-light italic">
            "{currentFood.tagline}"
          </p>

          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-montserrat">Price</span>
              <span className="text-4xl font-playfair text-white">
              ₹{currentFood.price}
            </span>
            </div>
            
            <div className="h-12 w-[1px] bg-gray-600"></div>

            <button className="px-10 py-4 bg-white text-black font-montserrat font-bold text-sm tracking-widest uppercase rounded-full shadow-xl hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all duration-300 transform hover:-translate-y-1">
              Order Now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes fadeIn {
            from { opacity: 0.01; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
            will-change: opacity, transform;
        }
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }

        .text-shadow-lg {
            text-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }

        .food-card-inner {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: translateY(100px) scale(0.6);
          filter: grayscale(100%) brightness(0.4) blur(1px);
          opacity: 0.5;
        }

        .swiper-slide-prev .food-card-inner, 
        .swiper-slide-next .food-card-inner {
          transform: translateY(40px) scale(0.85) !important;
          filter: grayscale(30%) brightness(0.7) blur(0px) !important;
          opacity: 0.8;
        }

        /* Active Center - High and Big */
        .swiper-slide-active .food-card-inner {
          transform: translateY(0px) scale(1.3) !important;
          filter: grayscale(0%) brightness(1.1) !important;
          opacity: 1;
          z-index: 50;
        }
      `}</style>
    </div>
  );
};

export default Home;
