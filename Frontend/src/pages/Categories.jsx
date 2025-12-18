import React from 'react'

const Categories = () => {
  return (
    <div className='cat-bg bg-[#120b09]' >
      <div className='flex flex-col justify-start py-20 items-center w-full'>
        <p className='lg:text-5xl md:text-3xl text-2xl font-semibold text-[#ec5e26] text-shadow-lg leading-8 '>What's Your Craving Today?</p>
        <p className='md:text-lg text-white/45 text-sm text-center leading-6 lg:leading-10'>Explore a world of flavors with our curated cuisine collections.</p>
      </div>
      <div className='md:flex lg:gap-5 gap-2 grid grid-cols-3 relative lg:px-36 md:px-20 px-10 pb-20 gap-y-2'>
        <div className="imagecontainer"><img src="/foodimage/chinese.webp" alt="" className='cat-image'/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-bold font-display'>Chinese </span></div>
        <div className="imagecontainer"><img src="/foodimage/south.webp" alt="" className="cat-image"/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm text-shadow-lg  font-display  font-bold'>South Indian </span></div>
        <div className="imagecontainer"><img src="/foodimage/italian.webp" alt="" className="cat-image"/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-display  font-bold'>Italian</span></div>
        <div className="imagecontainer"><img src="/foodimage/tacco.webp" alt="" className="cat-image"/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl  text-sm font-display  font-bold'>Street Food</span></div>
        <div className="imagecontainer"><img src="/foodimage/wrap.webp" alt="" className="cat-image"/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl  text-sm  font-display  font-bold'>Arabian</span></div>
        <div className="imagecontainer"><img src="/foodimage/desert.webp" alt="" className="cat-image"/><span className='absolute w-full bottom-3 left-0 text-center text-white lg:text-xl text-sm font-display font-bold'>Desserts</span></div>
      </div>
    </div>
  )
}

export default Categories
