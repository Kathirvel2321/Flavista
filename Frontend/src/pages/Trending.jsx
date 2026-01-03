import React from 'react'
import { TrendingNearYou } from '../data/TrendingNearYou';
import {IoStarOutline} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
const Trending = () => {
    const navigate = useNavigate(); 
  return (
    <div className='min-h-screen bg-[#120b09] w-full relative lg:px-36 md:px-20 px-10 py-20 trend-bg'>
        <div className=''>
            <h1 className='relative trend-title lg:text-5xl text-xl font-bold text-center font-fashion  md:text-left text-white p-3 px-3 md:text-3xl lg:px-5'>Trending Near You</h1>
            <div className=" h-full w-full trend-container grid grid-cols-1  md:grid-cols-4 lg:auto-rows-[16.5rem] auto-rows-[8rem] gap-6 lg:gap-5 mt-10 ">
                {TrendingNearYou?.map((item, index) => {
                    return (
                        <div key={index} onDoubleClick={() => navigate(`/food/${item.id}`)} className={`trend-box relative group overflow-hidden cursor-pointer ${item.grid || ''}`}>
                            <div className="absolute top-4 left-4 z-10 flex-col gap-2 items-start hidden lg:flex cursor-pointer">
                                
                                {index < 3 && (
                                    
                                    <span className="bg-red-500 text-black text-xs  font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide animate-pulse">
                                       <IoStarOutline  className='text-yellow-200 inline-block text-sm  pb-1'/>  Trending #{index + 1}
                                    </span>
                                )}
                                
                                {item.tag && (
                                    <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                            
                            <img src={item.image} alt={item.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                            <div className='absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent'>
                                <div className="flex justify-between items-end transition-transform duration-500 group-hover:-translate-y-1">
                                    <div>
                                        <p className='text-white font-bold text-xl'>{item.name}</p>
                                        <p className='text-red-500 scale-y-110 font-bold text-lg mt-1'>{item.price || "Delicious Meal"}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-orange-600/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-bold text-sm">{item.rating || "4.8"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>  );  
                })}

            </div>
        </div>
      
    </div>
  )
}

export default Trending
