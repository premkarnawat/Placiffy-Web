"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Shield, CheckCircle, BarChart2,
  Search, Download, AlertTriangle, Eye, Ban, RefreshCw,
  Activity, HelpCircle, Sparkles, Bell, Settings
} from "lucide-react";

const NAV = [
  { id: "candidates", label: "Candidate Management", icon: Users, href: "/admin/candidates" },
  { id: "companies", label: "Company Oversight", icon: Building2, href: "/admin" },
  { id: "fraud", label: "Fraud Detection", icon: Shield, active: true },
  { id: "verification", label: "Verification Center", icon: CheckCircle, href: "/admin/verification" },
  { id: "revenue", label: "Revenue Analytics", icon: BarChart2 },
];

const INVESTIGATIONS = [
  { name: "Jameson Dowell", score: 92, risk: "HIGH RISK", riskColor: "bg-red-100 text-red-700", reason: "AI-Generated Resume Detected" },
  { name: "Sarah Reznick", score: 64, risk: "MED RISK", riskColor: "bg-amber-100 text-amber-700", reason: "GitHub Authenticity Issue" },
  { name: "Mark Thompson", score: 12, risk: "LOW RISK", riskColor: "bg-emerald-100 text-emerald-700", reason: "Minor Employment Gap" },
];

