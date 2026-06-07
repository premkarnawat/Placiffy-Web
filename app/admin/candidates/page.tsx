"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Shield, CheckCircle, BarChart2,
  Search, Download, Plus, Upload, ChevronDown, ChevronLeft, ChevronRight,
  Activity, HelpCircle, Sparkles, Bell, Settings, Eye
} from "lucide-react";

const NAV = [
  { id: "candidates", label: "Candidate Management", icon: Users, active: true },
  { id: "companies", label: "Company Oversight", icon: Building2, href: "/admin" },
  { id: "fraud", label: "Fraud Detection", icon: Shield, href: "/admin/fraud" },
  { id: "verification", label: "Verification Center", icon: CheckCircle, href: "/admin/verification" },
  { id: "revenue", label: "Revenue Analytics", icon: BarChart2 },
];

const FILTERS_SKILLS = ["Software Engineering", "Product Management", "Data Science"];

const CANDIDATES = [
  { name: "Elena Rodriguez", role: "Lead Full Stack Engineer", stage: "Final Interview", stageColor: "bg-blue-100 text-blue-700", ats: 94, trust: "8.9/10", fraud: "LOW RISK", fraudColor: "bg-emerald-100 text-emerald-700" },
  { name: "Jameson Blake", role: "DevOps Architect", stage: "Offer Sent", stageColor: "bg-violet-100 text-violet-700", ats: 88, trust: "7.2/10", fraud: "MEDIUM RISK", fraudColor: "bg-amber-100 text-amber-700" },
  { name: "Sarah Lin", role: "Machine Learning Expert", stage: "Vetting Stage", stageColor: "bg-emerald-100 text-emerald-700", ats: 97, trust: "9.5/10", fraud: "LOW RISK", fraudColor: "bg-emerald-100 text-emerald-700" },
  { name: "Arthur Vance", role: "Duplicate Profile Detected", stage: "Suspended", stageColor: "bg-red-100 text-red-700", ats: 42, trust: "1.2/10", fraud: "HIGH RISK", fraudColor: "bg-red-100 text-red-700" },
];

