"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, DollarSign, Briefcase, Clock, Bookmark, CheckCircle, X, ArrowLeft, Zap, Target, ChevronRight } from "lucide-react";

const JOBS = [
  { id:1, title:"Senior React Developer", company:"FinCore Technologies", location:"Bangalore", type:"Full-time", salary:"₹22L–₹32L", match:96, skills_matched:["React","TypeScript","Node.js","GraphQL"], skills_missing:["Kubernetes"], posted:"2d", logo:"F", logoColor:"bg-blue-500", urgent:true },
  { id:2, title:"Frontend Engineer", company:"NeoScale Ventures", location:"Remote", type:"Full-time", salary:"₹18L–₹25L", match:91, skills_matched:["React","CSS","JavaScript","Redux"], skills_missing:["Docker"], posted:"1d", logo:"N", logoColor:"bg-emerald-500", urgent:false },
  { id:3, title:"Full Stack Developer", company:"BuildRight Corp", location:"Pune", type:"Full-time", salary:"₹16L–₹24L", match:87, skills_matched:["React","Node.js","PostgreSQL"], skills_missing:["AWS","Redis"], posted:"3d", logo:"B", logoColor:"bg-violet-500", urgent:false },
  { id:4, title:"React Native Developer", company:"CloudNova Systems", location:"Hyderabad", type:"Full-time", salary:"₹14L–₹20L", match:84, skills_matched:["React","JavaScript","Mobile"], skills_missing:["React Native","Expo"], posted:"5d", logo:"C", logoColor:"bg-amber-500", urgent:false },
  { id:5, title:"Tech Lead — Frontend", company:"GrowthLab Inc", location:"Mumbai", type:"Full-time", salary:"₹28L–₹42L", match:82, skills_matched:["React","TypeScript","Leadership"], skills_missing:["Micro-frontends"], posted:"1w", logo:"G", logoColor:"bg-pink-500", urgent:true },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);
  const [selected, setSelected] = useState<typeof JOBS[0]|null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = JOBS.filter(j =>
    (filter === "All" || (filter === "90%+" && j.match >= 90) || (filter === "Saved" && saved.includes(j.id))) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  };

  const handleApply = (id: number) => {
    setApplied(p => [...p, id]);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={()=>window.location.href="/dashboard"} className="p-2 rounded-xl hover:bg-zinc-100">
          <ArrowLeft className="w-5 h-5 text-zinc-600"/>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-zinc-900">Matched Jobs</h1>
          <p className="text-xs text-zinc-500">{JOBS.length} opportunities tailored to your profile</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* ATS match info banner */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-900">Showing AI-matched jobs for your profile</div>
            <div className="text-xs text-blue-600">Jobs are ranked by your ATS match score. Only 80%+ matches shown.</div>
          </div>
        </motion.div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
            <input className="input-brand pl-10" placeholder="Search jobs, companies..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="flex gap-2">
            {["All","90%+","Saved"].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${filter===f?"bg-zinc-900 text-white border-zinc-900":"bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs list */}
        <div className="space-y-3">
          {filtered.map((job,i) => (
            <motion.div key={job.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              onClick={()=>setSelected(job)}
              className="bg-white rounded-3xl border border-zinc-100 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${job.logoColor} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-zinc-900">{job.title}</h3>
                        {job.urgent && <span className="badge-warn text-[9px] py-0.5">Urgent</span>}
                      </div>
                      <p className="text-sm text-zinc-600 font-medium">{job.company}</p>
                    </div>
                    {/* Match score */}
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-xl font-black ${job.match>=90?"text-emerald-600":job.match>=85?"text-blue-600":"text-amber-600"}`}>{job.match}%</div>
                      <div className="text-[10px] text-zinc-400 font-bold">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3"/>{job.salary}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{job.posted} ago</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/>{job.type}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.skills_matched.map((s,si) => (
                      <span key={si} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-bold">
                        <CheckCircle className="w-2.5 h-2.5"/>{s}
                      </span>
                    ))}
                    {job.skills_missing.map((s,si) => (
                      <span key={si} className="text-[10px] px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded-lg font-bold">{s} missing</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={(e)=>{e.stopPropagation();if(!applied.includes(job.id))handleApply(job.id);}}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${applied.includes(job.id)?"bg-emerald-50 text-emerald-600 border border-emerald-200":"btn-brand"}`}>
                      {applied.includes(job.id) ? "✓ Applied" : "Quick Apply"}
                    </button>
                    <button onClick={(e)=>toggleSave(job.id,e)}
                      className={`p-2 rounded-xl border transition-all ${saved.includes(job.id)?"bg-amber-50 border-amber-200 text-amber-500":"border-zinc-200 text-zinc-400 hover:text-amber-500 hover:border-amber-200"}`}>
                      <Bookmark className={`w-4 h-4 ${saved.includes(job.id)?"fill-amber-500":""}`}/>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-100">
              <Target className="w-10 h-10 text-zinc-300 mx-auto mb-3"/>
              <h3 className="font-bold text-zinc-600 mb-1">No matching jobs found</h3>
              <p className="text-sm text-zinc-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Job detail sheet */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm" onClick={()=>setSelected(null)}>
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}}
              transition={{duration:0.35,ease:[0.23,1,0.32,1]}}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-100 max-h-[80vh] overflow-y-auto"
              onClick={e=>e.stopPropagation()}>
              <div className="p-5 border-b border-zinc-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${selected.logoColor} flex items-center justify-center text-white font-black text-lg`}>{selected.logo}</div>
                  <div>
                    <h2 className="font-black text-zinc-900">{selected.title}</h2>
                    <p className="text-sm text-zinc-500">{selected.company} · {selected.location}</p>
                  </div>
                </div>
                <button onClick={()=>setSelected(null)} className="p-2 rounded-xl hover:bg-zinc-100"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-600">{selected.match}%</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-0.5">Your Match</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                    <div className="text-2xl font-black text-blue-600">{selected.salary.split("–")[0]}</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-0.5">Min Salary</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Skills Matched</div>
                  <div className="flex flex-wrap gap-1.5">{selected.skills_matched.map((s,i)=><span key={i} className="badge-success text-[10px] py-0.5">{s}</span>)}</div>
                </div>
                {selected.skills_missing.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Skills to Develop</div>
                    <div className="flex flex-wrap gap-1.5">{selected.skills_missing.map((s,i)=><span key={i} className="badge-error text-[10px] py-0.5">{s}</span>)}</div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={()=>handleApply(selected.id)} disabled={applied.includes(selected.id)}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all ${applied.includes(selected.id)?"bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default":"btn-brand"}`}>
                    {applied.includes(selected.id) ? "✓ Application Sent" : "Apply Now"}
                  </button>
                  <button onClick={(e)=>toggleSave(selected.id,e)}
                    className={`p-3.5 rounded-2xl border transition-all ${saved.includes(selected.id)?"bg-amber-50 border-amber-200 text-amber-500":"border-zinc-200 text-zinc-400 hover:border-amber-200 hover:text-amber-500"}`}>
                    <Bookmark className={`w-5 h-5 ${saved.includes(selected.id)?"fill-amber-500":""}`}/>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
