"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Shield, CheckCircle, BarChart2,
  Search, Filter, Clock, Award, FileText, UserPlus,
  Activity, HelpCircle, Sparkles, Bell, Settings,
  TrendingUp, TrendingDown, ChevronRight
} from "lucide-react";

const NAV = [
  { id: "candidates", label: "Candidate Management", icon: Users, href: "/admin/candidates" },
  { id: "companies", label: "Company Oversight", icon: Building2, href: "/admin" },
  { id: "fraud", label: "Fraud Detection", icon: Shield, href: "/admin/fraud" },
  { id: "verification", label: "Verification Center", icon: CheckCircle, active: true },
  { id: "revenue", label: "Revenue Analytics", icon: BarChart2 },
];

const PIPELINE_STATS = [
  { label: "Registered", value: "1,284", change: "+12%", icon: Users, color: "text-[#0052CC]" },
  { label: "Resume Parse", value: "942", icon: FileText, color: "text-[#0052CC]" },
  { label: "ATS Match", value: "618", sub: "Active processing", icon: BarChart2, color: "text-[#0052CC]" },
  { label: "Verification", value: "241", sub: "Action required", icon: CheckCircle, color: "text-emerald-600", highlight: true },
  { label: "Expert Review", value: "104", sub: "Avg. 4.2h", icon: Award, color: "text-violet-600" },
  { label: "Passport Generated", value: "5,192", sub: "Total ecosystem", icon: Shield, color: "text-[#0052CC]" },
];

const QUEUE = [
  { name: "Alex Harrison", id: "#ID-48291", service: "Expert Interview", priority: "High", priorityColor: "text-red-500", status: "UNASSIGNED", statusColor: "bg-amber-100 text-amber-700", action: "Assign Expert" },
  { name: "Sarah Lin", id: "#ID-48306", service: "Work Sample Review", priority: "Medium", priorityColor: "text-amber-500", status: "REVIEWING", statusColor: "bg-emerald-100 text-emerald-700", action: "" },
  { name: "Jordan Miller", id: "#ID-48312", service: "Background Check", priority: "Low", priorityColor: "text-zinc-500", status: "PENDING DOCS", statusColor: "bg-zinc-100 text-zinc-600", action: "" },
  { name: "Elena Kozlova", id: "#ID-48320", service: "Skill Validation", priority: "High", priorityColor: "text-red-500", status: "UNASSIGNED", statusColor: "bg-amber-100 text-amber-700", action: "Assign Expert" },
];

