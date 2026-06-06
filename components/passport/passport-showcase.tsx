"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Download, Link2, Award, Check, Cpu, Clock, Calendar } from 'lucide-react';
import { GlassCard } from '../glass-card';

interface PassportData {
  candidate_id: string;
  name: string;
  role: string;
  trust_score: number;
  ats_score: number;
  portfolio_score: number;
  work_sample_score: number;
  expert_score: number;
  reliability_score: number;
  communication_score: number;
  fraud_risk: string;
  joining_probability: number;
  recommendation: string;
}

const defaultPassport: PassportData = {
  candidate_id: "PLC-9872-TSX",
  name: "Alexander Vance",
  role: "Senior Full Stack Engineer",
  trust_score: 93,
  ats_score: 91,
  portfolio_score: 89,
  work_sample_score: 95,
  expert_score: 92,
  reliability_score: 100,
  communication_score: 90,
  fraud_risk: "LOW",
  joining_probability: 94,
  recommendation: "STRONG HIRE: Demonstrates production-grade system design, verified repository authenticity, and exceptionally high communications ratings from expert assessment panels."
};

export default function PassportShowcase({ data = defaultPassport }: { data?: PassportData }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'rubric' | 'reliability'>('metrics');

  const copyLink = () => {
    setCopied(true);
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`https://placify.ai/passport/${data.candidate_id}`);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto text-left"
    >
      {/* Top Banner Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">CANDIDATE PASSPORT</span>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
            ID: {data.candidate_id} 
            <span className="text-xs font-normal text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> VERIFIED
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={copyLink}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
            {copied ? 'Copied URL' : 'Share Passport'}
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:brightness-110 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-orange-500/20 transition-all">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Passport Board */}
      <GlassCard className="border-t-4 border-t-orange-500 p-0 overflow-hidden" glow>
        {/* Header section */}
        <div className="relative p-8 border-b border-slate-900 bg-slate-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                  {data.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{data.name}</h1>
                <p className="text-slate-400 font-medium">{data.role}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">React</span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">Node.js</span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">FastAPI</span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">AWS</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 self-start md:self-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="url(#orangeGrad)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - data.trust_score / 100)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{data.trust_score}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">TRUST SCORE</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-400">Fraud Assessment</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{data.fraud_risk} RISK</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Timeline validated • Code authentic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inner Tabs navigation */}
        <div className="flex border-b border-slate-900 px-8 bg-slate-900/10">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-4 border-b-2 text-xs font-bold transition-all ${activeTab === 'metrics' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Core Metrics
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-3 px-4 border-b-2 text-xs font-bold transition-all ${activeTab === 'rubric' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Expert Scorecard Details
          </button>
          <button
            onClick={() => setActiveTab('reliability')}
            className={`py-3 px-4 border-b-2 text-xs font-bold transition-all ${activeTab === 'reliability' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Reliability Logs
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-8">
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">VERIFICATION BREAKDOWN</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-900 bg-slate-950/30 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">ATS Matching</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">{data.ats_score}% Match</div>
                    </div>
                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center text-sm font-black ${getScoreColor(data.ats_score)}`}>
                      {data.ats_score}
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/30 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Portfolio Quality</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">{data.portfolio_score}% Score</div>
                    </div>
                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center text-sm font-black ${getScoreColor(data.portfolio_score)}`}>
                      {data.portfolio_score}
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/30 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Work Sample Score</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">{data.work_sample_score}% Score</div>
                    </div>
                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center text-sm font-black ${getScoreColor(data.work_sample_score)}`}>
                      {data.work_sample_score}
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/30 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Expert Grade</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">{data.expert_score}% Rating</div>
                    </div>
                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center text-sm font-black ${getScoreColor(data.expert_score)}`}>
                      {data.expert_score}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">RELIABILITY INDEX</h3>
                <div className="border border-slate-900 bg-slate-950/30 rounded-xl p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">Response Speed</span>
                      <span className="text-emerald-400 font-bold">12 mins avg</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">Interview Attendance</span>
                      <span className="text-emerald-400 font-bold">100% Rate</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[100%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">Offer Acceptance Prob.</span>
                      <span className="text-orange-400 font-bold">{data.joining_probability}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[94%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rubric' && (
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Standardized Evaluation Rubric</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-white">28<span className="text-xs text-slate-500">/30</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">Technical Knowledge</div>
                  <div className="text-[8px] text-slate-600 mt-1">Deep React hooks patterns</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-white">23<span className="text-xs text-slate-500">/25</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">Project Structure</div>
                  <div className="text-[8px] text-slate-600 mt-1">Meticulous folder layout</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-white">19<span className="text-xs text-slate-500">/20</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">Problem Solving</div>
                  <div className="text-[8px] text-slate-600 mt-1">Clean recursion solutions</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-white">14<span className="text-xs text-slate-500">/15</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">Communication</div>
                  <div className="text-[8px] text-slate-600 mt-1">Clear API descriptions</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-white">9<span className="text-xs text-slate-500">/10</span></div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">Professionalism</div>
                  <div className="text-[8px] text-slate-600 mt-1">Timely work submissions</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-xs text-slate-400 leading-relaxed">
                <strong>Assessor consensus:</strong> Candidates submission demonstrates exceptional standard coding structure. Expert panelists from Stripe and Linear verified the project setup as production-grade.
              </div>
            </div>
          )}

          {activeTab === 'reliability' && (
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Audit Logging & Timeline Receipts</h3>
              
              <div className="border border-slate-900 bg-slate-950/20 rounded-xl divide-y divide-slate-900 text-xs">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-300">GitHub Authentication verified</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Commits history matches resume timeline</p>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Checked
                  </span>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-300">First response speed test</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Response to initial Placify invite: 8 mins</p>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Clock className="w-3.5 h-3.5" /> 8 mins
                  </span>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-300">Work challenge submission</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Uploaded code file checkout receipt: 1 day early</p>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Calendar className="w-3.5 h-3.5" /> Early
                  </span>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-300">Technical panel interview attendance</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Expert Panel live call attendance: 100% on time</p>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Present
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Passport Footer Summary */}
        <div className="p-8 border-t border-slate-900 bg-slate-950/30">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Placify AI Systems Assessment</div>
              <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">{data.recommendation}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