export default function AdminCandidatesPage() {
  const [selectedSkills, setSelectedSkills] = useState(["Software Engineering"]);
  const [salaryRange, setSalaryRange] = useState(150);
  const [noticePeriod, setNoticePeriod] = useState("Immediate (1 week)");
  const [verificationLevel, setVerificationLevel] = useState(["Verified"]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0052CC]"/>
            <span className="text-sm font-black text-[#0052CC]">Control Center</span>
          </div>
          <div className="text-[9px] text-zinc-400 font-medium mt-0.5">Enterprise Admin</div>
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
              <a href="/admin/candidates" className="text-zinc-900 font-bold border-b-2 border-[#0052CC] pb-0.5">Candidate Management</a>
              <a href="/admin" className="hover:text-zinc-900">Company Oversight</a>
              <a href="#" className="hover:text-zinc-900">Revenue Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Settings className="w-4 h-4 text-zinc-500"/></button>
            <div className="flex items-center gap-2 ml-1">
              <span className="text-xs font-bold text-zinc-600">Profile</span>
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Candidate Universe</h1>
              <p className="text-sm text-zinc-500 mt-1">Global intelligence layer for over 2.4 million high-vetted professionals.</p>
            </div>
            <div className="flex -space-x-2">
              {["bg-blue-500","bg-emerald-500","bg-violet-500"].map((c,i)=>(<div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>{["E","J","S"][i]}</div>))}
              <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">+12k</div>
            </div>
          </div>

          {/* Search + Bulk Upload */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"/>
                <input className="w-full bg-[#F5F7FA] border-0 rounded-xl py-3.5 pl-12 pr-16 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all"
                  placeholder="Search by name, skills, location, or passport ID..."/>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-400 text-xs font-mono bg-zinc-200/60 px-1.5 py-0.5 rounded">\u2318 K</div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#0052CC] rounded-full"/>4,120 active sessions</span>
                <span className="flex items-center gap-1"><Activity className="w-3 h-3"/>Real-time indexing active</span>
              </div>
            </div>
            <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-[#0052CC] transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                <Upload className="w-5 h-5 text-[#0052CC]"/>
              </div>
              <div className="text-sm font-bold text-zinc-900 mb-0.5">Bulk ATS Screening</div>
              <div className="text-[10px] text-zinc-500 text-center mb-2">Drop ZIP or CSV files here for high-volume resume parsing & fraud checks.</div>
              <div className="flex gap-2">
                {["ZIP","CSV","PDF"].map(f=>(<span key={f} className="text-[9px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">{f}</span>))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="space-y-5">
              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-zinc-900">Advanced Filters</h3>
                  <button className="text-xs font-bold text-[#0052CC] hover:underline">Reset</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-zinc-700 mb-2">Core Skills</div>
                    {FILTERS_SKILLS.map(skill => (
                      <label key={skill} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)}
                          className="rounded border-zinc-300 text-[#0052CC] focus:ring-[#0052CC]"/>
                        <span className="text-xs text-zinc-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-700 mb-2">Salary Expectation (USD)</div>
                    <input type="range" min="40" max="300" value={salaryRange} onChange={e => setSalaryRange(Number(e.target.value))} className="w-full accent-[#0052CC]"/>
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-1"><span>$40k</span><span>$300k+</span></div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-700 mb-2">Notice Period</div>
                    <div className="relative">
                      <select className="w-full border border-zinc-200 rounded-xl py-2.5 px-3 text-xs appearance-none bg-white" value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)}>
                        <option>Immediate (1 week)</option><option>2 weeks</option><option>1 month</option><option>2 months</option><option>3 months</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none"/>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-700 mb-2">Verification Level</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Verified","L2 Pending","Escalated"].map(level => (
                        <button key={level} onClick={() => setVerificationLevel(prev => prev.includes(level) ? prev.filter(l=>l!==level) : [...prev,level])}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${verificationLevel.includes(level) ? "bg-[#0052CC] text-white border-[#0052CC]" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-zinc-900 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300"/>
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Placify AI Insight</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">High concentration of verified Senior Frontend talent available in Southeast Asia this week.</p>
                <div className="bg-zinc-800 rounded-xl p-3">
                  <div className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1">Global Match Stability</div>
                  <div className="text-2xl font-black">98.4 <span className="text-sm text-zinc-400">%</span></div>
                </div>
              </div>
            </div>

            {/* Candidate Table */}
            <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-zinc-900">Global Candidate Directory</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50"><Download className="w-3 h-3"/>Export</button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#003FA3]"><Plus className="w-3 h-3"/>Add New</button>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Name</th>
                    <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Current Stage</th>
                    <th className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">ATS Match (%)</th>
                    <th className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Trust Score</th>
                    <th className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3">Fraud Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {CANDIDATES.map((c, i) => (
                    <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}
                      className="border-b border-zinc-50 last:border-0 hover:bg-blue-50/30 transition-colors cursor-pointer">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                            {c.name.split(" ").map(n=>n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-900">{c.name}</div>
                            <div className={`text-[10px] ${c.stage === "Suspended" ? "text-red-500 font-bold" : "text-zinc-400"}`}>{c.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${c.stageColor}`}>{c.stage}</span>
                      </td>
                      <td className="py-4 pr-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-base font-black ${c.ats >= 90 ? "text-emerald-600" : c.ats >= 70 ? "text-[#0052CC]" : "text-zinc-400"}`}>{c.ats}%</span>
                          <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:`${c.ats}%`}} transition={{duration:0.6,delay:0.3+i*0.1}}/>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-center">
                        <span className="text-sm font-bold text-zinc-900">{c.trust}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded ${c.fraudColor}`}>{c.fraud}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100">
                <span className="text-xs text-zinc-500">Showing 1 - 4 of <span className="font-bold">2,412,058</span> candidates</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><ChevronLeft className="w-4 h-4"/></button>
                  {[1,2,3].map(n => (
                    <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n===1?"bg-[#0052CC] text-white":"text-zinc-600 hover:bg-zinc-100"}`}>{n}</button>
                  ))}
                  <span className="text-zinc-400 text-xs px-1">...</span>
                  <button className="w-8 h-8 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-100">120k</button>
                  <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><ChevronRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
