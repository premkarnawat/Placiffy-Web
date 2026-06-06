"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Filter, ChevronRight, UserCheck } from 'lucide-react';
import { GlassCard } from '../glass-card';

export default function MatchingTab() {
  const matches = [
    { name: "Marcus Thorne", role: "Principal Data Architect", match: 98, trust: 92, salary: "$190k", status: "VERIFIED" },
    { name: "Alexander Vance", role: "Senior Full Stack Engineer", match: 94, trust: 93, salary: "$145k", status: "VERIFIED" },
    { name: "Sarah Jenkins", role: "React Developer", match: 91, trust: 95, salary: "$130k", status: "VERIFIED" }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Semantic Matching</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">Hiring intelligence semantic talent filters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sourcing Parameters (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sourcing Filters</h3>
          <GlassCard className="border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Required Skills</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-650 px-2.5 py-0.5 rounded font-mono font-medium">React</span>
                <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-650 px-2.5 py-0.5 rounded font-mono font-medium">TypeScript</span>
                <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-650 px-2.5 py-0.5 rounded font-mono font-medium">FastAPI</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Hiring Target</label>
              <div className="text-xs font-bold text-zinc-800">Senior Product Engineer</div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Location Preference</label>
              <div className="text-xs font-semibold text-zinc-600">Remote / Anywhere</div>
            </div>
          </GlassCard>
        </div>

        {/* Matches list (Col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Top Sourced Matches</h3>
          
          <div className="space-y-3">
            {matches.map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm hover:border-[#0052cc]/30 transition-all duration-300 flex justify-between items-center gap-4">
                <div className="flex gap-3.5 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#E6F0FF] text-[#0052cc] border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">{item.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.role}</p>
                  </div>
                </div>

                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-400 uppercase">Match</div>
                    <div className="text-sm font-bold text-zinc-800 mt-0.5">{item.match}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-400 uppercase">Trust</div>
                    <div className="text-sm font-bold text-[#0052cc] mt-0.5">{item.trust}%</div>
                  </div>
                  <button className="p-2 hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-colors">
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
