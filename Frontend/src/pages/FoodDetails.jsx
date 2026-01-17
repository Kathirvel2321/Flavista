import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrendingNearYou } from "../data/TrendingNearYou";
import Navbar from "../components/Navbar";
import { Reviews } from "../data/Reviews";
import { IoArrowForward, IoStar, IoSend, IoArrowBack, IoBagHandle, IoCheckmark, IoLogIn } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import FloatingCartBar from "../components/FloatingCartBar";
import Loader from "../components/Loader";


const FoodDetails = () => {
  const { addToCart } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();
  const [count, setcount] = useState(1);

  // ✅ active image state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ selected extras state
  const [selectedExtras, setSelectedExtras] = useState([]);
  
  // ✅ Review Form State
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [localReviews, setLocalReviews] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Data Fetching State (Dummy || API)
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetch('https://flavista.onrender.com/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Failed to fetch user:", err));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Try Fetch from API first (Prioritize Backend Data)
        const response = await fetch(`https://flavista.onrender.com/api/foods/${id}`);

        if (response.ok) {
          const apiFood = await response.json();
          setFood(apiFood);
          // Set default reviews for API items since they don't have real reviews yet
          
          // Fetch Real Reviews from Database
          fetch(`https://flavista.onrender.com/api/reviews/${apiFood._id || apiFood.id}`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data) && data.length > 0) {
                setLocalReviews(data);
              } else {
                // If no real reviews, check if it's a trending item and add defaults
                const isTrending = TrendingNearYou.some(t => t.name === apiFood.name);
                if (isTrending) {
                  setLocalReviews([
                    {
                      id: "def1",
                      user: "Sarah J.",
                      rating: 5,
                      comment: "Hands down the best I've ever had! The flavors are incredible.",
                      date: "Recently"
                    },
                    {
                      id: "def2",
                      user: "Mike T.",
                      rating: 5,
                      comment: "Absolutely loved it. Fresh, hot, and delicious. Will order again!",
                      date: "Recently"
                    }
                  ]);
                }
              }
            })
            .catch(err => console.error("Error fetching reviews:", err));
            
        } else {
          // 2. Fallback to Dummy Data if API fails (e.g. 404 or ID mismatch)
          const dummyFood = TrendingNearYou.find((item) => item.id == id);
          
          if (dummyFood) {
            setFood(dummyFood);
            setLocalReviews(Reviews.filter((review) => review.foodId === dummyFood.id));
          } else {
            throw new Error("Food not found");
          }
        }
      } catch (err) {
        // Handle network errors by checking dummy data as last resort
        const dummyFood = TrendingNearYou.find((item) => item.id == id);
        if (dummyFood) {
          setFood(dummyFood);
          setLocalReviews(Reviews.filter((review) => review.foodId === dummyFood.id));
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!food) return;

    const fetchRelatedFoods = async () => {
      try {
        const category = food.category || food.cuisine;
        const response = await fetch(`https://flavista.onrender.com/api/foods/category/${category}`);
        
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(item => item._id !== food._id);
          setRelatedFoods(filtered.slice(0, 3));
        } else {
          throw new Error("Failed to fetch related foods");
        }
      } catch (error) {
        const staticRelated = TrendingNearYou
          .filter((item) => String(item.id) !== String(food.id))
          .sort((a, b) => {
            return (b.cuisine === (food.category || food.cuisine) ? 1 : 0) - (a.cuisine === (food.category || food.cuisine) ? 1 : 0);
          })
          .slice(0, 3);
        setRelatedFoods(staticRelated);
      }
    };
    fetchRelatedFoods();
  }, [food]);

  if (loading) return <Loader />;
  if (error || !food) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white text-xl">Food not found</div>;

  const imageViews = [
    { src: food.customImage || food.image, className: "scale-100 hover:scale-105" }, // Full View
    {
      src: food.customImage || food.image,
      className: "scale-125 hover:scale-[130%]  origin-bottom-right",
    }, // Detail 1
    { src: food.customImage || food.image, className: "scale-150 hover:scale-[155%] origin-top" }, // Detail 2
  ];

  const handleExtraToggle = (index) => {
    if (selectedExtras.includes(index)) {
      setSelectedExtras(selectedExtras.filter((i) => i !== index));
    } else {
      setSelectedExtras([...selectedExtras, index]);
    }
  };

  const handleImageChange = (index) => {
    if (index === activeImageIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveImageIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  // Define extras based on cuisine type
  const getExtras = () => {
    const cuisine = food.category || food.cuisine || "Default";
    const name = (food.name || "").toLowerCase();

    // Fix for ambiguous data: Check food name for keywords (e.g. "Lava Cake" with cuisine "Fresh")
    if (
      name.includes("cake") ||
      name.includes("dessert") ||
      name.includes("ice cream") ||
      name.includes("brownie")
    ) {
      return [
        { name: "Extra Chocolate Sauce", price: 40 },
        { name: "Add Vanilla Scoop", price: 50 },
        { name: "Extra Nuts", price: 30 },
      ];
    }

    switch (cuisine) {
      case "Dessert":
      case "Ice Cream":
        return [
          { name: "Extra Chocolate Sauce", price: 40 },
          { name: "Add Vanilla Scoop", price: 50 },
          { name: "Extra Nuts", price: 30 },
        ];
      case "Italian":
      case "Pizza":
      case "Pasta":
        return [
          { name: "Extra Cheese Burst", price: 50 },
          { name: "Add Mushrooms & Olives", price: 30 },
          { name: "Make it Super Spicy 🌶️", price: 0 },
        ];
      case "Indian":
      case "Biryani":
      case "Curry":
        return [
          { name: "Extra Raita & Salad", price: 30 },
          { name: "Add Butter Naan", price: 45 },
          { name: "Extra Gravy", price: 40 },
        ];
      case "Chinese":
      case "Asian":
        return [
          { name: "Extra Schezwan Sauce", price: 20 },
          { name: "Add Fried Egg", price: 25 },
          { name: "Extra Crispy Noodles", price: 30 },
        ];
      case "American":
      case "Burger":
      case "Sandwich":
        return [
          { name: "Extra Cheese Slice", price: 25 },
          { name: "Extra Patty", price: 90 },
          { name: "Add Bacon", price: 70 },
        ];
      case "Arabian":
      case "Lebanese":
        return [
          { name: "Extra Garlic Sauce", price: 30 },
          { name: "Add Pita Bread", price: 25 },
          { name: "Extra Hummus", price: 40 },
        ];
      default:
        // Default options for generic dishes
        return [
          { name: "Extra Cheese", price: 40 },
          { name: "Extra Sauce", price: 20 },
          { name: "Make it Spicy", price: 0 },
        ];
    }
  };

  const extras = getExtras();

  const baseprice = food.price || 0;
  const extrasTotal = selectedExtras.reduce(
    (sum, index) => sum + extras[index].price,
    0
    );
  const totalPrice = (baseprice + extrasTotal) * count;

  const handleAddToCart = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const selectedExtrasDetails = selectedExtras.map(index => extras[index]);
    addToCart({
      ...food,
      price: baseprice + extrasTotal, // Store unit price including extras
      quantity: count,
      selectedExtras: selectedExtrasDetails
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) return;
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert("Please login to submit a review");
      navigate('/login');
      return;
    }

    const newReview = {
      id: Date.now(),
      foodId: food._id || food.id,
      user: user?.username || "Verified User",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: "Just Now"
    };
    
    // Optimistic UI Update
    setLocalReviews([newReview, ...localReviews]);
    setReviewForm({ name: "", rating: 0, comment: "" });

    // Persist to Backend
    try {
      await fetch(`https://flavista.onrender.com/api/reviews/${food._id || food.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          user: newReview.user,
          rating: newReview.rating, 
          comment: newReview.comment,
          date: newReview.date
        })
      });
    } catch (err) {
      console.error("Failed to save review to server:", err);
    }
  };

  return (
    <>
    <div className="sticky top-0 w-full z-30"><Navbar /></div>
      
      <div className="food-detailpage bg-background-dark min-h-screen p-4 md:p-10 font-display">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-4 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Go Back 
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-5 ">
         
          <div>
        
            <div className="h-72 md:h-[490px] rounded-3xl overflow-hidden ring-4 ring-orange-500/10 backdrop-blur-0 shadow-lg">
              <img
                src={imageViews[activeImageIndex].src}
                alt={food.name}
                className={`w-full h-full object-cover transition-all ease-in-out 
                  ${
                    isTransitioning
                      ? "opacity-0 scale-90 duration-200"
                      : "opacity-100 duration-700"
                  } 
                  ${
                    !isTransitioning
                      ? imageViews[activeImageIndex].className
                      : ""
                  }
                `}
              />
            </div>

            <div className="flex gap-4 mt-6 md:mt-10 justify-center md:justify-start">
              {imageViews.map((view, index) => (
                <div
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`
        relative w-20 h-20 md:w-36 md:h-36 rounded-xl overflow-hidden cursor-pointer 
        transition-all duration-300
        ${
          activeImageIndex === index
            ? "ring-2 ring-orange-500 scale-105"
            : "opacity-70 hover:opacity-100 hover:scale-105"
        }
      `}
                >
                  <img
                    src={view.src}
                    alt="thumbnail"
                    loading="lazy"
                    className={`
          w-full h-full object-cover
          ${view.className}
          ${activeImageIndex !== index ? "grayscale" : ""}
        `}
                  />

                  {/* Active indicator */}
                  {activeImageIndex === index && (
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-xl pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl md:px-6 text-white">
            <p className="text-red-600 font-mono font-bold ">{food.category || food.cuisine || "Special"}</p>
            <h1 className="text-3xl md:text-5xl font-bold">{food.name}</h1>

            <div className="flex justify-between items-center w-full mt-">
              <div className="flex items-center gap-1 mt-4">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = food.rating || 0;
                  const fillPercentage = Math.max(
                    0,
                    Math.min(100, ((food.rating || 4.5) - index) * 100)
                  );

                  return (
                    <div key={index} className="relative w-5 h-5">
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute top-0 left-0 w-full h-full text-gray-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {/* Foreground Star (Yellow) - Clipped */}
                      <div
                        className="absolute top-0 left-0 h-full overflow-hidden"
                        style={{ width: `${fillPercentage}%` }}
                      >
                        <svg
                          xmlns="https://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-yellow-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
                <span className="text-gray-400 text-sm ml-2">
                  ({food.rating || 4.5})
                </span>
              </div>
              <div className="flex px-5">
                <span className="text-orange-400 font-bold  text-sm mr-1">Spicy:</span>
                <div className="flex">
                  {[...Array(3)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns="https://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 ${
                        index < (food.spicyLevel ?? 2)
                          ? "text-orange-500"
                          : "text-gray-600"
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full border border-white/20 mt-5"></div>

            <p className="mt-5 text-white/60 ">{food.description}</p>
            <h1 className="text-white mt-8 font-display text-xl">Ingredients</h1>
            <div className="flex flex-wrap gap-3 mt-4">
              {(food.ingredients || ["Fresh Ingredients", "Chef's Special", "Love"]).map((ingredient, index) => (
                <span key={index} className="border border-white/20 rounded-full bg-white/5 px-4 py-2 text-sm hover:shadow-sm hover:shadow-white hover:scale-105 transition-all duration-300 cursor-pointer">{ingredient}</span>
              ))}
            </div>

            <div className="w-full  shadow-lg rounded-3xl mt-5 p-6 flex flex-col gap-4 font-display border border-white/10">
            <h2 className="text-xl font-semibold font-display">Customize your order</h2>
              {extras.map(
                (item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={selectedExtras.includes(index)}
                      onChange={() => handleExtraToggle(index)}
                    />
                    <div className="w-5 h-5 rounded-lg border border-white/30 bg-transparent peer-checked:bg-orange-600 peer-checked:border-orange-500 peer-checked:[&_svg]:opacity-100   transition-all flex items-center justify-center">
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-white opacity-0 transition-opacity"
                      >
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-full flex justify-between ">
                    <span className="text-white/80 group-hover:text-white transition-colors select-none">{item.name}</span>
                    <span className="text-white/40 font-medium text-sm tracking-wider ">{item.price === 0 ? "Free" : `+ ₹${item.price}`}</span></div>
                  </label>
                )
              )}
            </div>
            
            <div className="bill h-auto md:h-20 rounded-3xl w-full bg-white/5 mt-5 py-4 md:py-2 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 gap-4 md:gap-0">
            <div className="w-full md:w-auto text-center md:text-left flex justify-between md:block items-center">
              <p className="text-sm text-white/30 capitalize">total price</p>
              <p className="text-3xl md:text-4xl font-bold tracking-wide font-display ">₹{totalPrice}</p>
            </div>
            <div className="flex gap-3 md:gap-5 justify-center items-center w-full md:w-auto">
              <div className="flex w-24 md:w-28 bg-black/50 rounded-full items-center justify-between">
                <button className="calculation-btn hover:bg-white/10 hover:scale-95 " onClick={() => {
                  if (count > 1) {
                    setcount(count - 1);
                  }
                }}>-</button>
                <span className="calculation-btn">{count}</span>
                <button className="calculation-btn hover:bg-white/10 scale-95"
                  onClick={() => setcount(count + 1)}>
                +</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`addcard-btn ${isAdded ? "bg-green-500" : "bg-gradient-to-tr from-orange-500 to-orange-700"} text-white font-bold hover:scale-105 px-6 md:px-8 py-3 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all duration-300 flex-1 md:flex-none justify-center`}
              >
                {isAdded ? <IoCheckmark className="text-xl" /> : <IoBagHandle className="text-xl" />}
                <span className="whitespace-nowrap">{isAdded ? "Added!" : "Add to cart"}</span>
              </button>
            </div>
            </div>

          </div>
        </div>
        
        <div className="mt-20">
          <span className="w-full border flex border-white/5"></span>

          <div className="flex justify-between items-end mb-10 mt-12">
            <h1 className="text-3xl text-white font-bold font-sans tracking-wider">Guest Review</h1> 
            {localReviews.length > 3 && (
              <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors hover:underline underline-offset-4 flex items-center"
              >
                {showAllReviews ? "Show Less" : "View all reviews"}
                <IoArrowForward className={`ml-1 transition-transform duration-300 ${showAllReviews ? "rotate-90" : ""}`} />
              </button>
            )}
          </div>

          {localReviews.length === 0 ? (
            <div className="bg-white/5 rounded-3xl p-10 text-center border border-white/10 flex flex-col items-center justify-center gap-4 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-tr from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <IoStar className="text-4xl animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">No reviews yet</h3>
                <p className="text-white/50 max-w-md mx-auto">Be the first to taste this masterpiece! Order now and share your culinary experience with the world.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localReviews.slice(0, showAllReviews ? localReviews.length : 3).map((review) => (
              <div key={review.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-medium leading-tight">{review.user}</h3>
                      <p className="text-white/40 text-xs">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="https://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400" : "text-white/20"}`}
                      >
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed font-light">"{review.comment}"</p>
              </div>
            ))}
            </div>
          )}

          
          <div className="mt-10 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-5 md:p-8 border border-white/10 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl text-white font-bold font-display mb-2">Rate your experience</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Your feedback helps us improve and helps other foodies choose better. Share your thoughts on the taste, presentation, and service.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                      <IoStar className="w-5 h-5" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">Rate the taste & quality</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <IoSend className="w-5 h-5" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">Share specific details</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-black/20 p-6 rounded-2xl border border-white/10 flex flex-col gap-6 shadow-xl">
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-3">How many stars?</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <IoStar
                          className={`w-8 h-8 transition-colors duration-200 ${
                            star <= (hoverRating || reviewForm.rating)
                              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                              : "text-white/10"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Your Review</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us what you liked (or didn't like)..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewForm.rating === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Review</span>
                  <IoSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* You May Also Like Section */}
        <div className="mt-20 mb-10">
          <h1 className="text-3xl text-white font-bold font-sans tracking-wider mb-10 ">You May Also Like</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {relatedFoods.map((item) => (
              <div 
                key={item._id || item.id} 
                onClick={() => navigate(`/food/${item._id || item.id}`)}
                className="bg-white/5 rounded-3xl p-4 border border-white/10 hover:bg-white/10 hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500 transition-all duration-300 cursor-pointer group"
              >
                <div className="h-48 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={item.customImage || item.image} 
                    alt={item.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl text-white font-bold">{item.name}</h3>
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {item.rating} ★
                    </span>
                  </div>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">₹{item.price}</span>
                    <button className="text-orange-400 text-sm font-bold hover:text-orange-300">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Requirement Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <IoLogIn className="text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">Please log in to add delicious items to your cart and complete your order.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Bar - Professional "View Cart" Direction */}
      <FloatingCartBar />
    </>
  );
};

export default FoodDetails;
