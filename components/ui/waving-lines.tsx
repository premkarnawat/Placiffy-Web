"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function WavingLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.22] select-none z-0">
      <svg
        className="w-full h-full min-h-[750px]"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Fill wave */}
        <motion.path
          d="M0,200 C360,320 720,100 1080,320 C1260,420 1380,250 1440,200 L1440,800 L0,800 Z"
          fill="url(#wave-grad-1)"
          animate={{
            d: [
              "M0,200 C360,320 720,100 1080,320 C1260,420 1380,250 1440,200 L1440,800 L0,800 Z",
              "M0,240 C400,160 800,280 1100,140 C1280,60 1380,220 1440,280 L1440,800 L0,800 Z",
              "M0,200 C360,320 720,100 1080,320 C1260,420 1380,250 1440,200 L1440,800 L0,800 Z"
            ]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dynamic Line 1 */}
        <motion.path
          d="M0,300 C300,180 600,420 900,300 C1200,180 1350,380 1440,400"
          stroke="url(#line-grad-1)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M0,300 C300,180 600,420 900,300 C1200,180 1350,380 1440,400",
              "M0,340 C400,450 700,200 1000,320 C1200,400 1350,220 1440,200",
              "M0,300 C300,180 600,420 900,300 C1200,180 1350,380 1440,400"
            ]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dynamic Line 2 */}
        <motion.path
          d="M0,150 C400,400 800,180 1200,350 C1320,400 1400,250 1440,180"
          stroke="url(#line-grad-2)"
          strokeWidth="1"
          animate={{
            d: [
              "M0,150 C400,400 800,180 1200,350 C1320,400 1400,250 1440,180",
              "M0,200 C350,120 750,320 1150,200 C1280,160 1380,300 1440,280",
              "M0,150 C400,400 800,180 1200,350 C1320,400 1400,250 1440,180"
            ]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Grid Overlay Line */}
        <motion.path
          d="M0,450 Q360,350 720,450 T1440,450"
          stroke="url(#line-grad-1)"
          strokeWidth="1.2"
          animate={{
            d: [
              "M0,450 Q360,350 720,450 T1440,450",
              "M0,420 Q360,490 720,420 T1440,420",
              "M0,450 Q360,350 720,450 T1440,450"
            ]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(240, 237, 230, 0.2)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.7)" />
            <stop offset="100%" stopColor="rgba(245, 243, 238, 0.3)" />
          </linearGradient>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 138, 93, 0.05)" />
            <stop offset="50%" stopColor="rgba(168, 138, 93, 0.35)" />
            <stop offset="100%" stopColor="rgba(24, 24, 27, 0.15)" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(24, 24, 27, 0.02)" />
            <stop offset="30%" stopColor="rgba(168, 138, 93, 0.2)" />
            <stop offset="70%" stopColor="rgba(24, 24, 27, 0.25)" />
            <stop offset="100%" stopColor="rgba(168, 138, 93, 0.05)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
