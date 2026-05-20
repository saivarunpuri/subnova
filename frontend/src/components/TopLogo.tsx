import React from 'react';
import { motion } from 'framer-motion';

export const TopLogo = () => {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.5 }}
      className="absolute top-3 left-3 sm:top-6 sm:left-8 z-30 pointer-events-auto flex items-center gap-2.5 sm:gap-3.5 backdrop-blur-2xl px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl border border-white/8 cursor-default select-none group transition-all duration-500 hover:border-white/15"
      style={{
        background: 'rgba(16,23,42,0.6)',
        boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0,245,160,0.08)',
      }}
    >
      {/* Aurora Reactor Core — orbital rings + pulsing core */}
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
        {/* Outer orbit — aurora green */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{ border: '1.5px dashed rgba(0,245,160,0.5)' }}
        />
        {/* Inner orbit — electric blue */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className="absolute inset-1 rounded-full"
          style={{ border: '1px solid rgba(0,217,245,0.4)' }}
        />
        {/* Core pulse — aurora gradient orb */}
        <motion.div
          animate={{ scale: [1, 1.25, 0.9, 1], opacity: [0.9, 1, 0.7, 0.9] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #00F5A0, #00D9F5)',
            boxShadow: '0 0 12px rgba(0,245,160,0.9), 0 0 24px rgba(0,217,245,0.4)',
          }}
        />
        {/* Center ping */}
        <div className="w-1.5 h-1.5 rounded-full bg-white absolute animate-ping opacity-60" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <h1
          className="text-xs sm:text-sm md:text-base font-black tracking-widest bg-clip-text text-transparent transition-all duration-500 sm:group-hover:tracking-[0.28em]"
          style={{
            backgroundImage: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 50%, #F8FAFC 100%)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          SUBNOVA
        </h1>
        <span
          className="text-[6.5px] sm:text-[7.5px] font-extrabold tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: '#00D9F5', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Aurora Eclipse
        </span>
      </div>
    </motion.div>
  );
};
