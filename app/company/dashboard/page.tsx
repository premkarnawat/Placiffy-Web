"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Users, BarChart2, Settings,
  LogOut, Bell, Plus, TrendingUp, Clock, CheckCircle, XCircle,
  ArrowRight, Menu, X, ChevronRight, Star, Search,
  Building2, FileText, Award, Zap, Target, RefreshCw
} from "lucide-react";

function FadeIn({ children, delay=0, className="" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.6,delay,ease:[0.23,1,0.32,1]}} className={className}>
      {children}
    </motion.div>
  );
}

const KPIS = [
  { label:"Active Jobs", value:"14", change:"+3 this week", icon:<Briefcase className="w-5 h-5"/>, color:"text-blue-500", bg:"bg-blue-50" },
  { label:"Total Applicants", value:"247", change:"+28 today", icon:<Users className="w-5 h-5"/>, color:"text-emerald-500", bg:"bg-emerald-50" },
  { label:"Verified Candidates", value:"89", change:"36% of pool", icon:<Award className="w-5 h-5"/>, color:"text-violet-500", bg:"bg-violet-50" },
  { label:"Avg Time-to-Hire", value:"11d", change:"-4d vs last month", icon:<Clock className="w-5 h-5"/>, color:"text-amber-500", bg:"bg-amber-50" },
  { label:"Interviews Scheduled", value:"32", change:"This week", icon:<Target className="w-5 h-5"/>, color:"text-pink-500", bg:"bg-pink-50" },
  { label:"Offer Acceptance", value:"91%", change:"+7% vs last Q", icon:<TrendingUp className="w-5 h-5"/>, color:"text-teal-500", bg:"bg-teal-50" },
];

const RECENT_JOBS = [
  { title:"Senior React Developer", dept:"Engineering", applicants:42, ats_avg:88, stage:"Interview", urgent:true },
  { title:"Product Designer", dept:"Design", applicants:31, ats_avg:82, stage:"Shortlisting", urgent:false },
  { title:"Data Scientist", dept:"AI/ML", applicants:28, ats_avg:91, stage:"Verification", urgent:true },
  { title:"DevOps Engineer", dept:"Infrastructure", applicants:19, ats_avg:79, stage:"Assessment", urgent:false },
];

const PIPELINE = [
  { label:"Applied", count:247, pct:100, color:"bg-zinc-200" },
  { label:"ATS Matched", count:148, pct:60, color:"bg-blue-400" },
  { label:"Interested", count:91, pct:37, color:"bg-indigo-400" },
  { label:"Verified", count:64, pct:26, color:"bg-violet-400" },
  { label:"Interview", count:32, pct:13, color:"bg-amber-400" },
  { label:"Offer", count:18, pct:7, color:"bg-emerald-400" },
  { label:"Joined", count:11, pct:4.5, color:"bg-green-500" },
];

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"jobs", label:"Jobs", icon:Briefcase, href:"/company/jobs" },
  { id:"candidates", label:"Candidates", icon:Users, href:"/company/candidates" },
  { id:"analytics", label:"Analytics", icon:BarChart2 },
];

