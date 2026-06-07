"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, BarChart2, Send, X, Bold, Italic, List, Link2,
  Briefcase, Users, MessageSquare, BarChart2 as Chart, Settings,
  HelpCircle, Building2, ChevronDown, Clock
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: "grid", href: "/company/dashboard" },
  { label: "Job Workspaces", icon: "briefcase", active: true },
  { label: "Candidate Pool", icon: "users", href: "/company/candidates" },
  { label: "Messaging", icon: "message", href: "/messages" },
  { label: "Analytics", icon: "chart" },
];

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [empType, setEmpType] = useState("Full-time");
  const [workMode, setWorkMode] = useState("Remote");
  const [experience, setExperience] = useState(5);
  const [skills, setSkills] = useState(["Figma", "Prototyping", "React"]);
  const [newSkill, setNewSkill] = useState("");
  const [description, setDescription] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-6">
          <div className="text-sm font-black text-zinc-900">PLACIFY</div>
          <div className="text-[9px] text-zinc-400 font-medium">Placify Intelligence</div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((item, i) => (
            <button key={i} onClick={() => item.href && (window.location.href = item.href)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${item.active ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 space-y-3 border-t border-zinc-200/60 mt-auto">
          {/* Priority Widget */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3">
            <div className="text-[10px] font-bold text-zinc-700 mb-2">Hiring Priority</div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-600">Critical</span>
              <span className="font-bold text-red-500">2 Jobs</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">High</span>
              <span className="font-bold text-amber-500">5 Jobs</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full mt-2 overflow-hidden flex">
              <div className="h-full bg-red-500" style={{width:"28%"}}/>
              <div className="h-full bg-[#0052CC]" style={{width:"72%"}}/>
            </div>
          </div>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 uppercase tracking-wider">Support</button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 uppercase tracking-wider">Settings</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-zinc-200/60 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = "/company/jobs"} className="p-2 rounded-xl hover:bg-zinc-100">
              <ArrowLeft className="w-5 h-5 text-zinc-600"/>
            </button>
            <h1 className="text-lg font-black text-zinc-900">Create New Job</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-500","bg-emerald-500","bg-violet-500"].map((c,i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>{["A","M","K"][i]}</div>
              ))}
              <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600">+3</div>
            </div>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><HelpCircle className="w-4 h-4 text-zinc-500"/></button>
          </div>
        </header>

        <main className="p-6 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Role Foundation */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                className="bg-white border border-zinc-100 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center text-xs font-bold">1</div>
                  <h2 className="text-lg font-bold text-zinc-900">Role Foundation</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">Job Title</label>
                    <input className="w-full border border-zinc-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all"
                      placeholder="e.g. Senior Product Designer" value={title} onChange={e => setTitle(e.target.value)}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1.5">CTC Range (Annual)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                        <input className="w-full border border-zinc-200 rounded-xl py-3 pl-7 pr-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all"
                          placeholder="120k - 180k" value={salary} onChange={e => setSalary(e.target.value)}/>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1.5">Location</label>
                      <input className="w-full border border-zinc-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all"
                        placeholder="San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1.5">Employment Type</label>
                      <div className="relative">
                        <select className="w-full border border-zinc-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 appearance-none bg-white"
                          value={empType} onChange={e => setEmpType(e.target.value)}>
                          <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"/>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1.5">Work Mode</label>
                      <div className="flex gap-2">
                        {["Remote","Hybrid","Onsite"].map(m => (
                          <button key={m} onClick={() => setWorkMode(m)}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${workMode===m?"bg-[#0052CC] text-white border-[#0052CC]":"border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>{m}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Talent Profile */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                className="bg-white border border-zinc-100 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center text-xs font-bold">2</div>
                  <h2 className="text-lg font-bold text-zinc-900">Talent Profile</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-3">Required Experience (Years)</label>
                    <input type="range" min="0" max="15" value={experience} onChange={e => setExperience(Number(e.target.value))}
                      className="w-full accent-[#0052CC]"/>
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                      <span>Entry (0)</span><span>Expert (15+)</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-2">Core Skills</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 bg-[#0052CC] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                          {s}
                          <button onClick={() => removeSkill(s)}><X className="w-3 h-3"/></button>
                        </span>
                      ))}
                      <input className="border-0 text-sm text-zinc-600 focus:outline-none min-w-[100px]"
                        placeholder="Add skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); }}}/>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 3: Detailed Description */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                className="bg-white border border-zinc-100 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center text-xs font-bold">3</div>
                  <h2 className="text-lg font-bold text-zinc-900">Detailed Description</h2>
                </div>
                <div className="flex gap-2 mb-3 border-b border-zinc-100 pb-3">
                  {[Bold, Italic, List, Link2].map((Icon,i) => (
                    <button key={i} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"><Icon className="w-4 h-4"/></button>
                  ))}
                </div>
                <textarea className="w-full border border-zinc-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 resize-none min-h-[200px]"
                  placeholder="Outline the responsibilities, perks, and expectations..." value={description} onChange={e => setDescription(e.target.value)}/>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* AI Copilot */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#0052CC]"/>
                  <span className="text-xs font-bold text-[#0052CC]">Placify AI Copilot</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  I can help you optimize this JD to attract top-tier talent. My current analysis shows a 74% market match.
                </p>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                    <span className="flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5"/>Analyze JD Quality</span>
                    <ChevronDown className="w-3 h-3 -rotate-90"/>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-[#0052CC] rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                    <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5"/>Enhance Description</span>
                    <ChevronDown className="w-3 h-3 -rotate-90"/>
                  </button>
                </div>
              </motion.div>

              {/* Hiring Velocity */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Hiring Velocity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600">Avg. Time to Hire</span>
                    <span className="font-bold text-zinc-900">18 Days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600">Market Competitiveness</span>
                    <span className="font-bold text-emerald-600">High</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button className="w-full bg-[#0052CC] hover:bg-[#003FA3] text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                Publish Job <Send className="w-4 h-4"/>
              </button>
              <button className="w-full border border-zinc-200 text-zinc-700 py-3.5 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
