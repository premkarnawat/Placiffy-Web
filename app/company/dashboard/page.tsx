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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/company/dashboard" },
  { id: "create_job", label: "Create Job", icon: Plus, href: "/company/jobs/create" },
  { id: "jobs", label: "Job Workspace", icon: Briefcase, href: "/company/workspace" },
  { id: "candidates", label: "Candidate Pool", icon: Users, href: "/company/candidates" },
  { id: "messaging", label: "Messages", icon: MessageSquare, href: "/company/messages" },
  { id: "reports", label: "Reports", icon: BarChart2, href: "/company/reports" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "/company/analytics" },
];


const BOTTOM_NAV = [
  { id: "billing", label: "Billing", icon: LayoutDashboard, href: "/company/billing" },
  { id: "support", label: "Support", icon: HelpCircle, href: "/company/support" },
  { id: "settings", label: "Settings", icon: Settings, href: "/company/settings" },
  { id: "ai", label: "AI Assistant", icon: Sparkles, href: "/company/ai-assistant" },
];

const SOURCES = [
  { name: "Organic Search", pct: 45, color: "bg-[#0052CC]" },
  { name: "Referrals", pct: 25, color: "bg-emerald-500" },
  { name: "Direct Link", pct: 20, color: "bg-amber-500" },
  { name: "Social Media", pct: 10, color: "bg-purple-500" },
];




// FUNNEL dynamically rendered based on stats




export default function CompanyDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [pipelineView, setPipelineView] = useState("Board");
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, applicants: 0, verified: 0, interviews: 0, offers: 0 });
  
  useEffect(() => {
    if (!user) return;
    fetchStats();

    const channel = supabase.channel('dashboard_metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data: company } = await supabase.from('companies').select('id, name').eq('user_id', user?.id).single();
      if (!company) return;

      const [
        { count: jobsCount },
        { count: appCount },
        { count: interviewCount },
        { count: offerCount }
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'active'),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id).eq('status', 'interview'),
        supabase.from('applications').select('*, jobs!inner(company_id)', { count: 'exact', head: true }).eq('jobs.company_id', company.id).eq('status', 'offered')
      ]);

      setStats({
        activeJobs: jobsCount || 0,
        applicants: appCount || 0,
        verified: 0, // Real verification tracking will be built in Phase 4
        interviews: interviewCount || 0,
        offers: offerCount || 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    
      <div className="p-6">
          {/* Welcome + Actions */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900">Welcome Back.</h1>
              <p className="text-sm text-zinc-500 mt-1">Here&apos;s what&apos;s happening with your hiring funnel today.</p>
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

          <div className="grid lg:grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  { label: "Applied", value: stats.applicants, pct: stats.applicants > 0 ? 100 : 0 },
                  { label: "Screened / AI Verified", value: stats.verified, pct: stats.applicants > 0 ? Math.round((stats.verified / stats.applicants) * 100) : 0 },
                  { label: "Interviewed", value: stats.interviews, pct: stats.applicants > 0 ? Math.round((stats.interviews / stats.applicants) * 100) : 0 },
                  { label: "Hired", value: stats.offers, pct: stats.applicants > 0 ? Math.round((stats.offers / stats.applicants) * 100) : 0 }
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
                {["Board","List","Timeline"].map((v: string) => (
                  <button key={v} onClick={() => setPipelineView(v)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${pipelineView===v?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>{v}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                        <div className="w-9 h-9 rounded-full bg-zinc-300 flex items-center justify-center text-xs font-bold text-white">{c.name.split(" ").map((n: string) =>n[0]).join("")}</div>
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
      </div>
  );
}
