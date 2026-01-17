import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { IoArrowBack, IoTrash, IoBagCheck, IoAdd, IoRemove } from 'react-icons/io5';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  
  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 40; 
  const tax = Math.round(subtotal * 0.05); 
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <>
        <div className="sticky top-0 w-full z-30"><Navbar /></div>
        <div className="backgroundimagemin-h-screen bg-background-dark flex flex-col items-center justify-center p-4 text-white font-display">
          <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <IoBagCheck className="w-32 h-32 text-white/20" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-white/50 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Go ahead and explore our delicious menu!</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
          >
            Browse Food
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="backgroundimage min-h-screen bg-background-dark p-4 md:p-10 font-display text-white">
        
        <button 
          onClick={() => navigate('/')} 
          className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-8 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
          Your Order ({getCartCount()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.cartId} className="bg-white/5 border border-white/10 rounded-3xl p-3 md:p-6 flex gap-4 md:gap-6 items-start md:items-center hover:bg-white/10 transition-colors group relative">
                
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20">
                  <img src={item.customImage || item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 min-w-0">
                  
                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-xl font-bold mb-1 text-white truncate pr-6 md:pr-0">{item.name}</h3>
                        {/* Mobile Remove Button */}
                        <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="md:hidden text-white/40 hover:text-red-400 transition-colors p-1 absolute top-3 right-3"
                        >
                            <IoTrash size={20} />
                        </button>
                    </div>
                    
                    <p className="text-orange-500 font-bold mb-2 text-sm md:text-base">₹{item.price}</p>
                    
                    {/* Extras */}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-0">
                        {item.selectedExtras.map((extra, idx) => (
                          <span key={idx} className="text-[10px] md:text-xs bg-white/10 px-2 py-1 rounded-lg text-white/70 border border-white/5">
                            + {extra.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions (Desktop: Right side, Mobile: Bottom) */}
                  <div className="flex items-center justify-between md:flex-col md:gap-4 mt-1 md:mt-0">
                    {/* Quantity */}
                    <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10 h-9 md:h-auto">
                    <button 
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="w-8 h-full md:h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="w-8 h-full md:h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>

                  {/* Desktop Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="hidden md:flex text-red-400 text-sm hover:text-red-300 items-center gap-1 transition-colors"
                  >
                    <IoTrash /> Remove
                  </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-400" : ""}>
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="w-full h-px bg-white/10 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                Proceed to Checkout
                <IoBagCheck className="text-xl" />
              </button>
              
              <p className="text-center text-white/30 text-xs mt-4">
                Secure Checkout powered by Flavista
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Cart