export default function VerificationCenterPage() {
  const [timeFilter, setTimeFilter] = useState("Today");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#0052CC]"/>
            <div><div className="text-sm font-black text-[#0052CC]">Control Center</div><div className="text-[9px] text-zinc-400">Enterprise Admin</div></div>
          </div>
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
              <a href="/admin/candidates" className="hover:text-zinc-900">Candidates</a>
              <a href="/admin/verification" className="text-zinc-900 font-bold border-b-2 border-[#0052CC] pb-0.5">Verification Center</a>
              <a href="#" className="hover:text-zinc-900">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Settings className="w-4 h-4 text-zinc-500"/></button>
            <div className="flex items-center gap-2 ml-1">
              <div className="text-right"><div className="text-xs font-bold text-zinc-600">Administrator</div><div className="text-[9px] text-zinc-400">Admin_042</div></div>
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Global Verification Pipeline</h1>
              <p className="text-sm text-zinc-500 mt-1">Real-time throughput of high-trust candidate validation</p>
            </div>
            <div className="flex bg-zinc-100 rounded-xl p-0.5">
              {["Today","Weekly"].map(v => (
                <button key={v} onClick={() => setTimeFilter(v)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${timeFilter===v?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Pipeline Stats */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            {PIPELINE_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className={`bg-white border rounded-2xl p-4 ${stat.highlight ? "border-emerald-200 bg-emerald-50/30" : "border-zinc-100"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${stat.color}`}/>
                  </div>
                  <div className="text-2xl font-black text-zinc-900">{stat.value}</div>
                  {stat.change && <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5"><TrendingUp className="w-3 h-3"/>{stat.change}</div>}
                  {stat.sub && <div className={`text-[10px] mt-0.5 ${stat.highlight ? "text-amber-600 font-bold" : "text-zinc-400"}`}>{stat.sub}</div>}
                  <div className="h-1 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                    <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:`${70-i*10}%`}} transition={{duration:0.6,delay:0.3+i*0.08}}/>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Queue Table */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Verification Queue</h2>
                  <p className="text-xs text-zinc-500">Manage expert assignments for pending validations</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400"/><input className="bg-[#F5F7FA] border-0 rounded-lg py-1.5 pl-8 pr-3 text-xs w-40" placeholder="Search candidates..."/></div>
                  <button className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50"><Filter className="w-3 h-3 text-zinc-500"/></button>
                </div>
              </div>

              <table className="w-full">
                <thead><tr className="border-b border-zinc-100">
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-3 pr-3">Candidate Name</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-3 pr-3">Service Type</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-3 pr-3">Priority</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-3 pr-3">Status</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase pb-3">Action</th>
                </tr></thead>
                <tbody>
                  {QUEUE.map((item, i) => (
                    <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}
                      className="border-b border-zinc-50 last:border-0">
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#0052CC]">{item.name.split(" ").map(n=>n[0]).join("")}</div>
                          <div><div className="text-sm font-bold text-zinc-900">{item.name}</div><div className="text-[9px] text-zinc-400">{item.id}</div></div>
                        </div>
                      </td>
                      <td className="py-4 pr-3 text-xs text-zinc-700">{item.service}</td>
                      <td className="py-4 pr-3"><span className={`text-xs font-bold ${item.priorityColor}`}>{item.priority === "High" ? "! " : ""}{item.priority}</span></td>
                      <td className="py-4 pr-3"><span className={`text-[9px] font-bold px-2 py-1 rounded ${item.statusColor}`}>{item.status}</span></td>
                      <td className="py-4">{item.action ? <button className="text-xs font-bold text-[#0052CC] hover:underline">{item.action}</button> : <span className="text-zinc-400">...</span>}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <button className="w-full mt-4 text-xs text-[#0052CC] font-bold flex items-center justify-center gap-1 hover:underline">
                View all 64 pending verifications <ChevronRight className="w-3 h-3"/>
              </button>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-zinc-100">
                <div className="bg-[#F8F9FB] rounded-xl p-4 flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#E4E7EC" strokeWidth="4"/>
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${0.92*113} 113`}/>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-zinc-900">92%</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">Expert Availability</div>
                    <div className="text-[10px] text-zinc-500">42 experts active vs 4 currently idle</div>
                    <div className="h-1 bg-zinc-200 rounded-full mt-1.5 w-24 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{width:"80%"}}/><div className="h-full bg-zinc-300" style={{width:"20%"}}/>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F8F9FB] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><TrendingDown className="w-5 h-5 text-[#0052CC]"/></div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">Mean Verification Time</div>
                    <div className="text-[10px] text-zinc-500">Down 14% from previous 30 days</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">5.8 Hours (Target: &lt;6h)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel — Passport Preview */}
            <div className="space-y-4">
              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Placify Passport</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">AH</div>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Verification Preview</h3>
                <div className="flex items-center gap-3 mt-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-500">AH</div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">Alex Harrison</div>
                    <div className="text-xs text-zinc-500">Senior Full-Stack Engineer</div>
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Verified Identity</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#F8F9FB] rounded-xl p-3 text-center">
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">ATS Match Score</div>
                    <div className="text-2xl font-black text-zinc-900">94.8 <span className="text-xs text-zinc-400 font-normal">/100</span></div>
                  </div>
                  <div className="bg-[#F8F9FB] rounded-xl p-3 text-center">
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Trust Index</div>
                    <div className="text-2xl font-black text-zinc-900">9.9 <span className="text-xs text-zinc-400 font-normal">/10</span></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Verified Technical Mastery</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between"><span className="text-xs text-zinc-700">Distributed Systems</span><span className="text-xs font-bold text-[#0052CC]">L5 Expert</span></div>
                    <div className="flex items-center justify-between"><span className="text-xs text-zinc-700">Rust / Core Engine</span><span className="text-xs font-bold text-[#0052CC]">L4 Advanced</span></div>
                  </div>
                  <div className="h-1 bg-zinc-100 rounded-full mt-2 overflow-hidden"><motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:"90%"}} transition={{duration:0.8}}/></div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2"><Sparkles className="w-3 h-3 text-[#0052CC]"/><span className="text-[9px] font-bold text-[#0052CC] uppercase tracking-wider">AI Analytics Insight</span></div>
                <p className="text-xs text-zinc-700 leading-relaxed">Candidate demonstrates exceptional architectural depth. Probability of high-performance tenure is <strong>89%</strong>. Recommend for "Elite Tier" placement.</p>
              </div>

              {/* Action Buttons */}
              <button className="w-full bg-[#0052CC] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#003FA3]"><Award className="w-4 h-4"/>Generate Official Passport</button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 hover:bg-zinc-50"><Users className="w-3 h-3"/>Assign Expert</button>
                <button className="py-2.5 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 hover:bg-zinc-50"><FileText className="w-3 h-3"/>Request Docs</button>
              </div>

              {/* Security Status */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 bg-[#0052CC] rounded-full"/>
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">Security Status</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">All validation modules operational. Neural network match engine running at <strong>14ms</strong> latency.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
