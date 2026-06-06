"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2, ChevronRight, Award, Shield, Key } from 'lucide-react';
import { GlassCard } from '../glass-card';

export default function TrustScoreTab() {
  const activities = [
    { text: "Credential Check: Academic certificates decrypted and matched against university ledger.", time: "2 MINUTES AGO" },
    { text: "Skill Assessment: Algorithm proficiency verified through secure environment execution.", time: "14 MINUTES AGO" }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Expert Validation</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">Trust verification engine scorecards</p>
        </div>
        <span className="text-[10px] bg-blue-50 border border-blue-100 text-[#0052CC] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Priority Review
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Circular dial (Col span 5) */}
        <div className="lg:col-span-5 flex justify-center">
          <GlassCard className="border border-zinc-200 bg-white p-8 w-full flex flex-col items-center justify-center h-[340px] shadow-sm">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#f4f4f5" strokeWidth="14" fill="transparent" />
                <motion.circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  stroke="#0052CC" 
                  strokeWidth="14" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 80}
                  initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - 0.94) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-zinc-900 font-sans">94%</span>
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest mt-1">TRUST SCORE</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right validation descriptions (Col span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card 1 */}
          <div className="border border-zinc-200/80 bg-white rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-all">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-zinc-200 overflow-hidden shadow-sm shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Sarah J" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Verified by Expert: Sarah J.</h4>
                <p className="text-xs text-zinc-550 mt-0.5">Senior Architect • 12+ Years Experience</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-[#00A3C4] bg-[#E6FFFA] border border-[#B2F5EA] px-2 py-0.5 rounded-md w-fit">
                  <Check className="w-3 h-3" /> Identity: Confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-zinc-200/80 bg-white rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-all flex gap-4 items-center">
            <div className="p-2.5 bg-blue-50 border border-blue-100 text-[#0052CC] rounded-xl shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Technical Portfolio</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Project complexity and execution standards validated at 9.4/10 scale.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-zinc-200/80 bg-white rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-all flex gap-4 items-center">
            <div className="p-2.5 bg-blue-50 border border-blue-100 text-[#0052CC] rounded-xl shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Work History</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Previous tenure at Fortune 500 confirmed via secure API node.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Validation Activity */}
      <GlassCard className="border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">VALIDATION ACTIVITY</h3>
        <div className="space-y-4">
          {activities.map((act, i) => (
            <div key={i} className="flex justify-between items-start gap-4 py-3 border-b border-zinc-100 last:border-0 text-xs">
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-zinc-650 leading-relaxed">{act.text}</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-zinc-450 tracking-wider whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Bottom action banner */}
      <div className="bg-gradient-to-r from-[#0052CC] to-[#0040A3] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        <div>
          <h4 className="text-base font-bold">Validation Complete</h4>
          <p className="text-xs text-blue-100/90 mt-1">Proceed to compile your dynamic Candidate Digital Passport.</p>
        </div>
        <button className="bg-white hover:bg-zinc-50 text-[#0052CC] font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm">
          Proceed to Next Step <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
