import React from 'react';
import Flavistalogo from '../logo/Flavistalogo';

const Loader = ({ fullScreen = true }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background-dark"
    : "w-full h-64 flex items-center justify-center";

  return (
    <>
    <style>{`
        .spinreverse{
            animation: spin-reverse 1s linear infinite;
            transform-origin: center;

        }
        @keyframes spin-reverse {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
        }  `} 

    </style>
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Decorative background blur */}
        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full w-32 h-32 animate-pulse"></div>

        {/* Spinning Rings */}
        <div className="w-24 h-24 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin absolute"></div>
        <div className="spinreverse w-16 h-16 border-4 border-white/5 border-b-orange-400 rounded-full animate-spin-reverse absolute"></div>

        {/* Logo */}
        <div className="relative z-10 p-4">
          <Flavistalogo className="w-10 h-10 text-white" />
        </div>
        
        {/* Text */}
        <div className="absolute -bottom-16 w-max text-center">
          <p className="text-white/80 font-display text-xs tracking-[0.3em] uppercase animate-pulse">
            Curating Taste
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Loader;