export default function FraudCenterPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-2">
          <div className="text-xs text-zinc-400 font-medium">Control Center</div>
          <div className="text-sm font-black text-[#0052CC]">Admin Core</div>
        </div>
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => item.href && (window.location.href = item.href)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${item.active ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
                <Icon className="w-4 h-4"/>{item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 space-y-0.5 border-t border-zinc-200/60 mt-auto">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100"><Activity className="w-4 h-4"/>System Health</button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100"><HelpCircle className="w-4 h-4"/>Support</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-zinc-200/60 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <span className="text-sm font-black text-zinc-900">PLACIFY Admin</span>
            <nav className="flex items-center gap-4 text-xs font-medium text-zinc-500">
              <a href="/admin" className="hover:text-zinc-900">Dashboard</a>
              <a href="/admin/fraud" className="text-zinc-900 font-bold border-b-2 border-[#0052CC] pb-0.5">Fraud Center</a>
              <a href="#" className="hover:text-zinc-900">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Settings className="w-4 h-4 text-zinc-500"/></button>
            <div className="flex items-center gap-2 ml-1">
              <div className="text-right"><div className="text-xs font-bold text-zinc-600">Admin</div><div className="text-[9px] text-zinc-400">System Security</div></div>
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Fraud & Risk Intelligence</h1>
              <p className="text-sm text-zinc-500 mt-1">Real-time candidate authenticity monitoring and pattern analysis.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"><Download className="w-3.5 h-3.5"/>Export Report</button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"><RefreshCw className="w-3.5 h-3.5"/>Rescan All</button>
            </div>
          </div>

          {/* Critical Alert */}
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600"/>
              <div>
                <div className="text-sm font-bold text-red-900">Critical Alert: Duplicate Network Detected</div>
                <div className="text-xs text-red-600">4 new profiles linked to known shadow-farming IP range in Southeast Asia.</div>
              </div>
            </div>
            <button className="text-xs font-bold text-red-600 hover:underline whitespace-nowrap">VIEW ALL ALERTS</button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Risk Distribution */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-zinc-900 mb-5">Risk Distribution</h2>
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#E4E7EC" strokeWidth="20"/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#0052CC" strokeWidth="20" strokeDasharray={`${0.14*377} ${377}`} strokeLinecap="round"/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#6366F1" strokeWidth="20" strokeDasharray={`${0.28*377} ${377}`} strokeDashoffset={`${-0.14*377}`} strokeLinecap="round"/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#93C5FD" strokeWidth="20" strokeDasharray={`${0.58*377} ${377}`} strokeDashoffset={`${-(0.14+0.28)*377}`}/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-zinc-900">1,284</span>
                    <span className="text-[10px] text-zinc-400">Total Scanned</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#0052CC] rounded-sm"/>14% High</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-violet-500 rounded-sm"/>28% Med</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded-sm"/>58% Low</span>
              </div>
            </div>

            {/* Active Investigations */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-zinc-900">Active Investigations</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400"/>
                  <input className="bg-[#F5F7FA] border-0 rounded-lg py-1.5 pl-8 pr-3 text-xs w-40 focus:ring-1 focus:ring-[#0052CC]/20" placeholder="Search candidates..."/>
                </div>
              </div>
              <table className="w-full">
                <thead><tr className="border-b border-zinc-100">
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-2 pr-2">Candidate Name</th>
                  <th className="text-center text-[10px] font-bold text-zinc-400 uppercase pb-2 pr-2">Fraud Score</th>
                  <th className="text-center text-[10px] font-bold text-zinc-400 uppercase pb-2 pr-2">Risk Level</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-2 pr-2">Primary Reason</th>
                  <th className="text-center text-[10px] font-bold text-zinc-400 uppercase pb-2">Actions</th>
                </tr></thead>
                <tbody>
                  {INVESTIGATIONS.map((item, i) => (
                    <tr key={i} className="border-b border-zinc-50">
                      <td className="py-3 pr-2"><div className="flex items-center gap-2"><div className={`w-7 h-7 rounded-lg ${item.risk.includes("HIGH") ? "bg-red-100" : item.risk.includes("MED") ? "bg-amber-100" : "bg-emerald-100"} flex items-center justify-center text-[9px] font-bold`}>{item.name[0]}</div><span className="text-xs font-bold text-zinc-900">{item.name}</span></div></td>
                      <td className="py-3 pr-2 text-center text-sm font-bold text-zinc-900">{item.score}</td>
                      <td className="py-3 pr-2 text-center"><span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${item.riskColor}`}>{item.risk}</span></td>
                      <td className="py-3 pr-2 text-[10px] text-zinc-600">{item.reason}</td>
                      <td className="py-3 text-center"><div className="flex justify-center gap-1"><button className="p-1 rounded hover:bg-zinc-100"><Eye className="w-3 h-3 text-zinc-400"/></button><button className="p-1 rounded hover:bg-red-50"><Ban className="w-3 h-3 text-zinc-400"/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Deep Dive Analysis */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Deep Dive Analysis</span>
                <BarChart2 className="w-4 h-4 text-amber-600"/>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-sm font-bold text-red-700">JD</div>
                <div><div className="text-base font-bold text-zinc-900">Jameson Dowell</div><div className="text-[10px] text-zinc-500">Case #FR-8921-X</div></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-700 font-medium">Skill Consistency Analysis</span>
                    <span className="font-bold text-red-600">22% Match</span>
                  </div>
                  <div className="text-[10px] font-bold bg-white border border-amber-200 px-2 py-1 rounded inline-block mb-1">RESUME CLAIM: REACT EXPERT</div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{width:"22%"}}/></div>
                  <p className="text-[10px] text-zinc-600 mt-1 italic">Work Sample Performance failed 4/5 functional components; high dependency on AI patterns.</p>
                </div>
                <div className="bg-white border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-zinc-700">LinkedIn vs. Resume Timeline</div>
                  <div className="flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0"/><div><div className="text-xs font-bold text-zinc-900">Overlapping Tenure</div><div className="text-[10px] text-zinc-500">Resume shows 'Meta' while LinkedIn shows 'Self-Employed' during May 2021 - Oct 2022.</div></div></div>
                  <div className="flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0"/><div><div className="text-xs font-bold text-zinc-900">Skill Anomaly</div><div className="text-[10px] text-zinc-500">Claimed 8 years experience in 'Swift' for a role dated 2012 (Language launched 2014).</div></div></div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-700"><AlertTriangle className="w-3 h-3"/>Confirm Fraud & Blacklist</button>
              </div>
              <button className="w-full mt-2 border border-zinc-300 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-white/80">Request Manual Interview</button>
            </div>

            {/* Security Performance */}
            <div className="space-y-4">
              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Security Performance</h3>
                <p className="text-xs text-zinc-500 mb-4">Prevention impact over the last 30 days.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Prevented Loss</div>
                    <div className="text-2xl font-black text-zinc-900">$142.5k</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Bot Rejection Rate</div>
                    <div className="text-2xl font-black text-zinc-900">99.8%</div>
                  </div>
                </div>
              </div>
              {/* ML Confidence */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#E4E7EC" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${0.88*201} 201`}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-zinc-900">88%</span>
                      <span className="text-[8px] text-zinc-400 uppercase font-bold">Confidence</span>
                    </div>
                  </div>
                </div>
                <div className="text-right"><div className="text-xs text-zinc-500">ML Model Integrity</div></div>
              </div>
            </div>
          </div>

          {/* AI Insight Engine */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
            className="bg-zinc-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-1.5 mb-2"><Sparkles className="w-3.5 h-3.5 text-blue-300"/><span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">AI Insight Engine</span></div>
            <p className="text-sm text-zinc-300 leading-relaxed">Pattern "Ghost-Profile-Gamma" detected. User shares behavioral fingerprint (typing cadence & navigation path) with 3 previously blacklisted entities. High probability of syndicated application fraud.</p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
