import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { IoArrowBack, IoCard, IoCash, IoWallet, IoCheckmarkCircle, IoPerson, IoCall, IoLocation, IoMap, IoBusiness, IoShieldCheckmark, IoHome, IoFastFood } from 'react-icons/io5';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [upiId, setUpiId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const subtotal = getCartTotal();
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const deliveryFee = isFreeDelivery || subtotal > 500 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax - discount;

  const handleApplyCoupon = () => {
    // Reset previous coupon states
    setDiscount(0);
    setIsFreeDelivery(false);
    setCouponMessage('');

    const code = couponCode.toUpperCase();

    if (code === 'FLAVISTA50') {
      if (subtotal < 200) {
        setCouponMessage('❌ Min order ₹200 required for FLAVISTA50');
        return;
      }
      setDiscount(Math.min(subtotal * 0.5, 100));
      setCouponMessage('✅ Coupon FLAVISTA50 applied!');
    } else if (code === 'FREEDEL') {
      if (subtotal < 200) {
        setCouponMessage('❌ Min order ₹200 required for Free Delivery');
        return;
      }
      setIsFreeDelivery(true);
      setCouponMessage('✅ Coupon FREEDEL applied! Delivery is now free.');
    } else if (code === 'WEEKENDTREAT') {
      const today = new Date().getDay();
      if (today !== 0 && today !== 6) {
        setCouponMessage('❌ WEEKENDTREAT is valid only on Sat & Sun');
        return;
      }
      if (subtotal < 399) {
        setCouponMessage('❌ Min order ₹399 required for WEEKENDTREAT');
        return;
      }
      setDiscount(120);
      setCouponMessage('✅ Coupon WEEKENDTREAT applied!');
    } else if (code === 'COMBO20') {
      if (subtotal < 500) {
        setCouponMessage('❌ Min order ₹500 required for COMBO20');
        return;
      }
      setDiscount(Math.round(subtotal * 0.2));
      setCouponMessage('✅ Coupon COMBO20 applied!');
    } else {
      setCouponMessage('❌ Invalid coupon code.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Payment Validation
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        alert("Please enter valid card details");
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        alert("Please enter a valid UPI ID");
        return;
      }
    }

    setIsProcessing(true);
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    // Simulate Payment Gateway Delay
    if (paymentMethod !== 'cod') {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const orderData = {
      orderItems: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.customImage || item.image,
        price: item.price,
        food: item._id || item.id
      })),
      shippingAddress: {
        address: e.target.address.value,
        city: e.target.city.value,
        postalCode: e.target.postalCode.value,
        country: 'India'
      },
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: deliveryFee, // This should be the final delivery fee
      totalPrice: total,
      isPaid: paymentMethod !== 'cod',
      paidAt: paymentMethod !== 'cod' ? new Date() : null,
      paymentResult: paymentMethod !== 'cod' ? {
        id: `PAY-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: 'user@flavista.com'
      } : {},
    };

    try {
      const res = await fetch('https://flavista.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      
      setNewOrderId(data._id);
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Failed to place order. Please try again.");
    }
  };
  useEffect(() => {
  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }
}, [cart, isSuccess, navigate]);

  // Play sound effect when success screen mounts
  useEffect(() => {
    if (isSuccess) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Premium chime
      audio.volume = 0.6;
      audio.play().catch(e => console.log("Audio play failed", e));
    }
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <>
        <div className="sticky top-0 w-full z-30"><Navbar /></div>
        <div className=" min-h-screen bg-background-dark flex flex-col items-center justify-center p-4 text-white font-display text-center relative overflow-hidden">

          <style>{`
            @keyframes confetti-fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .confetti {
              position: absolute;
              top: -10px;
              width: 10px;
              height: 10px;
              animation: confetti-fall 4s linear infinite;
            }
            @keyframes pop-in {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-pop-in { animation: pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>

        
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#f97316', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 3)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}

          {/* Success Card */}
          <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 max-w-lg w-full animate-pop-in">
            
            {/* Animated Icon */}
            <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(74,222,128,0.4)] animate-bounce">
              <IoCheckmarkCircle className="text-6xl text-white drop-shadow-lg" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-white">Order Confirmed!</h2>
            
            <div className="bg-black/20 rounded-2xl p-4 mb-8 border border-white/5">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-xl font-mono text-orange-400 font-bold">#{newOrderId?.slice(-10).toUpperCase()}</p>
            </div>

            <p className="text-white/70 mb-10 text-lg leading-relaxed font-light">
              Your kitchen is firing up! We're preparing your meal with <span className="text-orange-400 font-bold">love & spice</span>.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => navigate('/')}
                className="flex-1 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                <IoHome className="text-lg" /> Home
              </button>
              <button 
                onClick={() => navigate(`/track-order/${newOrderId}`)}
                className="flex-1 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                Track Order <IoMap className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="backgroundimage min-h-screen bg-background-dark p-4 md:p-10 font-display text-white">
        <button 
          onClick={() => navigate('/cart')} 
          className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-8 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </button>

        <h1 className="text-3xl md:text-5xl font-bold mb-10 flex items-center gap-4 text-white">
          <span className="w-2 h-10 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></span>
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Address */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">1</span>
                Shipping Information
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/60 tracking-wider">Full Name</label>
                  <div className="relative">
                    <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input required type="text" name="fullName" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20" placeholder="Enter your name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/60 tracking-wider">Phone Number</label>
                  <div className="relative">
                    <IoCall className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input required type="tel" name="phone" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20" placeholder="Enter your phone number" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-white/60 tracking-wider">Address</label>
                  <div className="relative">
                    <IoLocation className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input required type="text" name="address" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20" placeholder="Flat No, Building, Street Area" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/60 tracking-wider">City</label>
                  <div className="relative">
                    <IoBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input required type="text" name="city" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20" placeholder="City" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/60 tracking-wider">ZIP Code</label>
                  <div className="relative">
                    <IoMap className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input required type="text" name="postalCode" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20" placeholder="ZIP Code" />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === 'card' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500 text-white shadow-lg shadow-orange-500/10 scale-[1.02]' : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <IoCard className="text-2xl" />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === 'upi' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500 text-white shadow-lg shadow-orange-500/10 scale-[1.02]' : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <IoWallet className="text-2xl" />
                  <span className="font-medium">UPI / Wallet</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500 text-white shadow-lg shadow-orange-500/10 scale-[1.02]' : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <IoCash className="text-2xl" />
                  <span className="font-medium">Cash on Delivery</span>
                </button>
              </div>

              {/* Card Details (Mock) */}
              {paymentMethod === 'card' && (
                <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-white/5 space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/60 tracking-wider">Card Number</label>
                    <input 
                      type="text" 
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 py-3 focus:border-orange-500 outline-none transition-colors text-white placeholder-white/20 font-mono" 
                      placeholder="0000 0000 0000 0000" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-white/60 tracking-wider">Expiry</label>
                      <input 
                        type="text" 
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 focus:border-orange-500 outline-none transition-colors text-white placeholder-white/20 font-mono" 
                        placeholder="MM/YY" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-white/60 tracking-wider">CVC</label>
                      <input 
                        type="text" 
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 focus:border-orange-500 outline-none transition-colors text-white placeholder-white/20 font-mono" 
                        placeholder="123" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {paymentMethod === 'upi' && (
                <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-white/5 space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/60 tracking-wider">UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 py-3 focus:border-orange-500 outline-none transition-colors text-white placeholder-white/20 font-mono" 
                      placeholder="username@bank" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 backdrop-blur-xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                   <div key={item.cartId} className="flex justify-between items-start text-sm">
                     <div className="text-white/80 flex-1 pr-4">
                       <span className="font-bold text-orange-400">{item.quantity}x</span> {item.name}
                     </div>
                     <div className="text-white font-medium">₹{(item.price * item.quantity)}</div>
                   </div>
                ))}
              </div>

              <div className="w-full h-px bg-white/10 my-4"></div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter Coupon Code"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:border-orange-500 focus:bg-black/40 outline-none transition-all text-white placeholder-white/30 text-sm"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="bg-white/10 text-white px-4 rounded-xl font-bold hover:bg-white/20 transition-colors text-xs uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>
              {couponMessage && <p className={`text-xs text-center mb-4 ${couponMessage.includes('Invalid') ? 'text-red-400' : 'text-green-400'}`}>{couponMessage}</p>}

              <div className="flex flex-col gap-2 mb-6">
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
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="w-full h-px bg-white/10 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Place Order <IoCheckmarkCircle className="text-xl" /></>
                )}
              </button>
              
              <p className="text-center text-white/30 text-xs mt-4 flex items-center justify-center gap-1">
                <IoShieldCheckmark /> Secure Checkout powered by Flavista
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;