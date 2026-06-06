"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DISHES = [
  { id: 1, name: "Biryani 1", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" },
  { id: 2, name: "Biryani 2", image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=800&q=80" },
  { id: 3, name: "Biryani 3", image: "https://images.unsplash.com/photo-1543340904-0b1d843bfcda?w=800&q=80" },
  { id: 4, name: "Biryani 4", image: "https://images.unsplash.com/photo-1631515243349-e0cb4c73f4a2?w=800&q=80" },
];

export default function ArcConveyor() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % DISHES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getDishState = (index: number) => {
    const diff = (index - activeIndex + DISHES.length) % DISHES.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === DISHES.length - 1) return 'left';
    return 'exit';
  };

  const variants = {
    left: { x: -380, y: -250, scale: 0.6, opacity: 1, zIndex: 10 },
    center: { x: 0, y: 50, scale: 1.4, opacity: 1, zIndex: 30 },
    right: { x: 380, y: -250, scale: 0.6, opacity: 1, zIndex: 10 },
    exit: { x: 450, y: -300, scale: 0.3, opacity: 0, zIndex: 0 },
    enter: { x: -450, y: -300, scale: 0.3, opacity: 0, zIndex: 0 }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div 
        className="absolute z-0 rounded-full border-[60px] border-[#9c6a38] shadow-[inset_0px_0px_50px_rgba(0,0,0,0.8)] opacity-90"
        style={{ 
          width: '800px', height: '800px', 
          top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
        }}
      />

      <AnimatePresence>
        {DISHES.map((dish, i) => {
          const state = getDishState(i);
          return (
            <motion.div
              key={dish.id}
              initial="enter"
              animate={state}
              exit="exit"
              variants={variants}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
              className="absolute w-64 h-64 rounded-full overflow-hidden shadow-2xl border-[6px] border-[#101010] bg-black will-change-transform"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover object-center scale-110"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
