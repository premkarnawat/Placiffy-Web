"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Share2, Download, CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from '../glass-card';

export default function PassportTab() {
  const verifications = [
    { type: "Identity (KYC)", status: "SECURE", color: "text-[#0052CC]" },
    { type: "Past Employment", status: "VERIFIED", color: "text-[#0052CC]" },
    { type: "Academic Credentials", status: "VERIFIED", color: "text-[#0052CC]" },
    { type: "Criminal Records", status: "PENDING", color: "text-zinc-400" }
  ];

  return (
    <div className="space-y-8 text-left relative">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Digital Identity Passport</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1 font-sans">Authenticated recruitment credentials for Marcus Thorne.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left card (Col span 5) */}
        <div className="lg:col-span-5">
          <GlassCard className="border border-zinc-200 bg-white p-8 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden" glow>
            
            {/* Avatar block with certified badge */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl border border-zinc-200 overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop" 
                  alt="Marcus Thorne" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center shadow">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-zinc-900">Marcus Thorne</h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0052CC] mt-1.5 block">PRINCIPAL DATA ARCHITECT</span>
            
            <div className="flex gap-4 items-center justify-center mt-4">
              <span className="text-[9px] bg-blue-50 border border-blue-100 text-[#0052CC] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">STATUS: CERTIFIED</span>
              <span className="text-[9px] bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono px-2 py-0.5 rounded">ID: PLC-9942-X</span>
            </div>

            <button className="w-full bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all duration-300 mt-8 flex items-center justify-center gap-1.5 shadow-md">
              <Download className="w-4 h-4" /> Download Digital Passport
            </button>
          </GlassCard>
        </div>

        {/* Middle & Right cards (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Middle circular metrics and fraud risk */}
          <div className="grid grid-cols-3 gap-4">
            
            <GlassCard className="border border-zinc-200 bg-white p-4 flex flex-col items-center justify-center text-center shadow-sm h-36">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f4f4f5" strokeWidth="5" fill="transparent" />
                  <motion.circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    stroke="#0052cc" 
                    strokeWidth="5" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 26}
                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 0.98) }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
                <div className="absolute text-sm font-bold text-zinc-900">98%</div>
              </div>
              <span className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider mt-3">ATS MATCH</span>
            </GlassCard>

            <GlassCard className="border border-zinc-200 bg-white p-4 flex flex-col items-center justify-center text-center shadow-sm h-36">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f4f4f5" strokeWidth="5" fill="transparent" />
                  <motion.circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    stroke="#0052cc" 
                    strokeWidth="5" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 26}
                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 0.92) }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
                <div className="absolute text-sm font-bold text-zinc-900">9.2</div>
              </div>
              <span className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider mt-3">TRUST SCORE</span>
            </GlassCard>

            <GlassCard className="border border-zinc-200 bg-white p-4 flex flex-col items-center justify-center text-center shadow-sm h-36">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052cc]">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase mt-2.5">LOW RISK</h4>
              <span className="text-[7px] text-zinc-450 uppercase font-bold tracking-wider mt-1">FRAUD RISK</span>
            </GlassCard>

          </div>

          {/* AI Intelligence and Verification logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI intelligence */}
            <GlassCard className="border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]" />
                <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-450">AI HIRING INTELLIGENCE</span>
              </div>
              
              <p className="text-xs text-zinc-500 leading-relaxed">
                "Thorne exhibits an exceptional technical trajectory. His verification score is in the top 0.2% of global data architects. The high ATS match suggests perfect alignment with the Scalable Systems requirement."
              </p>

              <div className="flex gap-4 pt-3 border-t border-zinc-100">
                <div>
                  <div className="text-sm font-bold text-zinc-800">12ms</div>
                  <div className="text-[8px] text-zinc-450 uppercase font-bold">LATENCY</div>
                </div>
                <div className="border-l border-zinc-150 pl-4">
                  <div className="text-sm font-bold text-zinc-800">99.8%</div>
                  <div className="text-[8px] text-zinc-450 uppercase font-bold">RELIABILITY</div>
                </div>
              </div>
            </GlassCard>

            {/* Verification logs */}
            <GlassCard className="border border-zinc-200 bg-white p-5 shadow-sm">
              <h4 className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-3">VERIFICATION LOG</h4>
              <div className="space-y-3.5">
                {verifications.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-semibold">{item.type}</span>
                    <span className={`font-bold tracking-wide ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

        </div>

      </div>

      {/* Floating share button matching Image 3 */}
      <button 
        onClick={() => alert("Passport URL Copied to clipboard!")}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#0052CC] hover:bg-[#0040A3] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all z-20"
      >
        <Share2 className="w-5 h-5" />
      </button>

    </div>
  );
}
