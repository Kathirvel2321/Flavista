import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { IoArrowBack, IoReceiptOutline, IoRestaurantOutline, IoBicycleOutline, IoCheckmarkCircleOutline, IoCallOutline, IoLocationSharp, IoTimeOutline, IoChatbubbleEllipsesOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://flavista.onrender.com/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Failed to fetch order details.');
        }
      } catch (err) {
        setError('An error occurred while fetching order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const steps = [
    { status: 'Processing', label: 'Confirmed', icon: <IoReceiptOutline /> },
    { status: 'Preparing', label: 'Preparing', icon: <IoRestaurantOutline /> },
    { status: 'On the way', label: 'On the Way', icon: <IoBicycleOutline /> },
    { status: 'Delivered', label: 'Delivered', icon: <IoCheckmarkCircleOutline /> },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-red-500">{error}</div>;
  if (!order) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Order not found.</div>;

  const currentStepIndex = steps.findIndex(step => step.status === order.status);
  const progressPercentage = currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  // Mock Coordinates for Demo (In a real app, these would come from the backend/order data)
  const restaurantPos = [12.9716, 77.5946];
  const userPos = [12.9850, 77.6050];
  const riderPos = [12.9780, 77.6000]; // Simulated rider position

  // Custom Leaflet Icons using React Icons
  const createIcon = (icon, colorClass, animate = false) => {
    const html = renderToStaticMarkup(
      <div className={`relative flex items-center justify-center w-12 h-12`}>
        {animate && <div className={`absolute w-full h-full ${colorClass.replace('bg-', 'bg-')}/30 rounded-full animate-ping`}></div>}
        <div className={`relative z-10 w-10 h-10 ${colorClass} rounded-full border-2 border-white flex items-center justify-center shadow-lg text-white`}>
          {icon}
        </div>
      </div>
    );
    return L.divIcon({
      html,
      className: 'custom-marker-icon',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });
  };

  const riderIcon = createIcon(<IoBicycleOutline size={24} />, 'bg-orange-500', true);
  const destIcon = createIcon(<IoLocationSharp size={24} />, 'bg-blue-500');
  const restIcon = createIcon(<IoRestaurantOutline size={24} />, 'bg-gray-700');

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8 font-display text-white relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/myorders')} 
            className="text-white/60 hover:text-white flex items-center gap-2 transition-colors mb-8 group text-sm font-medium"
          >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to My Orders
          </button>

          {/* Order Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl rounded-full -mr-10 -mt-10"></div>
            
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg border border-white/20">
                {order.orderItems.length} Items
              </div>
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Current Order</p>
                  <h2 className="text-2xl font-bold text-white mb-1">{order.restaurantId?.name || 'Restaurant'}</h2>
                  <p className="text-white/50 text-sm">Order ID: <span className="font-mono text-white/70">#{order._id.slice(-8).toUpperCase()}</span></p>
                </div>
                <div className="text-center md:text-right bg-black/20 px-5 py-3 rounded-2xl border border-white/5">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Estimated Arrival</p>
                    <div className="flex items-center justify-center md:justify-end gap-2">
                      <IoTimeOutline className="text-orange-500 text-xl animate-pulse" />
                      <p className="text-2xl font-bold text-white">25-30 <span className="text-sm font-normal text-white/50">min</span></p>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tracking Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-8 backdrop-blur-xl shadow-xl"
          >
            <div className="relative w-full h-1.5 bg-white/10 rounded-full mt-2 mb-10 mx-auto max-w-[90%]">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                />
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const position = (index / (steps.length - 1)) * 100;
                  
                  return (
                    <div 
                      key={step.status} 
                      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${position}%`, transform: `translate(-50%, -50%)` }}
                    >
                        <div className="relative">
                          {isCurrent && (
                            <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 rounded-full animate-pulse"></div>
                          )}
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 relative
                            ${isCompleted ? 'bg-[#1a1a1a] border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-[#1a1a1a] border-white/10 text-white/20'}
                            ${isCurrent ? 'scale-110 border-orange-400 text-white bg-orange-500' : ''}
                            `}
                          >
                            <div className="text-xl">
                                {step.icon}
                            </div>
                          </div>
                        </div>
                        <p className={`absolute top-14 w-32 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isCompleted || isCurrent ? 'text-white' : 'text-white/30'}`}>
                          {step.label}
                        </p>
                    </div>
                  )
                })}
            </div>
          </motion.div>

          {/* Map and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Live Map Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 h-96 lg:h-auto bg-[#1a1a1a] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl group"
            >
                <MapContainer 
                  center={riderPos} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  className="z-0"
                >
                  {/* Dark Theme Tiles */}
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  <Marker position={restaurantPos} icon={restIcon} />
                  <Marker position={userPos} icon={destIcon} />
                  <Marker position={riderPos} icon={riderIcon}>
                    <Popup className="custom-popup">
                      <div className="text-center">
                        <p className="font-bold text-black">Rider is here</p>
                        <p className="text-xs text-gray-500">12 mins away</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  <Polyline 
                    positions={[restaurantPos, riderPos, userPos]} 
                    color="#f97316" 
                    weight={4} 
                    opacity={0.7} 
                    dashArray="10, 10" 
                  />
                </MapContainer>

                {/* Overlay Gradient for seamless blend */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0f0f]/90 pointer-events-none z-[400]"></div>

                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                  <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10">
                    <IoLocationSharp />
                  </button>
                </div>
            </motion.div>

            {/* Delivery Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Address Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
                <div>
                    <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <IoLocationSharp className="text-orange-500" /> Delivery Address
                    </h3>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                          <IoLocationSharp />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg leading-tight mb-1">Home</p>
                          <p className="text-white/60 text-sm leading-relaxed">
                            {order.shippingAddress.address}, {order.shippingAddress.city}<br/>
                            {order.shippingAddress.postalCode}
                          </p>
                        </div>
                    </div>
                </div>
              </div>

              {/* Driver Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-[2rem] p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden flex-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  
                  <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <IoShieldCheckmarkOutline /> Delivery Partner
                  </h3>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="relative">
                          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-orange-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-xl">Michael R.</p>
                            <div className="flex items-center gap-2 text-white/80 text-xs">
                              <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">4.9 ★</span>
                              <span>• 1.2k Deliveries</span>
                            </div>
                        </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-orange-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
                      <IoCallOutline className="text-lg" /> Call
                    </button>
                    <button className="flex-1 bg-black/20 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/30 transition-colors backdrop-blur-sm">
                      <IoChatbubbleEllipsesOutline className="text-lg" /> Message
                    </button>
                  </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
    