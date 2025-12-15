import React from 'react'
import { useState, useEffect } from 'react'
import Flavistalogo from '../logo/Flavistalogo';
import { IoCart,IoMenu,IoClose } from "react-icons/io5";
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';


const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          if(data){
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
  }, []);
    
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
            <motion.div variants={itemVariants}><Link to="Home" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className= 'menu-link' onClick={() => setMenuOpen(false)}>Home</Link></motion.div>
            <motion.div variants={itemVariants}><Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link' onClick={() => setMenuOpen(false)}>Explore</Link></motion.div>
            <motion.div variants={itemVariants}><Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link' onClick={() => setMenuOpen(false)}>About</Link></motion.div>
            <motion.div variants={itemVariants}><Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link' onClick={() => setMenuOpen(false)}>Restaurants</Link></motion.div>
            <motion.div variants={itemVariants}><Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link' onClick={() => setMenuOpen(false)}>Offers</Link></motion.div>
            <motion.div variants={itemVariants}><Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link' onClick={() => setMenuOpen(false)}>Help</Link></motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      <div className="flex items-center font-display md:gap-2 gap-1">
        <span className=''><Flavistalogo className="lg:w-16 lg:h-10 w-8 h-8 "/></span>
        <p className='brandname font-bold lg:text-3xl text-xl  text-text-dark'>Flavista</p>
      </div>
      
      <div className="menu" >

        <div className='lg:gap-8 gap-5 hidden md:flex lg:flex'>
          
          
          <Link to="Home" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className= 'menu-link'>Home</Link>
          <Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link'>Explore</Link>
          <Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link'>About</Link>
          <Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link'>Restaurants</Link>
          <Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link'>Offers</Link>
          <Link to="explore" smooth={true} duration={600} spy={true} offset={-80} activeClass='active' className='menu-link'>Help</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4"> 
        <IoCart className='lg:w-7 lg:h-7 h-7 w-6 cursor-pointer hover:text-[#FF6B6B] transition-all duration-300 hover:-rotate-6 '/>
        {!isLoggedIn ?(
        <button className='logbtn'>
          Login
        </button> ) : (
          <div className=' image-container w-10 h-10 border rounded-xl overflow-hidden '>
          <img src={user?.profileImageUrl || "profile.png"} alt="image" className='image'/>
          </div>
          )}
        
      </div>
    </div>
  )
}

export default Navbar
