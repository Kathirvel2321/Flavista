import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { IoGift, IoSparkles, IoCopy, IoCheckmark } from 'react-icons/io5';
import { motion } from 'framer-motion';

const offersData = [
  {
    code: 'FLAVISTA50',
    title: '50% OFF on your first order',
    description: 'Get a flat 50% discount. Min order ₹200. Max discount ₹100.',
    bgColor: 'from-orange-500 to-amber-500',
  },
  {
    code: 'WEEKENDTREAT',
    title: 'Flat ₹120 OFF on weekends',
    description: 'Min order ₹399. Valid only on Saturdays & Sundays.',
    bgColor: 'from-purple-500 to-indigo-500',
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Enjoy free delivery on orders above ₹200.',
    bgColor: 'from-green-500 to-emerald-500',
  },
  {
    code: 'COMBO20',
    title: '20% OFF on Big Orders',
    description: 'Get 20% off on orders above ₹500.',
    bgColor: 'from-red-500 to-rose-500',
  },
];

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="min-h-screen bg-background-dark p-4 md:p-10 font-display text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <IoSparkles className="text-5xl text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Exclusive Offers</h1>
            <p className="text-white/60 text-lg">
              Grab these amazing deals before they're gone!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offersData.map((offer, index) => (
              <motion.div
                key={offer.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${offer.bgColor} p-6 rounded-3xl shadow-lg relative overflow-hidden`}
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
                  <p className="text-white/80 text-sm mb-6 h-10">{offer.description}</p>
                  <div className="flex items-center justify-between bg-black/20 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <span className="font-mono text-lg font-bold tracking-widest text-amber-300">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors flex items-center gap-2"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <IoCheckmark /> Copied
                        </>
                      ) : (
                        <>
                          <IoCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Offers;