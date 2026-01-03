import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IoBagHandle } from 'react-icons/io5';

const FloatingCartBar = () => {
  const { getCartCount, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (getCartCount() === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 md:px-10 z-50 flex justify-center pointer-events-none">
      <div 
        onClick={() => navigate('/cart')}
        className="bg-[#ff4f18] text-white w-full max-w-4xl rounded-2xl py-3 px-6 shadow-2xl shadow-orange-500/40 flex justify-between items-center cursor-pointer hover:scale-[1.01] active:scale-95 transition-all border border-white/10 backdrop-blur-md pointer-events-auto"
      >
         <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">{getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'} added</span>
            <span className="text-lg font-bold">₹{getCartTotal()}</span>
         </div>
         <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide">
            View Cart <IoBagHandle className="text-lg" />
         </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;