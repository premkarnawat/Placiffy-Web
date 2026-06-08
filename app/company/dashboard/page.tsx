"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

import { motion } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Users, MessageSquare, BarChart2,
  Bell, HelpCircle, Settings, Search, Plus, Calendar, 
  Sparkles, Building2
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Job Workspaces", icon: Briefcase, href: "/company/jobs" },
  { id: "candidates", label: "Candidate Pool", icon: Users, href: "/company/candidates" },
  { id: "messaging", label: "Messaging", icon: MessageSquare, href: "/messages" },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];



// FUNNEL dynamically rendered based on stats


const SOURCES = [
  { name: "LinkedIn Recruiter", pct: 45, color: "bg-[#0052CC]" },
  { name: "Direct Referrals", pct: 30, color: "bg-violet-500" },
  { name: "Careers Page", pct: 15, color: "bg-emerald-500" },
  { name: "Other Portals", pct: 10, color: "bg-zinc-400" },
];

export default function CompanyDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [pipelineView, setPipelineView] = useState("Board");
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, applicants: 0, verified: 0, interviews: 0, offers: 0 });
  
  useEffect(() => {
    if (user) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!company) return;
      
      const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'active');
      const { count: appCount } = await supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id);
      const { count: interviewCount } = await supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('pipeline_status', 'interview');
      const { count: offerCount } = await supabase.from('pipeline_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('pipeline_status', 'offer');
      
      setStats({
        activeJobs: jobsCount || 0,
        applicants: appCount || 0,
        verified: 0,
        interviews: interviewCount || 0,
        offers: offerCount || 0
      });
    } catch (e) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0052CC] rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white"/>
            </div>
            <div>
              <div className="text-sm font-black text-zinc-900">PLACIFY</div>
              <div className="text-[9px] text-zinc-400 font-medium">Intelligence OS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button key={item.id}
                onClick={() => item.href ? window.location.href = item.href : setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"}`}>
                <Icon className="w-4 h-4"/>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-0.5 border-t border-zinc-200/60 mt-auto">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-all">
            <HelpCircle className="w-4 h-4"/>Support
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-all">
            <Settings className="w-4 h-4"/>Settings
          </button>
          <div className="mt-3 bg-white border border-zinc-200 rounded-xl p-3">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Enterprise Portal</div>
            <div className="text-[9px] text-zinc-400">Placify Intelligence</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-zinc-200/60 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
            <input className="w-full bg-[#F5F7FA] border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all"
              placeholder="Global search for candidates, jobs, or intelligence..."/>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="relative p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><HelpCircle className="w-4 h-4 text-zinc-500"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Settings className="w-4 h-4 text-zinc-500"/></button>
            <div className="flex items-center gap-2 ml-2">
              <div className="text-right"><div className="text-xs font-bold text-zinc-900">Alex Sterling</div><div className="text-[10px] text-zinc-400">HR Manager</div></div>
              <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">AS</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome + Actions */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Welcome Back, Alex.</h1>
              <p className="text-sm text-zinc-500 mt-1">Here's what's happening with your hiring funnel today.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                <Calendar className="w-3.5 h-3.5"/>Last 30 Days
              </button>
              <button onClick={() => window.location.href = "/company/jobs"} className="flex items-center gap-2 px-4 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#003FA3] transition-colors">
                <Plus className="w-3.5 h-3.5"/>New Job Request
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
    { label: "Active Jobs", value: stats.activeJobs, change: "+0%", icon: Briefcase, color: "text-[#0052CC]", bg: "bg-blue-50" },
    { label: "Applicants", value: stats.applicants, change: "+0%", icon: Users, color: "text-[#0052CC]", bg: "bg-blue-50" },
    { label: "Verified", value: stats.verified, change: "+0%", icon: "shield", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Interviews", value: stats.interviews, change: "+0%", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50", negative: true },
    { label: "Offers", value: stats.offers, change: "+0%", icon: "file", color: "text-amber-600", bg: "bg-amber-50" }
  ].map((stat, i) => (
              <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                className="bg-white border border-zinc-100 rounded-2xl p-4 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    {typeof stat.icon === "string" ? (
                      <div className={`w-5 h-5 ${stat.color} font-bold text-sm`}>{stat.icon === "shield" ? "\u2713" : "\u2709"}</div>
                    ) : (
                      <stat.icon className={`w-5 h-5 ${stat.color}`}/>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${stat.negative ? "text-red-500" : "text-emerald-600"}`}>{stat.change}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium mb-0.5">{stat.label}</div>
                <div className="text-2xl font-black text-zinc-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Hiring Funnel */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-zinc-900">Hiring Funnel Performance</h2>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#0052CC] rounded-full"/>This Month</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-zinc-300 rounded-full"/>Average</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Awareness / Views", value: "Total Reach", pct: 100 },
                  { label: "Applied", value: stats.applicants, pct: 45 },
                  { label: "Screened / AI Verified", value: stats.verified, pct: 32 },
                  { label: "Interviewed", value: stats.interviews, pct: 18 },
                  { label: "Hired", value: stats.offers, pct: 5 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-44 text-xs font-medium text-zinc-700 flex-shrink-0">{item.label}</div>
                    <div className="flex-1 bg-zinc-100 rounded-full h-6 overflow-hidden">
                      <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:`${item.pct}%`}} transition={{duration:0.8,delay:0.2+i*0.1}}/>
                    </div>
                    <div className="w-28 text-right text-xs font-bold text-zinc-700 flex-shrink-0">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight + Sources */}
            <div className="space-y-4">
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                className="bg-[#0052CC] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-200"/>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">AI Insight</span>
                </div>
                <h3 className="text-base font-black mb-2">Talent Quality is up 24%</h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">Our intelligence models suggest that the recent 'Tech Lead' campaign has attracted 3x higher-quality candidates compared to the industry average.</p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl text-xs font-bold transition-colors backdrop-blur-sm">
                  View Talent Report
                </button>
              </motion.div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Applicant Source</h3>
                <div className="space-y-2.5">
                  {SOURCES.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.color}`}/>
                        <span className="text-zinc-700 font-medium">{s.name}</span>
                      </span>
                      <span className="font-bold text-zinc-900">{s.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-0.5 mt-3 h-1.5 rounded-full overflow-hidden">
                  {SOURCES.map((s, i) => (
                    <motion.div key={i} className={`h-full ${s.color}`} initial={{width:0}} animate={{width:`${s.pct}%`}} transition={{duration:0.6,delay:0.5+i*0.1}}/>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Pipeline */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Candidate Pipeline</h2>
                <p className="text-xs text-zinc-500">Real-time status of top-tier talent</p>
              </div>
              <div className="flex bg-zinc-100 rounded-xl p-0.5">
                {["Board","List","Timeline"].map(v => (
                  <button key={v} onClick={() => setPipelineView(v)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${pipelineView===v?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>{v}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                    { stage: "Sourcing", count: stats.applicants, candidates: [] },
                    { stage: "Interviews", count: stats.interviews, candidates: [] },
                    { stage: "Offers", count: stats.offers, candidates: [] }
                  ].map((stage, i) => (
                <div key={i}>
                  <div className="text-xs font-bold text-zinc-500 mb-3">{stage.stage} ({stage.count})</div>
                  {stage.candidates.map((c, ci) => (
                    <div key={ci} className="bg-[#F8F9FB] border border-zinc-100 rounded-2xl p-3.5 hover:border-blue-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-full bg-zinc-300 flex items-center justify-center text-xs font-bold text-white">{c.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-zinc-900 truncate">{c.name}</div>
                          <div className="text-[10px] text-zinc-500">{c.role}</div>
                        </div>
                        {c.badge && <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${c.badgeColor}`}>{c.badge}</span>}
                      </div>
                      {c.skills && c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {c.skills.map((s,si)=><span key={si} className="text-[9px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{s}</span>)}
                        </div>
                      )}
                      {c.time && <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3"/>{c.time}</div>}
                      {c.salary && <div className="text-[10px] text-zinc-500 mt-2">{c.salary}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
