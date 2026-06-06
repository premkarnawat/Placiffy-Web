"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronRight, HelpCircle } from 'lucide-react';
import { GlassCard } from '../glass-card';

export default function DashboardTab() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setUploadProgress(20);
      
      // Simulate progress uploads
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return null;
          if (prev >= 100) {
            clearInterval(timer);
            setAiInsight("Based on your profile, you are in the top 6% of candidates for Senior Product roles at Fortune 500 tech firms.");
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Application Dashboard</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">Step 1: Resume Verification & Intelligence Analysis</p>
        </div>
        
        {/* User avatar mockup */}
        <div className="w-10 h-10 rounded-full border border-zinc-200 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload card (Col span 7) */}
        <div className="lg:col-span-7">
          <GlassCard className="border border-zinc-200 bg-white p-10 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-[#E6F0FF] text-[#0052CC] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-800">Upload your Resume</h3>
                <p className="text-xs text-zinc-450 mt-1 max-w-sm mx-auto leading-relaxed">
                  Drag and drop your PDF or DOCX file here to begin the PLACIFY intelligent matching process.
                </p>
              </div>

              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <button type="button" className="bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl shadow-md transition-colors duration-300">
                  Browse Files
                </button>
              </div>

              {fileName && (
                <span className="text-xs font-bold text-zinc-600 bg-zinc-50 border border-zinc-150 px-3 py-1 rounded">
                  {fileName}
                </span>
              )}
            </div>

            {uploadProgress !== null && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-[#0052CC]"
                />
              </div>
            )}
          </GlassCard>
        </div>

        {/* Current Step & AI Insight (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Current Step */}
          <GlassCard className="border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052CC] shrink-0">
                {/* Minimal Hourglass SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 2h14M5 22h14M19 2v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7V2M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">CURRENT STEP</span>
                <h4 className="text-lg font-bold text-zinc-900 tracking-tight mt-0.5">Resume Analysis</h4>
                
                {/* 4 stage steps */}
                <div className="flex gap-1 mt-2.5">
                  <div className="flex-1 h-1 bg-[#0052CC] rounded-full" />
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full" />
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full" />
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Insight */}
          <GlassCard className="border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] bg-[#E6FFFA] border border-[#B2F5EA] text-[#00A3C4] px-2 py-0.5 rounded font-bold uppercase tracking-wider">AI INSIGHT</span>
              <HelpCircle className="w-4 h-4 text-zinc-300 hover:text-zinc-400 cursor-pointer" />
            </div>
            
            <p className="text-sm font-medium italic text-zinc-700 leading-relaxed font-sans">
              "{aiInsight || "Please upload your resume to generate immediate AI-guided career scoring models."}"
            </p>

            <a href="#passport" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052CC] hover:underline mt-5">
              Explore Detailed Analysis <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </GlassCard>

        </div>

      </div>

      {/* Market Benchmarking (Col span 12) */}
      <GlassCard className="border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Market Benchmarking</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-xl">
                We've compared your resume against 12,000+ similar roles filled in the last 180 days. Your current experience trajectory aligns perfectly with Principal-level transitions.
              </p>
            </div>

            <div className="flex gap-8 pt-4 border-t border-zinc-100">
              <div>
                <div className="text-2xl font-bold text-zinc-900 font-sans">$165k - $190k</div>
                <div className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest mt-1">EST. MARKET VALUATION</div>
              </div>
              <div className="border-l border-zinc-200 pl-8">
                <div className="text-2xl font-bold text-zinc-900 font-sans">Elite</div>
                <div className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest mt-1">PEER RANKING</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            {/* Hologram Laptop SVG Graphics matching Image 1 */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full text-zinc-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glowing mesh background */}
                <circle cx="50" cy="50" r="30" fill="url(#orb-grad)" filter="blur(10px)" opacity="0.3" />
                
                {/* 3D Laptop Perspective */}
                {/* Screen frame */}
                <path d="M25,25 L75,25 L85,65 L15,65 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                {/* Inner Screen */}
                <path d="M27,27 L73,27 L82,63 L18,63 Z" fill="#09090b" />
                
                {/* Analytical charts on screen */}
                <path d="M25,55 L35,45 L45,52 L55,38 L65,48 L75,32" stroke="#00d2ff" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M25,58 L35,50 L45,55 L55,42 L65,51 L75,38" stroke="#0052cc" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
                
                {/* Laptop keyboard base */}
                <path d="M15,65 L85,65 L95,78 L5,78 Z" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
                {/* Hologram glow projections */}
                <path d="M5,78 Q50,90 95,78" stroke="#0052cc" strokeWidth="0.8" opacity="0.5" />
                
                <defs>
                  <linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#0052cc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

        </div>
      </GlassCard>

    </div>
  );
}
