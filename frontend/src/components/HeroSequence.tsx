import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSequenceProps {
  onComplete: () => void;
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | null>(3);
  const [phase, setPhase] = useState<'countdown' | 'hero'>('countdown');

  useEffect(() => {
    if (phase === 'countdown') {
      if (count === null) return;
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('hero');
      }
    } else if (phase === 'hero') {
      const timer = setTimeout(() => onComplete(), 3800);
      return () => clearTimeout(timer);
    }
  }, [count, phase, onComplete]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-primary overflow-hidden">
      {/* Void Black base */}
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Aurora wave layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Wave 1 — Aurora Green */}
        <motion.div
          className="absolute -bottom-32 left-[-20%] w-[140%] h-[55%] rounded-[50%] blur-[80px]"
          style={{ background: 'rgba(0,245,160,0.12)' }}
          animate={{ x: [0, 60, -40, 0], y: [0, -20, 10, 0], scaleX: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Wave 2 — Electric Blue */}
        <motion.div
          className="absolute -top-20 right-[-15%] w-[120%] h-[50%] rounded-[50%] blur-[100px]"
          style={{ background: 'rgba(0,217,245,0.10)' }}
          animate={{ x: [0, -50, 30, 0], y: [0, 25, -15, 0], scaleX: [1, 0.95, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Wave 3 — Lava Coral accent */}
        <motion.div
          className="absolute top-[30%] left-[10%] w-[80%] h-[40%] rounded-[50%] blur-[120px]"
          style={{ background: 'rgba(255,107,107,0.07)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Violet accent streak */}
        <motion.div
          className="absolute top-[15%] right-[20%] w-[40%] h-[25%] rounded-full blur-[60px]"
          style={{ background: 'rgba(167,139,250,0.06)' }}
          animate={{ opacity: [0.06, 0.15, 0.06], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1.5}px`,
              height: `${Math.random() * 3 + 1.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#00F5A0', '#00D9F5', '#FF6B6B', '#A78BFA', '#ffffff'][i % 5],
              opacity: Math.random() * 0.6 + 0.3,
            }}
            animate={{ y: [0, -(Math.random() * 30 + 15), 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: Math.random() * 3 + 3, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
          />
        ))}

        {/* Eclipse circle — large background ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.04]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/[0.06]"
          animate={{ scale: [1, 1.04, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Light ribbon */}
      <motion.div
        className="absolute top-0 left-[-30%] w-[80%] h-[3px] blur-sm"
        style={{ background: 'linear-gradient(90deg, transparent, #00F5A0, #00D9F5, transparent)' }}
        animate={{ x: ['0%', '80%', '0%'], opacity: [0, 0.8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[-20%] w-[70%] h-[2px] blur-sm"
        style={{ background: 'linear-gradient(90deg, transparent, #FF6B6B, #A78BFA, transparent)' }}
        animate={{ x: ['0%', '-100%', '0%'], opacity: [0, 0.6, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase === 'countdown' ? (
          <motion.div
            key="countdown"
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(12px)' }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm md:text-base tracking-[0.35em] uppercase mb-5 font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#00D9F5' }}
            >
              Launching Subscription Universe
            </div>
            <motion.div
              key={count}
              initial={{ opacity: 0, y: 30, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.3 }}
              transition={{ type: 'spring', damping: 12 }}
              className="text-9xl font-black text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 45%, #FF6B6B 75%, #A78BFA 100%)', fontFamily: "'Outfit', sans-serif" }}
            >
              {count}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            className="flex flex-col items-center z-10 text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* App name */}
            <motion.div
              className="text-xs md:text-sm tracking-[0.5em] uppercase font-bold mb-6"
              style={{ color: '#00F5A0', fontFamily: "'Space Grotesk', sans-serif" }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              SUBNOVA &nbsp;·&nbsp; Aurora Eclipse
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent leading-tight"
              style={{
                backgroundImage: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 45%, #FF6B6B 75%, #A78BFA 100%)',
                backgroundSize: '200% auto',
                fontFamily: "'Outfit', sans-serif",
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 0.2 }}
            >
              Save More.
            </motion.h1>
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-text-main mt-1 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 0.35 }}
            >
              Watch More.
            </motion.h1>
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-text-main mt-1 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 0.5 }}
            >
              Learn More.
            </motion.h1>

            <motion.p
              className="mt-7 text-base md:text-lg max-w-lg leading-relaxed"
              style={{ color: '#94A3B8', fontFamily: "'Space Grotesk', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Affordable subscription bundles in one place. Explore the aurora of entertainment, education, and tools.
            </motion.p>

            {/* Aurora signature line */}
            <motion.div
              className="mt-8 h-0.5 w-32 rounded-full"
              style={{ background: 'linear-gradient(90deg, #00F5A0, #00D9F5, #FF6B6B, #A78BFA)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 128, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