export default function CompanyDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 h-full z-40 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-zinc-100">
          <img src="/logo.jpg" alt="Placify" className="h-8 w-auto object-contain mix-blend-multiply"/>
          <div className="mt-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company Portal</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(n => {
            const Icon = n.icon;
            const isAct = active === n.id;
            return (
              <button key={n.id}
                onClick={() => { if (n.href) window.location.href = n.href; else setActive(n.id); setSidebarOpen(false); }}
                className={`sidebar-link ${isAct?"active":""}`}>
                <Icon className="w-4 h-4 flex-shrink-0"/>
                {n.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-1">
          <button className="sidebar-link" onClick={()=>window.location.href="/company/jobs"}>
            <Plus className="w-4 h-4"/> Post New Job
          </button>
          <button className="sidebar-link" onClick={()=>setSidebarOpen(false)}>
            <Settings className="w-4 h-4"/> Settings
          </button>
          <button className="sidebar-link text-red-500" onClick={()=>window.location.href="/"}>
            <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-zinc-100" onClick={()=>setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Hiring Dashboard</h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Welcome back, Acme Technologies</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-zinc-100 transition-colors">
              <Bell className="w-5 h-5 text-zinc-600"/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"/>
            </button>
            <button onClick={()=>window.location.href="/company/jobs"}
              className="btn-brand text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5"/> Post Job
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {KPIS.map((k,i) => (
              <FadeIn key={i} delay={i*0.06}>
                <div className="bg-white rounded-2xl p-4 border border-zinc-100 hover:shadow-sm transition-all">
                  <div className={`w-9 h-9 rounded-xl ${k.bg} ${k.color} flex items-center justify-center mb-3`}>
                    {k.icon}
                  </div>
                  <div className="text-2xl font-black text-zinc-900">{k.value}</div>
                  <div className="text-[11px] font-bold text-zinc-500 mt-0.5">{k.label}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">{k.change}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Hiring Funnel */}
            <FadeIn className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-zinc-100 p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-black text-zinc-900">Hiring Funnel</h2>
                  <span className="badge-brand">All Jobs</span>
                </div>
                <div className="space-y-3">
                  {PIPELINE.map((stage,i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-zinc-700">{stage.label}</span>
                        <span className="font-bold text-zinc-900">{stage.count}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <motion.div
                          className={`${stage.color} progress-bar-fill`}
                          initial={{width:0}} animate={{width:`${stage.pct}%`}}
                          transition={{duration:0.8, delay:i*0.1}}
                          style={{borderRadius:"99px"}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Active Jobs */}
            <FadeIn className="lg:col-span-2" delay={0.1}>
              <div className="bg-white rounded-3xl border border-zinc-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-black text-zinc-900">Active Jobs</h2>
                  <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1" onClick={()=>window.location.href="/company/jobs"}>
                    View All <ChevronRight className="w-3.5 h-3.5"/>
                  </button>
                </div>
                <div className="space-y-3">
                  {RECENT_JOBS.map((job,i) => (
                    <motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.08}}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                      onClick={()=>window.location.href="/company/jobs"}>
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-zinc-600"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900 truncate">{job.title}</h3>
                          {job.urgent && <span className="badge-warn text-[9px] py-0.5 px-2">Urgent</span>}
                        </div>
                        <p className="text-xs text-zinc-500">{job.dept} · {job.applicants} applicants</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-black text-zinc-900">{job.ats_avg}%</div>
                        <div className="text-[10px] text-zinc-400 font-bold">Avg ATS</div>
                      </div>
                      <div className="hidden sm:block">
                        <span className={`badge-brand text-[10px] px-2 py-0.5`}>{job.stage}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Bottom Row */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* ATS Distribution */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-3xl border border-zinc-100 p-6">
                <h2 className="text-sm font-black text-zinc-900 mb-5">ATS Score Distribution</h2>
                <div className="space-y-3">
                  {[
                    { range:"90-100%", count:32, pct:22, color:"bg-emerald-400" },
                    { range:"80-90%", count:67, pct:46, color:"bg-blue-400" },
                    { range:"70-80%", count:49, pct:33, color:"bg-amber-400" },
                    { range:"<70%", count:51, pct:35, color:"bg-red-300" },
                  ].map((r,i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-xs font-semibold text-zinc-600">{r.range}</div>
                      <div className="flex-1 progress-bar-bg">
                        <motion.div className={`${r.color} progress-bar-fill`} initial={{width:0}} animate={{width:`${r.pct}%`}}
                          transition={{duration:0.7,delay:0.5+i*0.1}} style={{borderRadius:"99px"}}/>
                      </div>
                      <div className="w-8 text-xs font-bold text-zinc-700 text-right">{r.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Recent Activity */}
            <FadeIn delay={0.25}>
              <div className="bg-white rounded-3xl border border-zinc-100 p-6">
                <h2 className="text-sm font-black text-zinc-900 mb-5">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { text:"Neha Joshi accepted interview for React Dev", time:"2m ago", icon:<CheckCircle className="w-4 h-4 text-emerald-500"/> },
                    { text:"3 new applications for Data Scientist role", time:"14m ago", icon:<Users className="w-4 h-4 text-blue-500"/> },
                    { text:"Arjun Nair's verification completed — 94%", time:"1h ago", icon:<Award className="w-4 h-4 text-violet-500"/> },
                    { text:"Offer sent to Priya Sharma for DevOps role", time:"3h ago", icon:<Zap className="w-4 h-4 text-amber-500"/> },
                    { text:"Job posting expired: UX Designer", time:"6h ago", icon:<XCircle className="w-4 h-4 text-red-400"/> },
                  ].map((a,i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5 flex-shrink-0">{a.icon}</div>
                      <div className="flex-1 text-zinc-700 leading-relaxed">{a.text}</div>
                      <div className="text-zinc-400 whitespace-nowrap">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
}
