import React from 'react'
import { useState, useEffect } from 'react'
import Flavistalogo from '../logo/Flavistalogo';
import { IoCart, IoMenu, IoClose, IoPerson, IoLogOut, IoBagHandle, IoSettings } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-scroll';




const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://flavista.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          if(data && data.email){
            setIsLoggedIn(true);
            setUser(data);
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
          }

        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        });
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
  };

  useEffect(() => {
    fetchUserData();

    // Listen for updates from Profile page
    window.addEventListener('userUpdated', fetchUserData);
    
    return () => {
      window.removeEventListener('userUpdated', fetchUserData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setUserMenuOpen(false);
    navigate('/login');
  };
    
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://flavista.onrender.com/api/images/${path}`;
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className='bg-surface-dark w-full h-16 flex items-center justify-between lg:px-10 px-5 text-text-dark font-display text-xl shadow-soft-glow-primary '>
      <div className='md:hidden'>
        {menuOpen ? 
        <IoClose className='menu-icon w-7 h-7 cursor-pointer' onClick={() => setMenuOpen(false)}/> 
        :<IoMenu className='menu-icon w-7 h-7 cursor-pointer' onClick={() => setMenuOpen(true)}/>}
        <AnimatePresence>
        {menuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className='flex flex-col gap-6 items-center justify-center bg-white/10 backdrop-blur-xl border border-white/10  absolute top-16 left-0 w-full px-5 py-4 shadow-lg rounded-md z-10'
          >
            <motion.div variants={itemVariants}>
              {location.pathname === '/' ? (
                <Link to="Home" smooth={true} duration={700} spy={true} offset={-80} activeClass='text-orange-500' className='menu-link' onClick={() => setMenuOpen(false)}>Home</Link>
              ) : (
                <button onClick={() => handleNavClick('/')} className={`menu-link ${location.pathname === '/' ? 'text-orange-500' : ''}`}>Home</button>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              {location.pathname === '/' ? (
                <Link to="explore" smooth={true} duration={700} spy={true} offset={-80} activeClass='text-orange-500' className='menu-link' onClick={() => setMenuOpen(false)}>Explore</Link>
              ) : (
                <button onClick={() => handleNavClick('/explore')} className={`menu-link ${location.pathname === '/explore' ? 'text-orange-500' : ''}`}>Explore</button>
              )}
            </motion.div>
            <motion.div variants={itemVariants}><button onClick={() => handleNavClick('/restaurants')} className={`menu-link ${location.pathname === '/restaurants' ? 'text-orange-500' : ''}`}>Restaurants</button></motion.div>
            <motion.div variants={itemVariants}><button onClick={() => handleNavClick('/offers')} className={`menu-link ${location.pathname === '/offers' ? 'text-orange-500' : ''}`}>Offers</button></motion.div>
            {isLoggedIn && <motion.div variants={itemVariants}><button onClick={() => handleNavClick('/myorders')} className={`menu-link ${location.pathname === '/myorders' ? 'text-orange-500' : ''}`}>My Orders</button></motion.div>}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      <div className="flex items-center font-display md:gap-2 gap-1 cursor-pointer" onClick={() => navigate('/')}>
        <span className=''><Flavistalogo className="lg:w-16 lg:h-10 w-8 h-8 "/></span>
        <p className='brandname font-bold lg:text-3xl text-xl  text-text-dark'>Flavista</p>
      </div>
      
      <div className="menu" >

        <div className='lg:gap-8 gap-5 hidden md:flex lg:flex'>
          {location.pathname === '/' ? (
            <Link to="Home" smooth={true} duration={500} spy={true} offset={-80} activeClass='text-orange-500 font-bold' className='menu-link hover:text-orange-500 transition-colors cursor-pointer'>Home</Link>
          ) : (
            <button onClick={() => navigate('/')} className={`menu-link hover:text-orange-500 transition-colors ${location.pathname === '/' ? 'text-orange-500 font-bold' : ''}`}>Home</button>
          )}
          {location.pathname === '/' ? (
            <Link to="explore" smooth={true} duration={500} spy={true} offset={-80} activeClass='text-orange-500 font-bold' className='menu-link hover:text-orange-500 transition-colors cursor-pointer'>Explore</Link>
          ) : (
            <button onClick={() => navigate('/explore')} className={`menu-link hover:text-orange-500 transition-colors ${location.pathname === '/explore' ? 'text-orange-500 font-bold' : ''}`}>Explore</button>
          )}
          <button onClick={() => navigate('/restaurants')} className={`menu-link hover:text-orange-500 transition-colors ${location.pathname === '/restaurants' ? 'text-orange-500 font-bold' : ''}`}>Restaurants</button>
          <button onClick={() => navigate('/offers')} className={`menu-link hover:text-orange-500 transition-colors ${location.pathname === '/offers' ? 'text-orange-500 font-bold' : ''}`}>Offers</button>
          {isLoggedIn && <button onClick={() => navigate('/myorders')} className={`menu-link hover:text-orange-500 transition-colors ${location.pathname === '/myorders' ? 'text-orange-500 font-bold' : ''}`}>My Orders</button>}
        </div>
      </div>
      
      <div className="flex items-center gap-4"> 
        <button onClick={()=> navigate("/cart")}><IoCart className='lg:w-7 lg:h-7 h-7 w-6 cursor-pointer hover:text-[#FF6B6B] transition-all duration-300 hover:-rotate-6 '/></button>
        
        {!isLoggedIn ?(
        <button className='logbtn' onClick={()=> navigate("/login")}>
          Login
        </button> ) : (
          <div className='relative'>
          <div 
            className='image-container w-8 h-8 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all'
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
          {user?.profileImageUrl ? (
            <img src={getImageUrl(user.profileImageUrl)} alt="user" className='w-full h-full object-cover'/>
          ) : (
            <div className='bg-gradient-to-br from-orange-400 to-orange-600 w-full h-full flex justify-center items-center text-lg font-bold text-white font-display cursor-pointer'>{user?.username?.charAt(0)?.toUpperCase()}</div>
          )}
          </div>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-56 bg-white/10 border border-white/10 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-sm overflow-hidden "
              >
                <div className="px-4 py-3 border-b border-white/10 mb-2">
                  <p className="text-sm font-bold text-white">{user?.username || 'User'}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>

                <div className="flex flex-col">
                  <button onClick={() => { navigate('/profile'); setUserMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                    <IoPerson /> Profile
                  </button>
                  <button onClick={() => { navigate('/MyOrders'); setUserMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                    <IoBagHandle /> My Orders
                  </button>
                  <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                    <IoSettings /> Settings
                  </button>
                  
                  <div className="h-px bg-white/10 my-2"></div>
                  
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <IoLogOut /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
          )}
        
      </div>
    </div>
  )
}

export default Navbar
