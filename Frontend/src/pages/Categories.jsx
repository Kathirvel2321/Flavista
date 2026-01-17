import React from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div id='explore' className='cat-bg bg-[#120b09]' >
      <div className='Explore flex flex-col justify-start py-20 items-center w-full'>
        <p className='lg:text-5xl md:text-3xl text-2xl font-semibold text-[#ec5e26] text-shadow-lg leading-8 '>What's Your Craving Today?</p>
        <p className='md:text-lg text-white/45 text-sm text-center leading-6 lg:leading-10'>Explore a world of flavors with our curated cuisine collections.</p>
      </div>
      <div className='md:flex lg:gap-5 gap-2 grid grid-cols-3 relative lg:px-36 md:px-20 px-10 pb-20 gap-y-2'>
        
        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('Chinese')}>
          <img src="/foodimage/chinese.webp" alt="" className='cat-image'/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-bold font-display'>Chinese </span>
        </div>

        {/* Mapped South Indian to 'Indian' to match database seed data */}
        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('Indian')}>
          <img src="/foodimage/south.webp" alt="" className="cat-image"/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm text-shadow-lg  font-display  font-bold'> Indian </span>
        </div>

        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('Italian')}>
          <img src="/foodimage/italian.webp" alt="" className="cat-image"/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-display  font-bold'>Italian</span>
        </div>

        {/* Mapped Street Food to 'American' (Burgers/Hotdogs) */}
        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('American')}>
          <img src="/foodimage/tacco.webp" alt="" className="cat-image"/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl  text-sm font-display  font-bold'>American</span>
        </div>

        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('Arabian')}>
          <img src="/foodimage/wrap.webp" alt="" className="cat-image"/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl  text-sm  font-display  font-bold'>Arabian</span>
        </div>

        <div className="imagecontainer cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleCategoryClick('Dessert')}>
          <img src="/foodimage/desert.webp" alt="" className="cat-image"/>
          <span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-display font-bold'>Desserts</span>
        </div>

      </div>
    </div>
  )
}

export default Categories;
