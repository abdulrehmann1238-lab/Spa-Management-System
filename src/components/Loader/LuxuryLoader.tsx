"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function LuxuryLoader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter from 0 to 100 over 3.2 seconds
    const duration = 3200;
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small pause at 100%
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background-light flex flex-col items-center justify-between p-12 overflow-hidden select-none">
      
      {/* Background organic shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[380px] h-[380px] bg-gradient-to-tr from-sage-100 to-gold/15 rounded-full filter blur-3xl animate-morph" />
      </div>

      {/* Top indicator: location info */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-[10px] tracking-[0.25em] text-charcoal-muted uppercase font-display"
      >
        Wellness Resorts & Retreats
      </motion.div>

      {/* Center: Morphing Logo & Brand Reveal */}
      <div className="relative flex flex-col items-center space-y-8 z-10">
        
        {/* Animated Leaf/Lotus Emblem */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-20 w-20 flex items-center justify-center"
        >
          {/* Morphing ring background */}
          <div className="absolute inset-0 bg-sage-50 border border-sage-200/50 rounded-full animate-morph" />
          
          <svg className="h-10 w-10 text-sage-600 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0-17.25a9 9 0 0 1 9 9M12 3a9 9 0 0 0-9 9m9-9c-1.65 0-3 1.35-3 3s1.35 3 3 3m0-6c1.65 0 3 1.35 3 3s-1.35 3-3 3" />
          </svg>
        </motion.div>

        {/* Brand Name with letter spacing reveal */}
        <div className="space-y-2 text-center">
          <motion.h1 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-display font-light text-charcoal uppercase"
          >
            The Sanctuary
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-[10px] tracking-[0.2em] text-charcoal-muted uppercase font-sans font-light"
          >
            Spa Management Platform
          </motion.p>
        </div>
      </div>

      {/* Bottom: Progress percent */}
      <div className="flex flex-col items-center space-y-4 z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-mono font-medium text-sage-800"
        >
          {Math.round(progress)}%
        </motion.div>
        
        {/* Slim premium progress track */}
        <div className="w-48 h-[2px] bg-beige-100 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-sage-600 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>

    </div>
  );
}
