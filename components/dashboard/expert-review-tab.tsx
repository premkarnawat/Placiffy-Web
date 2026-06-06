"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';
import { GlassCard } from '../glass-card';

export default function ExpertReviewTab() {
  const rubrics = [
    { title: "Technical Knowledge", score: 28, max: 30, desc: "Deep knowledge of hooks and system designs." },
    { title: "Project Structure", score: 23, max: 25, desc: "Meticulous folder layout and code structures." },
    { title: "Problem Solving", score: 19, max: 20, desc: "Clean algorithms and recursive efficiency." },
    { title: "Communication", score: 14, max: 15, desc: "Detailed API documentation and explanations." },
    { title: "Professionalism", score: 9, max: 10, desc: "Timely checkouts and standard structures." }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Expert Consensus Scorecard</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">Review validation from Stripe & Linear panelists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Rubrics list, Col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Rubric Criteria Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rubrics.map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-3 hover:border-zinc-300 transition-all">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-zinc-800">{item.title}</h4>
                  <span className="text-xs font-black text-[#0052cc]">{item.score} / {item.max}</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0052cc] h-full" style={{ width: `${(item.score / item.max) * 100}%` }} />
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Overview, Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Qualitative Consensus</h3>
          
          <GlassCard className="border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 border border-blue-100 text-[#0052cc] rounded-lg shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-800">Panel Consensus</div>
                <div className="text-[9px] text-[#0052cc] font-bold uppercase mt-0.5">STRONG HIRE GRADE</div>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 leading-relaxed font-sans italic">
              "Marcus Thorne's submission demonstrates exceptional standard coding structure. Expert panelists from Stripe and Linear verified the project setup as production-grade."
            </p>
          </GlassCard>

          <GlassCard className="border border-[#B2F5EA] bg-[#E6FFFA]/30 p-6 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-[#00A3C4] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Identity Verified
            </h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              GitHub repository authentication verified. Comits history matches resume timeline.
            </p>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
