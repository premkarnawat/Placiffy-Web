"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Briefcase, Building2, DollarSign,
  Shield, FileText, BarChart2, Settings, LogOut, Bell, Search,
  TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, Menu, X,
  UserCheck, Lock, Activity
} from "lucide-react";

const NAV_ITEMS = [
  { id:"overview", label:"Overview", icon:LayoutDashboard },
  { id:"users", label:"Users", icon:Users },
  { id:"companies", label:"Companies", icon:Building2 },
  { id:"jobs", label:"Jobs", icon:Briefcase },
  { id:"revenue", label:"Revenue", icon:DollarSign },
  { id:"fraud", label:"Fraud Alerts", icon:Shield, badge:3 },
  { id:"audit", label:"Audit Logs", icon:FileText },
  { id:"analytics", label:"Analytics", icon:BarChart2 },
];

const PLATFORM_STATS = [
  { label:"Total Users", value:"3,842", change:"+128 this week", icon:<Users className="w-5 h-5"/>, color:"text-blue-500", bg:"bg-blue-50" },
  { label:"Active Companies", value:"156", change:"+12 this month", icon:<Building2 className="w-5 h-5"/>, color:"text-emerald-500", bg:"bg-emerald-50" },
  { label:"Total Jobs Posted", value:"1,204", change:"+89 this week", icon:<Briefcase className="w-5 h-5"/>, color:"text-violet-500", bg:"bg-violet-50" },
  { label:"Monthly Revenue", value:"₹48.2L", change:"+22% vs last month", icon:<DollarSign className="w-5 h-5"/>, color:"text-amber-500", bg:"bg-amber-50" },
  { label:"Fraud Alerts", value:"3", change:"Needs review", icon:<AlertTriangle className="w-5 h-5"/>, color:"text-red-500", bg:"bg-red-50" },
  { label:"Verified Passports", value:"2,847", change:"+94 this week", icon:<UserCheck className="w-5 h-5"/>, color:"text-teal-500", bg:"bg-teal-50" },
];

const RECENT_USERS = [
  { name:"Neha Joshi", email:"neha@gmail.com", type:"Candidate", status:"Active", ats:96, joined:"2h ago" },
  { name:"Acme Technologies", email:"hr@acme.com", type:"Company", status:"Active", ats:0, joined:"1d ago" },
  { name:"Arjun Nair", email:"arjun@dev.io", type:"Candidate", status:"Active", ats:91, joined:"1d ago" },
  { name:"FinCore HR", email:"hr@fincore.com", type:"Company", status:"Pending", ats:0, joined:"2d ago" },
  { name:"Priya Kulkarni", email:"priya@email.com", type:"Candidate", status:"Suspended", ats:72, joined:"3d ago" },
];

const FRAUD_ALERTS = [
  { id:1, user:"Suspicious Account #4821", reason:"Multiple resume submissions with different identities", severity:"High", time:"30m ago" },
  { id:2, user:"CompanyX Pvt Ltd", reason:"Domain verification mismatch — possible fake company", severity:"Medium", time:"2h ago" },
  { id:3, user:"Candidate #2983", reason:"Duplicate profile detected with different email", severity:"Low", time:"6h ago" },
];

const AUDIT_LOG = [
  { action:"User banned", actor:"Admin #1", target:"user_4821", time:"30m ago", type:"security" },
  { action:"Job deleted", actor:"Admin #2", target:"job_1204", time:"2h ago", type:"content" },
  { action:"Subscription upgraded", actor:"System", target:"company_156", time:"4h ago", type:"billing" },
  { action:"New admin created", actor:"Super Admin", target:"admin_8", time:"1d ago", type:"security" },
  { action:"Platform settings updated", actor:"Admin #1", target:"settings.general", time:"2d ago", type:"system" },
];

