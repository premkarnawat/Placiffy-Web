"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, ArrowLeft, Award, CheckCircle, XCircle, Clock, ChevronRight, Filter, RefreshCw, X, User } from "lucide-react";

const COLUMNS = [
  { id:"applicants", label:"Applicants", color:"bg-zinc-100 text-zinc-600", count:42 },
  { id:"ats_matched", label:"ATS Matched", color:"bg-blue-100 text-blue-700", count:28 },
  { id:"interested", label:"Interested", color:"bg-indigo-100 text-indigo-700", count:19 },
  { id:"verification", label:"Verification", color:"bg-violet-100 text-violet-700", count:14 },
  { id:"verified", label:"Verified", color:"bg-emerald-100 text-emerald-700", count:11 },
  { id:"interview", label:"Interview", color:"bg-amber-100 text-amber-700", count:8 },
  { id:"offer", label:"Offer Sent", color:"bg-orange-100 text-orange-700", count:4 },
  { id:"joined", label:"Joined", color:"bg-green-100 text-green-700", count:3 },
];

interface Candidate { id:number; name:string; role:string; ats:number; trust:number; stage:string; skills:string[]; verified:boolean; }

const CANDIDATES: Candidate[] = [
  { id:1, name:"Neha Joshi", role:"Senior React Dev", ats:96, trust:94, stage:"interview", skills:["React","TypeScript","Node.js"], verified:true },
  { id:2, name:"Arjun Nair", role:"React Developer", ats:91, trust:89, stage:"verified", skills:["React","Redux","GraphQL"], verified:true },
  { id:3, name:"Priya Sharma", role:"Frontend Eng", ats:87, trust:85, stage:"ats_matched", skills:["React","CSS","JavaScript"], verified:false },
  { id:4, name:"Kiran Verma", role:"Full Stack Dev", ats:94, trust:91, stage:"offer", skills:["React","Python","AWS"], verified:true },
  { id:5, name:"Rohan Gupta", role:"React Lead", ats:88, trust:82, stage:"ats_matched", skills:["React","Next.js","TypeScript"], verified:false },
  { id:6, name:"Ananya Singh", role:"UI Developer", ats:82, trust:79, stage:"applicants", skills:["React","Figma","CSS"], verified:false },
];

export default function CompanyCandidatesPage() {
  const [view, setView] = useState<"kanban"|"list">("kanban");
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Candidate|null>(null);
  const [uploading, setUploading] = useState(false);

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  const handleBulkUpload = async () => {
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    setUploading(false);
  };

  const getColCandidates = (colId: string) => filtered.filter(c => c.stage === colId);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={()=>window.location.href="/company/dashboard"} className="p-2 rounded-xl hover:bg-zinc-100">
            <ArrowLeft className="w-5 h-5 text-zinc-600"/>
          </button>
          <div>
            <h1 className="text-lg font-black text-zinc-900">Candidate Pipeline</h1>
            <p className="text-xs text-zinc-500">Senior React Developer · {candidates.length} candidates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
            {(["kanban","list"] as const).map(v => (
              <button key={v} onClick={()=>setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${view===v?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>
                {v}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 btn-outline-brand text-xs py-2.5 px-4 rounded-xl cursor-pointer">
            <input type="file" accept=".csv,.zip" className="hidden" onChange={handleBulkUpload}/>
            {uploading?<RefreshCw className="w-3.5 h-3.5 animate-spin"/>:<Upload className="w-3.5 h-3.5"/>}
            Bulk Upload
          </label>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-x-auto">
        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
          <input className="input-brand pl-10" placeholder="Search candidates..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {view === "kanban" ? (
          <div className="flex gap-4 pb-4" style={{minWidth:"max-content"}}>
            {COLUMNS.map(col => {
              const colCandidates = getColCandidates(col.id);
              return (
                <div key={col.id} className="kanban-col flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${col.color}`}>{col.label}</span>
                    <span className="text-xs font-black text-zinc-500">{colCandidates.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {colCandidates.map((c,i) => (
                      <motion.div key={c.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                        className="kanban-card" onClick={()=>setSelected(c)}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-600">
                            {c.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-zinc-900 truncate">{c.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{c.role}</div>
                          </div>
                          {c.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>}
                        </div>
                        <div className="flex justify-between">
                          <div className="text-center">
                            <div className="text-sm font-black text-zinc-900">{c.ats}%</div>
                            <div className="text-[9px] text-zinc-400 font-bold">ATS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-black text-blue-600">{c.trust}%</div>
                            <div className="text-[9px] text-zinc-400 font-bold">Trust</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Candidate</th><th>Role</th><th>ATS Score</th><th>Trust Score</th><th>Stage</th><th>Verified</th><th></th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="cursor-pointer hover:bg-zinc-50" onClick={()=>setSelected(c)}>
                    <td><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black">{c.name[0]}</div><span className="font-semibold">{c.name}</span></div></td>
                    <td className="text-zinc-500">{c.role}</td>
                    <td><span className="font-black text-zinc-900">{c.ats}%</span></td>
                    <td><span className="font-black text-blue-600">{c.trust}%</span></td>
                    <td><span className="badge-brand text-[10px] py-0.5 capitalize">{c.stage.replace("_"," ")}</span></td>
                    <td>{c.verified?<CheckCircle className="w-4 h-4 text-emerald-500"/>:<XCircle className="w-4 h-4 text-zinc-300"/>}</td>
                    <td><ChevronRight className="w-4 h-4 text-zinc-300"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate detail panel */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/20 backdrop-blur-sm" onClick={()=>setSelected(null)}>
            <motion.div initial={{opacity:0,x:80}} animate={{opacity:1,x:0}} exit={{opacity:0,x:80}}
              transition={{duration:0.35,ease:[0.23,1,0.32,1]}}
              className="bg-white w-full sm:w-96 h-full sm:h-screen overflow-y-auto border-l border-zinc-200 shadow-2xl"
              onClick={e=>e.stopPropagation()}>
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-black text-zinc-900">Candidate Profile</h3>
                <button onClick={()=>setSelected(null)} className="p-2 rounded-xl hover:bg-zinc-100"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl font-black text-zinc-600">{selected.name[0]}</div>
                  <div>
                    <div className="font-black text-zinc-900">{selected.name}</div>
                    <div className="text-sm text-zinc-500">{selected.role}</div>
                    {selected.verified && <span className="badge-success text-[10px] py-0.5 mt-1 inline-block">Verified ✓</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label:"ATS Score", val:`${selected.ats}%`, color:"text-zinc-900" },{ label:"Trust Score", val:`${selected.trust}%`, color:"text-blue-600" }].map((m,i)=>(
                    <div key={i} className="bg-zinc-50 rounded-2xl p-4 text-center border border-zinc-100">
                      <div className={`text-2xl font-black ${m.color}`}>{m.val}</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">{selected.skills.map((s,i)=><span key={i} className="badge-brand">{s}</span>)}</div>
                </div>
                <div className="space-y-2.5">
                  <button className="w-full btn-brand py-3 rounded-2xl text-sm">Schedule Interview</button>
                  <button className="w-full btn-outline-brand py-3 rounded-2xl text-sm">Send Offer</button>
                  <button className="w-full py-3 rounded-2xl text-sm border border-zinc-200 font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">View Full Passport</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
