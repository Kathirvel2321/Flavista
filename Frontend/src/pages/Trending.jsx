import React, { useState, useEffect } from 'react'
import {IoStarOutline} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
const Trending = () => {
    const navigate = useNavigate(); 
    const [trendingFoods, setTrendingFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch('https://flavista.onrender.com/api/foods/trending');
                if (!res.ok) {
                    throw new Error(`https error! Status: ${res.status}`);
                }
                const data = await res.json();
                setTrendingFoods(data);
            } catch (error) {
                console.error("Error fetching trending foods:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

  return (
    <div className='min-h-screen bg-[#120b09] w-full relative lg:px-36 md:px-20 px-10 py-20 trend-bg'>
        <div className=''>
            <h1 className='relative trend-title lg:text-5xl text-xl font-bold text-center font-fashion md:text-left text-white p-3 px-3 md:text-3xl lg:px-5 tracking-tight'>Trending Near You</h1>
            {loading ? (
                <div className="h-full w-full trend-container grid grid-cols-1 md:grid-cols-4 lg:auto-rows-[16.5rem] auto-rows-[8rem] gap-6 lg:gap-5 mt-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`rounded-3xl bg-white/5 animate-pulse border border-white/5 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} min-h-[16rem]`}></div>
                    ))}
                </div>
            ) : (
            <div className=" h-full w-full trend-container grid grid-cols-1  md:grid-cols-4 lg:auto-rows-[16.5rem] auto-rows-[8rem] gap-6 lg:gap-5 mt-10 ">
                {trendingFoods.map((item, index) => {
                    return (
                        <div key={item._id} onClick={() => navigate(`/food/${item._id}`)} className={`trend-box relative group overflow-hidden cursor-pointer rounded-3xl shadow-lg ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${item.name.includes("Lava Cake") ? "md:col-span-2" : ""}`}>
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start hidden lg:flex cursor-pointer">
                                
                                {index < 3 && (
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                                       <IoStarOutline className='text-white text-sm'/> Top #{index + 1}
                                    </span>
                                )}
                                
                                {item.tags && (
                                    (() => {
                                        const displayTag = item.tags.find(t => t.toLowerCase() !== 'trending');
                                        return displayTag ? (
                                            <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                                {displayTag}
                                            </span>
                                        ) : null;
                                    })()
                                )}
                            </div>
                            
                            <img src={ item.customImage || item.image} alt={item.name} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500'></div>
                            
                            <div className='absolute bottom-0 left-0 w-full p-5'>
                                <div className="flex justify-between items-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex-1 pr-4">
                                        <p className='text-white font-playfair font-bold text-xl md:text-2xl leading-tight tracking-tight'>{item.name}</p>
                                        <p className='text-amber-400 font-medium text-lg mt-1'>₹{item.price}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                                            <IoStarOutline className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="text-white font-bold text-sm">{item.rating || "4.8"}</span>
                                        </div>
                                        <button className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg uppercase tracking-wider hover:bg-amber-400">
                                            Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>  );  
                })}

            </div>
            )}
        </div>
      
    </div>
  )
}

export default Trending
