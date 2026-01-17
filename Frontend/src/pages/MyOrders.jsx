import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { IoBagHandle, IoTime, IoCheckmarkCircle, IoCloseCircle, IoArrowBack, IoReceiptOutline, IoRestaurant, IoRepeat, IoChevronForward } from 'react-icons/io5';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://flavista.onrender.com/api/orders/myorders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
            // Try to parse error message from server
            let errorMessage = 'Failed to fetch orders';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Response wasn't JSON (e.g. 500 HTML page)
                errorMessage = `Server Error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`https://flavista.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        ));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel order');
        console.error('Cancel failed:', data);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Active') return ['Processing', 'Preparing', 'On the way'].includes(order.status);
    if (activeTab === 'Completed') return order.status === 'Delivered';
    if (activeTab === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  const tabs = ['Active', 'Completed', 'Cancelled'];

  if (loading) return <Loader />;

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="backgroundimage min-h-screen bg-[#0f0f0f] p-4 md:p-10 font-display text-white relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
            <button 
            onClick={() => navigate('/')} 
            className="text-white/50 hover:text-white flex items-center gap-2 transition-colors mb-8 group text-sm font-medium"
            >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">My Orders</span>
              </h1>
              
              {/* Tabs */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-2 rounded-lg text-sm font-bold transition-all z-10 ${activeTab === tab ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                  >
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20 -z-10" />
                    )}
                    {tab}
                  </button>
                ))}
              </div>
            </div>


            {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-center">
                <p className="font-bold">Error loading orders</p>
                <p className="text-sm opacity-80">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                    Retry
                </button>
            </div>
            )}

            {!loading && !error && filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IoReceiptOutline className="text-4xl text-white/20" />
                </div>
                <h2 className="text-2xl font-bold text-white/60">No {activeTab.toLowerCase()} orders</h2>
                <p className="text-white/40 mt-2 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Discover delicious food near you!</p>
                <button 
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-xl font-bold transition-all"
                >
                Start Ordering
                </button>
            </div>
            ) : (
            <motion.div 
              className="grid gap-6"
              layout
            >
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                <motion.div 
                  key={order._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Restaurant Image & Info */}
                        <div className="flex gap-5 flex-1">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-black/30 border border-white/10 flex-shrink-0 relative">
                                {order.restaurantId?.image ? (
                                  <img src={order.restaurantId.image} alt={order.restaurantId.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <IoRestaurant className="text-3xl" />
                                  </div>
                                )}
                                {/* Status Overlay on Image for Mobile */}
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center md:hidden backdrop-blur-[1px]`}>
                                   {order.status === 'Delivered' ? <IoCheckmarkCircle className="text-green-500 text-2xl" /> : 
                                    order.status === 'Cancelled' ? <IoCloseCircle className="text-red-500 text-2xl" /> : 
                                    <IoTime className="text-orange-500 text-2xl animate-pulse" />}
                                </div>
                            </div>
                            
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-bold text-xl text-white">{order.restaurantId?.name || 'Unknown Restaurant'}</h3>
                                  <span className={`hidden md:flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                      order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                      order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                      'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                  }`}>
                                      {order.status}
                                  </span>
                                </div>
                                <p className="text-white/40 text-xs mb-3 font-mono">ORDER #{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                
                                {/* Items Summary */}
                                <div className="text-sm text-white/70 line-clamp-1">
                                    {order.orderItems.map(i => `${i.qty}x ${i.name}`).join(", ")}
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:pl-8 md:border-l border-white/5 min-w-[160px]">
                            <div className="text-right hidden md:block">
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-white">₹{order.totalPrice}</p>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                {order.status === 'Delivered' ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${order.restaurantId?._id}`); }}
                                        className="w-full px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <IoRepeat className="text-lg" /> Reorder
                                    </button>
                                ) : order.status === 'Cancelled' ? (
                                    <button 
                                        disabled
                                        className="w-full px-5 py-2.5 bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                                    >
                                        Cancelled
                                    </button>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/track-order/${order._id}`); }}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Track <IoArrowBack className="rotate-180" />
                                    </button>
                                )}
                                
                                {order.status === 'Processing' && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id); }}
                                        className="w-full px-5 py-2 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
