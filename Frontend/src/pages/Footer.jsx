import React from 'react';

import { Link } from 'react-scroll';
import { IoFastFood, IoLocation, IoCall, IoMail, IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin, IoArrowForward, IoHeart } from 'react-icons/io5';
import Flavistalogo from '../logo/Flavistalogo';
const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-12 md:pt-20 pb-8 md:pb-10 font-display border-t border-white/10 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none opacity-50 md:opacity-100"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none opacity-50 md:opacity-100"></div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-3 text-2xl font-bold">
              
                <Flavistalogo className="w-10 h-10"/>
              
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 font-bold text-3xl">Flavista</span>
            </div>
            <p className="text-white/50 leading-relaxed text-sm mx-auto md:mx-0 max-w-sm md:max-w-none">
              Delivering happiness to your doorstep. Experience the finest cuisines with our premium delivery service.
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              {[IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
              <span className="w-8 h-1 bg-orange-500 rounded-full"></span> Quick Links
            </h3>
            <ul className="space-y-3 cursor-pointer">
              {[
                { name: 'Home', path: '/' },
                { name: 'Explore', path: '/explore' },
                { name: 'Restaurants', path: '/restaurants' },
                { name: 'Offers', path: '/offers' },
                { name: 'My Orders', path: '/myorders' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.name } smooth={true} duration={500} spy={true} offset={-80} activeClass='text-orange-500' className="text-white/50 hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-2 group text-sm">
                    <IoArrowForward className="text-orange-500/0 -ml-4 group-hover:ml-0 group-hover:text-orange-500 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
              <span className="w-8 h-1 bg-orange-500 rounded-full"></span> Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start gap-4 text-white/60 text-sm group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0">
                  <IoLocation />
                </div>
                <span className="mt-1 text-left md:text-left">123 Flavor Street, Foodie Town, <br />India, Mumbai 400037</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4 text-white/60 text-sm group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0">
                  <IoCall />
                </div>
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4 text-white/60 text-sm group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0">
                  <IoMail />
                </div>
                <span>support@flavista.com</span>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-white/40 text-sm flex items-center gap-1 justify-center md:justify-start">
            © 2024 Flavista. Made with <IoHeart className="text-red-500 animate-pulse" /> by Flavista Team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;