export default function AdminPage() {
  const [active, setActive] = useState("overview");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "users": return <UsersPanel search={search} setSearch={setSearch}/>;
      case "fraud": return <FraudPanel/>;
      case "audit": return <AuditPanel/>;
      case "revenue": return <RevenuePanel/>;
      default: return <OverviewPanel/>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 h-full z-40 w-64 bg-zinc-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white"/>
            </div>
            <div>
              <div className="text-sm font-black">Placify Admin</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Control Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={()=>{setActive(n.id);setSidebarOpen(false);}}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${active===n.id?"bg-white/10 text-white":"text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-4 h-4 flex-shrink-0"/>
                {n.label}
                {n.badge && <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md">{n.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${active==="settings"?"bg-white/10 text-white":"text-zinc-400 hover:text-white hover:bg-white/5"}`} onClick={()=>setActive("settings")}>
            <Settings className="w-4 h-4"/>Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all" onClick={()=>window.location.href="/"}>
            <LogOut className="w-4 h-4"/>Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-zinc-100" onClick={()=>setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
            </button>
            <h1 className="text-lg font-black text-zinc-900 capitalize">{active === "overview" ? "Platform Overview" : active}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
              <input className="input-brand pl-10 w-56 text-sm" placeholder="Search platform..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-zinc-100">
              <Bell className="w-5 h-5 text-zinc-600"/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"/>
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-black">SA</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {PLATFORM_STATS.map((s,i) => (
          <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="bg-white rounded-2xl p-4 border border-zinc-100 hover:shadow-sm transition-all">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-xl font-black text-zinc-900">{s.value}</div>
            <div className="text-[11px] font-bold text-zinc-500 mt-0.5">{s.label}</div>
            <div className={`text-[10px] font-semibold mt-1 ${s.label==="Fraud Alerts"?"text-red-600":"text-emerald-600"}`}>{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Fraud Alerts Preview */}
      <div className="bg-white rounded-3xl border border-zinc-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black text-zinc-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500"/> Active Fraud Alerts
          </h2>
          <span className="badge-error">3 Pending</span>
        </div>
        <div className="space-y-3">
          {FRAUD_ALERTS.map((a,i) => (
            <motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.1}}
              className="flex items-start gap-4 p-4 rounded-2xl border border-red-100 bg-red-50/50">
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.severity==="High"?"text-red-500":a.severity==="Medium"?"text-amber-500":"text-zinc-400"}`}/>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-zinc-900">{a.user}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{a.reason}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${a.severity==="High"?"badge-error":a.severity==="Medium"?"badge-warn":"text-zinc-500 bg-zinc-100"}`}>{a.severity}</span>
                <div className="text-[10px] text-zinc-400 mt-1">{a.time}</div>
              </div>
              <div className="flex gap-1.5">
                <button className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"><CheckCircle className="w-3.5 h-3.5"/></button>
                <button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"><XCircle className="w-3.5 h-3.5"/></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-3xl border border-zinc-100 p-6">
        <h2 className="text-sm font-black text-zinc-900 mb-5">Recent Registrations</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>User</th><th>Type</th><th>Status</th><th>ATS</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>
              {RECENT_USERS.map((u,i) => (
                <tr key={i}>
                  <td><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black">{u.name[0]}</div><div><div className="font-semibold text-xs">{u.name}</div><div className="text-[10px] text-zinc-400">{u.email}</div></div></div></td>
                  <td><span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${u.type==="Company"?"badge-brand":"text-emerald-700 bg-emerald-50 border border-emerald-200"}`}>{u.type}</span></td>
                  <td><span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${u.status==="Active"?"badge-success":u.status==="Pending"?"badge-warn":"badge-error"}`}>{u.status}</span></td>
                  <td className="font-bold text-xs">{u.ats > 0 ? `${u.ats}%` : "—"}</td>
                  <td className="text-xs text-zinc-500">{u.joined}</td>
                  <td><div className="flex gap-1.5"><button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5"/></button><button className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"><XCircle className="w-3.5 h-3.5"/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersPanel({ search, setSearch }: { search: string; setSearch: (v:string)=>void }) {
  const filtered = RECENT_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
          <input className="input-brand pl-10" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2">
          {["All","Candidates","Companies","Suspended"].map(f=>(
            <button key={f} className="px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 transition-colors">{f}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
        <table className="data-table">
          <thead><tr><th>User</th><th>Type</th><th>Status</th><th>ATS Score</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={i}>
                <td><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black">{u.name[0]}</div><div><div className="font-semibold text-sm">{u.name}</div><div className="text-xs text-zinc-400">{u.email}</div></div></div></td>
                <td><span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${u.type==="Company"?"badge-brand":"text-emerald-700 bg-emerald-50 border border-emerald-200"}`}>{u.type}</span></td>
                <td><span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${u.status==="Active"?"badge-success":u.status==="Pending"?"badge-warn":"badge-error"}`}>{u.status}</span></td>
                <td className="font-black text-sm">{u.ats>0?`${u.ats}%`:"—"}</td>
                <td className="text-xs text-zinc-500">{u.joined}</td>
                <td><div className="flex gap-1.5"><button className="p-1.5 rounded-lg hover:bg-blue-50 text-zinc-400 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5"/></button><button className="p-1.5 rounded-lg hover:bg-amber-50 text-zinc-400 hover:text-amber-600 transition-colors"><Lock className="w-3.5 h-3.5"/></button><button className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"><XCircle className="w-3.5 h-3.5"/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FraudPanel() {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0"/>
        <p className="text-sm font-semibold text-red-700">3 active fraud alerts require your immediate attention.</p>
      </div>
      {FRAUD_ALERTS.map((a,i)=>(
        <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
          className="bg-white rounded-3xl border border-zinc-100 p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.severity==="High"?"bg-red-50":a.severity==="Medium"?"bg-amber-50":"bg-zinc-50"}`}>
              <AlertTriangle className={`w-5 h-5 ${a.severity==="High"?"text-red-500":a.severity==="Medium"?"text-amber-500":"text-zinc-400"}`}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-zinc-900 text-sm">{a.user}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${a.severity==="High"?"badge-error":a.severity==="Medium"?"badge-warn":"text-zinc-500 bg-zinc-100"}`}>{a.severity} Risk</span>
              </div>
              <p className="text-xs text-zinc-600 mb-3">{a.reason}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors"><CheckCircle className="w-3.5 h-3.5"/>Resolve</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors"><XCircle className="w-3.5 h-3.5"/>Ban User</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-100 transition-colors"><Eye className="w-3.5 h-3.5"/>Investigate</button>
              </div>
            </div>
            <div className="text-xs text-zinc-400">{a.time}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AuditPanel() {
  return (
    <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
      <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="font-black text-zinc-900">Audit Log</h2>
        <button className="btn-outline-brand text-xs py-2 px-4 rounded-xl">Export CSV</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Action</th><th>Actor</th><th>Target</th><th>Type</th><th>Time</th></tr></thead>
        <tbody>
          {AUDIT_LOG.map((l,i)=>(
            <tr key={i}>
              <td className="font-semibold">{l.action}</td>
              <td className="text-zinc-500">{l.actor}</td>
              <td className="font-mono text-xs text-zinc-400">{l.target}</td>
              <td><span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${l.type==="security"?"badge-error":l.type==="billing"?"badge-warn":l.type==="content"?"badge-brand":"text-zinc-600 bg-zinc-100"}`}>{l.type}</span></td>
              <td className="text-zinc-500 text-xs">{l.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RevenuePanel() {
  const plans = [
    { name:"Starter", count:42, mrr:"₹4.2L", color:"bg-zinc-100" },
    { name:"Growth", count:89, mrr:"₹22.2L", color:"bg-blue-100" },
    { name:"Enterprise", count:25, mrr:"₹21.8L", color:"bg-violet-100" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label:"Monthly Recurring Revenue", value:"₹48.2L", change:"+22%" },
          { label:"Annual Run Rate", value:"₹5.8Cr", change:"+18%" },
          { label:"Total Subscriptions", value:"156", change:"+12" },
        ].map((m,i)=>(
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="bg-white rounded-3xl border border-zinc-100 p-6">
            <div className="text-3xl font-black text-zinc-900 mb-1">{m.value}</div>
            <div className="text-xs text-zinc-500 font-bold mb-2">{m.label}</div>
            <span className="badge-success text-[10px]">{m.change} MoM</span>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-zinc-100 p-6">
        <h2 className="text-sm font-black text-zinc-900 mb-5">Revenue by Plan</h2>
        <div className="space-y-4">
          {plans.map((p,i)=>(
            <div key={i} className="flex items-center gap-4">
              <span className={`w-20 text-xs font-bold px-2.5 py-1.5 rounded-xl ${p.color} text-zinc-700`}>{p.name}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-600">{p.count} companies</span>
                  <span className="font-black text-zinc-900">{p.mrr}/mo</span>
                </div>
                <div className="progress-bar-bg">
                  <motion.div className="progress-bar-fill" initial={{width:0}} animate={{width:`${(p.count/156)*100}%`}} transition={{duration:0.8,delay:0.3+i*0.15}} style={{borderRadius:"99px"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
