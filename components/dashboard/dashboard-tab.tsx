"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart2, Shield, Briefcase, CalendarCheck, TrendingUp,
  ChevronRight, MapPin, DollarSign, Sparkles, CheckCircle,
  Clock, ArrowRight, ExternalLink
} from "lucide-react";

const STATS = [
  { label:"ATS Match Score", value:"94%", sub:"Top 5%", change:"+2.4%", icon:BarChart2, color:"text-[#0052CC]", bg:"bg-blue-50" },
  { label:"Trust Score", value:"8.2", sub:"High institutional reliability", suffix:"/10", icon:Shield, color:"text-emerald-600", bg:"bg-emerald-50", badge:"PREMIUM" },
  { label:"Applied Jobs", value:"24", sub:"", icon:Briefcase, color:"text-violet-600", bg:"bg-violet-50" },
  { label:"Interviews", value:"06", sub:"2 pending scheduling", icon:CalendarCheck, color:"text-amber-600", bg:"bg-amber-50", alert:true },
];

const MATCHED_JOBS = [
  { title:"Senior UX Engineer", company:"Stripe", location:"Remote / San Francisco", salary:"$180k - $240k", equity:"0.1% Equity", match:98, skills:["TypeScript","React","Design Systems"], logo:"S", logoColor:"bg-violet-100 text-violet-600" },
  { title:"Frontend Lead", company:"Vercel", location:"Fully Remote", salary:"$210k - $275k", match:95, skills:["Next.js","Vercel Edge","Leadership"], logo:"V", logoColor:"bg-zinc-900 text-white" },
  { title:"Product Architect", company:"Linear", location:"New York, NY", salary:"$190k - $250k", match:92, skills:["Distributed Systems","TypeScript"], logo:"L", logoColor:"bg-blue-100 text-blue-600" },
];

export default function DashboardTab() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Welcome Back, Alex</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Your technical profile is performing well. We've identified 12 new roles that match your skill set and career trajectory.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle className="w-3 h-3"/> Verification Status: Verified Professional
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3"/> Last active: 2 hours ago
            </span>
          </div>
        </div>

        {/* Profile Completion Ring */}
        <div className="flex items-center gap-3 bg-[#F8F9FB] border border-zinc-100 rounded-2xl px-4 py-3">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" stroke="#E4E7EC" strokeWidth="4" fill="none"/>
              <circle cx="28" cy="28" r="24" stroke="#0052CC" strokeWidth="4" fill="none"
                strokeLinecap="round" strokeDasharray={`${70 * 1.508} 999`}/>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#0052CC]">70%</span>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Profile Completion</div>
            <div className="text-[10px] text-zinc-500">Increase to 80% to unlock apps.</div>
            <a href="/profile" className="text-[10px] font-bold text-[#0052CC] flex items-center gap-0.5 hover:underline mt-0.5">
              Update Now <ArrowRight className="w-2.5 h-2.5"/>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="bg-white border border-zinc-100 rounded-2xl p-4 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4"/>
                </div>
                {stat.badge && <span className="text-[8px] font-black text-[#0052CC] bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{stat.badge}</span>}
                {stat.alert && <span className="text-[8px] font-bold text-amber-600">!</span>}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-zinc-900 leading-none">{stat.value}</span>
                {stat.suffix && <span className="text-sm text-zinc-400 font-medium mb-0.5">{stat.suffix}</span>}
              </div>
              {stat.sub && <div className={`text-[10px] mt-1 font-medium ${stat.alert ? "text-amber-600" : "text-zinc-500"}`}>{stat.alert ? "! " : ""}{stat.sub}</div>}
              {stat.change && (
                <div className="flex items-center gap-1 mt-1.5">
                  <TrendingUp className="w-3 h-3 text-emerald-500"/>
                  <span className="text-[10px] font-bold text-emerald-600">{stat.change}</span>
                  <div className="flex-1 h-1 bg-zinc-100 rounded-full ml-1">
                    <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:"75%"}} transition={{duration:1,delay:0.5+i*0.1}}/>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Jobs Matched */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Jobs Matched For You</h2>
            <p className="text-xs text-zinc-500">Powered by our 'Identity Intelligence' matching engine.</p>
          </div>
          <a href="/jobs" className="text-xs font-bold text-[#0052CC] flex items-center gap-1 hover:underline">
            View All Matches <ChevronRight className="w-3 h-3"/>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {MATCHED_JOBS.map((job, i) => (
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.1}}
              className="bg-white border border-zinc-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl ${job.logoColor} flex items-center justify-center font-bold text-sm`}>
                    {job.logo}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{job.title}</div>
                    <div className="text-xs text-zinc-500">{job.company}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${job.match >= 95 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-[#0052CC] border border-blue-200"}`}>
                  {job.match}% Match
                </span>
              </div>

              <div className="space-y-1.5 mb-3 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {job.location}</div>
                <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3"/> {job.salary} {job.equity ? `\u2022 ${job.equity}` : ""}</div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.map((s, si) => (
                  <span key={si} className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>

              <button disabled className="w-full py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-400 bg-zinc-50 cursor-not-allowed">
                Apply Now
              </button>
              <div className="text-[9px] text-amber-600 font-bold text-center mt-1.5">Complete 80% of your profile to unlock applications</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insight Banner */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
        className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0052CC] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white"/>
          </div>
          <div>
            <div className="text-xs font-black text-[#0052CC] uppercase tracking-wider mb-0.5">Placify AI Insight</div>
            <p className="text-sm text-zinc-700">
              Based on your recent certification in "Distributed Architecture", you are now in the top 2% of candidates for 14 active "Principal Engineer" roles in our network. Update your Passport to verify this skill.
            </p>
          </div>
        </div>
        <button className="bg-zinc-900 text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors whitespace-nowrap flex items-center gap-1.5">
          Verify New Skill
        </button>
      </motion.div>
    </div>
  );
}
