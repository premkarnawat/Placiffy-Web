# -*- coding: utf-8 -*-

passport_code = """'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Download, Link2, MapPin, Briefcase, Award } from 'lucide-react';
import { GlassCard } from '../glass-card';

interface PassportData {
  candidate_id: string;
  name: string;
  role: string;
  trust_score: number;
  ats_score: number;
  profile_photo_url: string;
  skills: string[];
  experience_years: number;
  summary: string;
  location: string;
  current_job_role: string;
}

const defaultPassport: PassportData = {
  candidate_id: 'CAND-0000',
  name: 'Candidate',
  role: 'Professional',
  trust_score: 0,
  ats_score: 0,
  profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
  skills: ['Skill 1', 'Skill 2'],
  experience_years: 0,
  summary: 'Professional Summary',
  location: 'Remote',
  current_job_role: 'Seeking Opportunities'
};

export default function PassportShowcase({ data = defaultPassport }: { data?: PassportData }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://placify.ai/passport/${data.candidate_id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
      style={{ perspective: 1000 }}
    >
      <div className="relative group">
        {/* Glow Effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        
        {/* Main Card */}
        <div className="relative bg-[#0a0f1c] border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Top Banner & Header */}
          <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 border-b border-blue-500/10">
            {/* Profile Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-[#0a0f1c] shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden bg-white z-10 relative">
                <img src={data.profile_photo_url} alt={data.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#0a0f1c] p-1.5 rounded-full border-2 border-[#0a0f1c] z-20 shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Identity & Global Trust Score */}
            <div className="flex-1 text-center md:text-left flex flex-col md:flex-row items-center md:items-start justify-between gap-6 w-full">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{data.name}</h1>
                <p className="text-blue-400 font-medium text-lg mt-1">{data.role}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                    <MapPin className="w-4 h-4 text-blue-400" /> {data.location}
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <Briefcase className="w-4 h-4 text-emerald-400" /> {data.experience_years} Years Exp.
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="shrink-0 flex flex-col items-center justify-center bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 shadow-inner min-w-[140px]">
                <Shield className="text-emerald-400 w-8 h-8 mb-2" />
                <div className="text-4xl font-black text-white">{data.trust_score}<span className="text-lg text-slate-500">/100</span></div>
                <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold mt-1">TRUST SCORE</div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 sm:p-10 space-y-8 bg-[#0a0f1c]">
            
            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">ATS Matching Rating</h3>
                  <p className="text-slate-500 text-xs mt-1">Profile Completion</p>
                </div>
                <div className="text-3xl font-black text-blue-400">{data.ats_score}%</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current Designation</h3>
                  <p className="text-slate-500 text-xs mt-1">Verified Experience</p>
                </div>
                <div className="text-lg font-bold text-emerald-400 text-right">{data.current_job_role}</div>
              </div>
            </div>

            {/* Skills Array */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Verified Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills && data.skills.length > 0 ? (
                  data.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-800 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700/50 shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 italic">No skills listed yet.</span>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Professional Summary</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.summary || "No summary provided."}
                </p>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="bg-[#050810] p-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-widest">Placify Verified</div>
                <div className="text-[10px] text-slate-500">ID: {data.candidate_id.toUpperCase()}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button 
                onClick={copyToClipboard}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                {copied ? 'Copied URL' : 'Share Passport'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
"""

with open(r"components\passport\passport-showcase.tsx", "w", encoding="utf-8") as f:
    f.write(passport_code)

print("Redesigned Passport Showcase with high-contrast UI and real data bindings!")
