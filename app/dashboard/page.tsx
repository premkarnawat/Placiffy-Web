"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Shield, Award, Users, FileText, Settings,
  HelpCircle, LogOut, Bell, Menu, X, Briefcase, Target,
  CheckCircle, TrendingUp, ChevronRight, Zap, Lock, Star
} from "lucide-react";
import DashboardTab from "@/components/dashboard/dashboard-tab";
import TrustScoreTab from "@/components/dashboard/trust-score-tab";
import PassportTab from "@/components/dashboard/passport-tab";
import ExpertReviewTab from "@/components/dashboard/expert-review-tab";
import MatchingTab from "@/components/dashboard/matching-tab";

type Section = "dashboard"|"trust"|"expert"|"matching"|"passport"|"settings"|"support";

const MENU = [
  { id:"dashboard" as Section, label:"Dashboard", icon:LayoutDashboard },
  { id:"matching" as Section, label:"Matched Jobs", icon:Briefcase },
  { id:"trust" as Section, label:"Trust Score", icon:Shield },
  { id:"expert" as Section, label:"Expert Review", icon:Award },
  { id:"passport" as Section, label:"My Passport", icon:FileText },
];

const COMPLETION_ITEMS = [
  { label:"Profile Photo", done:false, pct:10 },
  { label:"Resume Uploaded", done:true, pct:10 },
  { label:"Skills Added", done:true, pct:10 },
  { label:"Experience", done:true, pct:10 },
  { label:"Education", done:true, pct:10 },
  { label:"LinkedIn URL", done:false, pct:10 },
  { label:"GitHub / Portfolio", done:false, pct:10 },
  { label:"Location", done:true, pct:10 },
  { label:"Salary Preference", done:false, pct:10 },
  { label:"Verification Consent", done:true, pct:10 },
];

const completionPct = COMPLETION_ITEMS.filter(i => i.done).length * 10;
const canApply = completionPct >= 80;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const navTo = (s: Section) => { setActiveSection(s); setSidebarOpen(false); };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardTab/>;
      case "trust": return <TrustScoreTab/>;
      case "passport": return <PassportTab/>;
      case "expert": return <ExpertReviewTab/>;
      case "matching": return <MatchingTab/>;
      default: return <DashboardTab/>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-800 flex select-none">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 h-full z-40 w-64 border-r border-zinc-200/60 bg-[#F8F9FA] flex flex-col justify-between transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 space-y-6 text-left">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Placify" className="h-8 w-auto rounded-lg object-contain mix-blend-multiply"/>
          </div>

          {/* Profile Completion Widget */}
          <button onClick={()=>setShowCompletion(!showCompletion)}
            className="w-full bg-white border border-zinc-200 rounded-2xl p-3.5 text-left hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Profile</span>
              <span className={`text-xs font-black ${completionPct>=80?"text-emerald-600":"text-amber-600"}`}>{completionPct}%</span>
            </div>
            <div className="progress-bar-bg mb-1.5">
              <motion.div className={`progress-bar-fill ${completionPct>=80?"":"progress-bar-gold"}`}
                initial={{width:0}} animate={{width:`${completionPct}%`}} transition={{duration:1}}
                style={{borderRadius:"99px"}}/>
            </div>
            {!canApply && (
              <div className="flex items-center gap-1 mt-1.5">
                <Lock className="w-3 h-3 text-amber-500"/>
                <span className="text-[10px] text-amber-600 font-bold">Need 80% to apply</span>
              </div>
            )}
            {canApply && (
              <div className="flex items-center gap-1 mt-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-500"/>
                <span className="text-[10px] text-emerald-600 font-bold">Applications Unlocked</span>
              </div>
            )}
          </button>

          {/* Completion checklist */}
          <AnimatePresence>
            {showCompletion && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                className="overflow-hidden">
                <div className="space-y-1.5">
                  {COMPLETION_ITEMS.map((item,i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {item.done
                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
                        : <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 flex-shrink-0"/>
                      }
                      <span className={item.done?"text-zinc-700 font-medium":"text-zinc-400"}>{item.label}</span>
                      <span className="ml-auto text-[10px] text-zinc-400">+{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav */}
          <nav className="space-y-1">
            {MENU.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button key={item.id} onClick={()=>navTo(item.id)}
                  className={`sidebar-link ${isActive?"active":""}`}>
                  <Icon className="w-4 h-4 flex-shrink-0"/>
                  {item.label}
                </button>
              );
            })}
            {/* Jobs — locked if <80% */}
            <button
              onClick={()=>canApply ? window.location.href="/jobs" : setShowCompletion(true)}
              className={`sidebar-link ${!canApply?"opacity-60":""} relative`}>
              <Target className="w-4 h-4 flex-shrink-0"/>
              Browse All Jobs
              {!canApply && <Lock className="w-3 h-3 ml-auto text-amber-500"/>}
            </button>
          </nav>
        </div>

        {/* Sidebar bottom */}
        <div className="p-6 border-t border-zinc-200/50 space-y-4">
          <button onClick={()=>navTo("passport")}
            className="w-full bg-[#0052CC] hover:bg-[#0040A3] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
            Get Certified
          </button>
          <div className="space-y-1">
            <button onClick={()=>navTo("settings")} className="sidebar-link"><Settings className="w-4 h-4"/>Settings</button>
            <button onClick={()=>navTo("support")} className="sidebar-link"><HelpCircle className="w-4 h-4"/>Support</button>
            <button onClick={()=>window.location.href="/"} className="sidebar-link text-red-500 hover:bg-red-50"><LogOut className="w-4 h-4"/>Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 lg:hidden">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-zinc-100">
              {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
            <img src="/logo.jpg" alt="Placify" className="h-7 w-auto object-contain mix-blend-multiply"/>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5">
              <span className={`w-2 h-2 rounded-full ${completionPct>=80?"bg-emerald-400":"bg-amber-400"}`}/>
              <span className="text-xs font-bold text-zinc-700">{completionPct}%</span>
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-zinc-100">
              <Bell className="w-5 h-5 text-zinc-600"/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"/>
            </button>
          </div>
        </header>

        <main className="flex-1 bg-white p-6 md:p-10 overflow-y-auto">
          {/* Application lock banner */}
          <AnimatePresence>
            {!canApply && activeSection === "matching" && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-600 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="text-sm font-bold text-amber-800">Complete your profile to unlock applications</div>
                  <div className="text-xs text-amber-600">Your profile is {completionPct}% complete. Reach 80% to start applying.</div>
                </div>
                <button onClick={()=>{setShowCompletion(true);setSidebarOpen(true);}}
                  className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition-colors whitespace-nowrap">
                  Complete Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}}
              transition={{duration:0.35,ease:"easeOut"}} className="h-full">
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
