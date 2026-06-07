"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Shield, CheckCircle, BarChart2,
  Bell, Settings, Search, Download, Plus, TrendingUp, AlertTriangle,
  Globe, Activity, Clock, ChevronRight, ExternalLink, Eye,
  Building2, HelpCircle, Sparkles
} from "lucide-react";

const NAV = [
  { id: "candidates", label: "Candidate Management", icon: Users, active: true },
  { id: "companies", label: "Company Oversight", icon: Building2 },
  { id: "fraud", label: "Fraud Detection", icon: Shield },
  { id: "verification", label: "Verification Center", icon: CheckCircle },
  { id: "revenue", label: "Revenue Analytics", icon: BarChart2 },
];

const STATS = [
  { label: "Total Candidates", value: "42,000+", change: "+12.5%", icon: Users, color: "text-[#0052CC]", bg: "bg-blue-50" },
  { label: "Active Companies", value: "1,200", change: "+4.2%", icon: Building2, color: "text-[#0052CC]", bg: "bg-blue-50" },
  { label: "In Verification", value: "428", change: "Active Review", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", alert: true },
  { label: "Fraud Alerts", value: "3", change: "High Priority", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", danger: true },
  { label: "Revenue", value: "$1.2M", change: "ARR", icon: BarChart2, color: "text-violet-600", bg: "bg-violet-50" },
];

const CHART_DATA = [
  { quarter: "Q1 2023", height: 20 },
  { quarter: "Q2 2023", height: 28 },
  { quarter: "Q3 2023", height: 35 },
  { quarter: "Q4 2023", height: 45 },
  { quarter: "Q1 2024", height: 60 },
  { quarter: "Q2 2024", height: 85, current: true },
];

const FRAUD_ALERTS = [
  { title: "Skill Consistency Alert", detail: "Candidate: #9821 - Marcus Wright", severity: "IMMEDIATE ACTION", color: "bg-red-500" },
  { title: "IP Velocity Flag", detail: "Multiple logins from 3 locations", severity: "SYSTEM OPERATIONAL", color: "bg-amber-500", latency: "42ms" },
  { title: "Metadata Mismatch", detail: "Verification docs edited with unauthorized tools.", severity: "", color: "bg-blue-500" },
];

const QUEUE = [
  { name: "Elena Soros", source: "LinkedIn Verified", role: "Principal DevOps Engineer", score: 94, time: "14m 22s" },
  { name: "Jameson Doherty", source: "Manual Upload", role: "Fullstack Architect", score: 88, time: "28m 10s" },
  { name: "Chen Lu", source: "GitHub Verified", role: "Senior AI Research Scientist", score: 97, time: "41m 55s" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("candidates");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0052CC]"/>
            <span className="text-sm font-black text-zinc-900">Control Center</span>
          </div>
          <div className="text-[9px] text-zinc-400 font-medium mt-0.5">Enterprise Admin</div>
        </div>

        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${item.active || activeNav === item.id ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
                <Icon className="w-4 h-4"/>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-0.5 border-t border-zinc-200/60 mt-auto">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all">
            <Activity className="w-4 h-4"/>System Health
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all">
            <HelpCircle className="w-4 h-4"/>Support
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-zinc-200/60 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <span className="text-sm font-black text-zinc-900">PLACIFY Admin</span>
            <nav className="flex items-center gap-4 text-xs font-medium text-zinc-500">
              <a href="#" className="text-zinc-900 font-bold border-b-2 border-[#0052CC] pb-0.5">Dashboard</a>
              <a href="#" className="hover:text-zinc-900">Audit Log</a>
              <a href="#" className="hover:text-zinc-900">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
              <input className="bg-[#F5F7FA] border-0 rounded-xl py-2 pl-10 pr-4 text-sm w-52 focus:ring-2 focus:ring-[#0052CC]/20"
                placeholder="Global system search..."/>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/></button>
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
              <h1 className="text-2xl font-black text-zinc-900">Placify Command Center</h1>
              <p className="text-sm text-zinc-500 mt-1">Real-time oversight of global hiring intelligence, candidate verification, and partner ecosystems.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                <Download className="w-3.5 h-3.5"/>Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#003FA3] transition-colors">
                <Plus className="w-3.5 h-3.5"/>New Audit
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className="bg-white border border-zinc-100 rounded-2xl p-4 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-bold text-zinc-500">{stat.label}</div>
                    <Icon className={`w-4 h-4 ${stat.color}`}/>
                  </div>
                  <div className="text-2xl font-black text-zinc-900 mb-1">{stat.value}</div>
                  <div className={`text-[10px] font-bold flex items-center gap-1 ${stat.danger ? "text-red-500" : stat.alert ? "text-amber-600" : "text-emerald-600"}`}>
                    {!stat.danger && !stat.alert && <TrendingUp className="w-3 h-3"/>}
                    {stat.danger && <AlertTriangle className="w-3 h-3"/>}
                    {stat.change}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Global Hiring Activity</h2>
                  <p className="text-xs text-zinc-500">Tracking onboarding velocity and successful credential matching.</p>
                </div>
                <div className="flex bg-zinc-100 rounded-xl p-0.5">
                  <button className="px-3 py-1.5 bg-white text-zinc-900 text-xs font-bold rounded-lg shadow-sm">Growth</button>
                  <button className="px-3 py-1.5 text-zinc-500 text-xs font-bold rounded-lg">Success</button>
                </div>
              </div>
              <div className="flex items-end justify-between h-48 gap-3 px-4">
                {CHART_DATA.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    {bar.current && <span className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">42,000+</span>}
                    <motion.div
                      className={`w-full rounded-lg ${bar.current ? "bg-[#0052CC]" : "bg-blue-200"}`}
                      initial={{height:0}} animate={{height:`${bar.height}%`}} transition={{duration:0.6, delay:0.3+i*0.1}}
                      style={{minHeight:"16px"}}
                    />
                    <span className={`text-[9px] font-bold ${bar.current ? "text-[#0052CC]" : "text-zinc-400"}`}>{bar.quarter.replace("20","")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud Detection Radar */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center"><Shield className="w-4 h-4 text-red-500"/></div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Fraud Detection Radar</h3>
                  <p className="text-[10px] text-zinc-500">AI-powered monitoring</p>
                </div>
              </div>
              <div className="space-y-3">
                {FRAUD_ALERTS.map((alert, i) => (
                  <motion.div key={i} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.1}}
                    className="bg-[#F8F9FB] rounded-xl p-3 border border-zinc-100">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 ${alert.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <AlertTriangle className="w-3 h-3 text-white"/>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{alert.title}</div>
                        <div className="text-[10px] text-zinc-500">{alert.detail}</div>
                        {alert.severity && (
                          <span className={`text-[8px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${alert.severity.includes("IMMEDIATE") ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                            {alert.severity}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-3 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                View All Anomaly Data
              </button>
              {/* AI Copilot FAB */}
              <div className="flex justify-end mt-3">
                <button className="flex items-center gap-1.5 bg-[#0052CC] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#003FA3] transition-colors">
                  <Sparkles className="w-3 h-3"/>AI Copilot
                </button>
              </div>
            </div>
          </div>

          {/* Verification Queue */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">High Priority Verification Queue</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
                <span className="text-[10px] text-zinc-500 font-medium">Live Expert Review Stream</span>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Candidate</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Applied Role</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Intelligence Score</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3 pr-4">Time in Queue</th>
                  <th className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {QUEUE.map((item, i) => (
                  <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6+i*0.1}}
                    className="border-b border-zinc-50 last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#0052CC]">
                          {item.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{item.name}</div>
                          <div className="text-[10px] text-zinc-400">{item.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs text-zinc-700">{item.role}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:`${item.score}%`}} transition={{duration:0.8,delay:0.8+i*0.1}}/>
                        </div>
                        <span className="text-xs font-bold text-zinc-900">{item.score}/100</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs text-zinc-500">{item.time}</td>
                    <td className="py-4">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-zinc-400 hover:text-[#0052CC] transition-colors"><Eye className="w-4 h-4"/></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="text-center mt-4">
              <button className="text-xs text-[#0052CC] font-bold flex items-center gap-1 mx-auto hover:underline">
                View all 428 in queue <ChevronRight className="w-3 h-3"/>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
