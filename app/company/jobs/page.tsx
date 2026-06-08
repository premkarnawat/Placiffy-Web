"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Briefcase, X, RefreshCw, CheckCircle,
  Sparkles, MapPin, Clock, ChevronRight, Filter,
  ArrowLeft
} from "lucide-react";

interface Job { id:number; title:string; dept:string; location:string; type:string; applicants:number; ats_avg:number; posted:string; status:"Active"|"Paused"|"Closed"; }

const SAMPLE_JOBS: Job[] = [
  { id:1, title:"Senior React Developer", dept:"Engineering", location:"Bangalore", type:"Full-time", applicants:42, ats_avg:88, posted:"2d ago", status:"Active" },
  { id:2, title:"Product Designer", dept:"Design", location:"Remote", type:"Full-time", applicants:31, ats_avg:82, posted:"4d ago", status:"Active" },
  { id:3, title:"Data Scientist", dept:"AI/ML", location:"Mumbai", type:"Full-time", applicants:28, ats_avg:91, posted:"1w ago", status:"Active" },
  { id:4, title:"DevOps Engineer", dept:"Infrastructure", location:"Hyderabad", type:"Full-time", applicants:19, ats_avg:79, posted:"1w ago", status:"Paused" },
  { id:5, title:"Backend Engineer", dept:"Engineering", location:"Pune", type:"Full-time", applicants:35, ats_avg:85, posted:"3d ago", status:"Active" },
];

const JD_RESULT = {
  skills_required: ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
  skills_optional: ["Redis", "Docker", "AWS", "Kubernetes"],
  experience: "4-7 years",
  salary: "₹18L - ₹32L per annum",
  location: "Bangalore / Remote",
  interview_focus: ["System Design", "React Advanced Patterns", "Code Quality", "Problem Solving"],
  summary: "Senior frontend role requiring deep React expertise with API integration experience. Culture fit emphasis on ownership and documentation habits.",
};

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [jdText, setJdText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [newJob, setNewJob] = useState({ title:"", dept:"Engineering", location:"", type:"Full-time", salary:"" });
  const [creating, setCreating] = useState(false);

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.dept.toLowerCase().includes(search.toLowerCase()));

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnalyzing(false);
    setAnalyzed(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await new Promise(r => setTimeout(r, 1200));
    setJobs(p => [...p, { id:p.length+1, title:newJob.title||"New Job", dept:newJob.dept, location:newJob.location||"Remote", type:newJob.type, applicants:0, ats_avg:0, posted:"Just now", status:"Active" }]);
    setCreating(false);
    setShowCreate(false);
    setJdText(""); setAnalyzed(false);
    setNewJob({ title:"", dept:"Engineering", location:"", type:"Full-time", salary:"" });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={()=>window.location.href="/company/dashboard"} className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600"/>
          </button>
          <div>
            <h1 className="text-lg font-black text-zinc-900">Job Management</h1>
            <p className="text-xs text-zinc-500">{jobs.length} active positions</p>
          </div>
        </div>
        <button onClick={()=>setShowCreate(true)} className="btn-brand text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5"/> Post New Job
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search + filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
            <input className="input-brand pl-10" placeholder="Search jobs..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter className="w-4 h-4"/> Filter
          </button>
        </div>

        {/* Jobs grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job,i) => (
            <motion.div key={job.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="bg-white rounded-3xl border border-zinc-100 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer card-lift"
              onClick={()=>window.location.href="/company/candidates"}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-500"/>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${job.status==="Active"?"badge-success":job.status==="Paused"?"badge-warn":"badge-error"}`}>
                  {job.status}
                </span>
              </div>
              <h3 className="font-black text-zinc-900 mb-1">{job.title}</h3>
              <p className="text-xs text-zinc-500 mb-4">{job.dept}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 text-[11px] text-zinc-500"><MapPin className="w-3 h-3"/>{job.location}</span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-500"><Clock className="w-3 h-3"/>{job.posted}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-base font-black text-zinc-900">{job.applicants}</div>
                    <div className="text-[10px] text-zinc-400 font-bold">Applicants</div>
                  </div>
                  {job.ats_avg > 0 && <div>
                    <div className="text-base font-black text-blue-600">{job.ats_avg}%</div>
                    <div className="text-[10px] text-zinc-400 font-bold">Avg ATS</div>
                  </div>}
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300"/>
              </div>
            </motion.div>
          ))}

          {/* Add new card */}
          <motion.button initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:filtered.length*0.06}}
            onClick={()=>setShowCreate(true)}
            className="bg-white/60 rounded-3xl border-2 border-dashed border-zinc-200 p-5 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center min-h-[220px] gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-500"/>
            </div>
            <span className="text-sm font-bold text-zinc-500">Post New Job</span>
          </motion.button>
        </div>
      </div>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
              transition={{duration:0.35,ease:[0.23,1,0.32,1]}}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-100">

              <div className="p-6 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                <div>
                  <h2 className="text-xl font-black text-zinc-900">Post New Job</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Paste your JD to auto-analyze with AI</p>
                </div>
                <button onClick={()=>{setShowCreate(false);setAnalyzed(false);setJdText("");}} className="p-2 rounded-xl hover:bg-zinc-100">
                  <X className="w-5 h-5 text-zinc-500"/>
                </button>
              </div>

              <div className="p-6 space-y-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Job Title *</label>
                      <input className="input-brand" required placeholder="Senior React Developer" value={newJob.title} onChange={e=>setNewJob(p=>({...p,title:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Department</label>
                      <select className="input-brand" value={newJob.dept} onChange={e=>setNewJob(p=>({...p,dept:e.target.value}))}>
                        {["Engineering","Design","Product","AI/ML","Sales","Marketing","HR","Operations","Finance"].map(d=><option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Location</label>
                      <input className="input-brand" placeholder="Bangalore / Remote" value={newJob.location} onChange={e=>setNewJob(p=>({...p,location:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Employment Type</label>
                      <select className="input-brand" value={newJob.type} onChange={e=>setNewJob(p=>({...p,type:e.target.value}))}>
                        {["Full-time","Part-time","Contract","Internship"].map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* JD Paste + Analyze */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Job Description</label>
                      {jdText && !analyzed && (
                        <button type="button" onClick={handleAnalyze} disabled={analyzing}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                          {analyzing?<RefreshCw className="w-3 h-3 animate-spin"/>:<Sparkles className="w-3 h-3"/>}
                          {analyzing?"Analyzing...":"Analyze with AI"}
                        </button>
                      )}
                    </div>
                    <textarea className="input-brand resize-none" rows={5} placeholder="Paste your full job description here..."
                      value={jdText} onChange={e=>{setJdText(e.target.value);setAnalyzed(false);}}/>
                  </div>

                  {/* JD Analysis Results */}
                  <AnimatePresence>
                    {analyzed && (
                      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                        className="bg-blue-50 rounded-2xl p-4 border border-blue-100 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-blue-500"/>
                          <span className="text-xs font-bold text-blue-700">AI Analysis Complete</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Required Skills</div>
                          <div className="flex flex-wrap gap-1.5">
                            {JD_RESULT.skills_required.map((s,i)=><span key={i} className="badge-brand text-[10px] py-0.5">{s}</span>)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Good to Have</div>
                          <div className="flex flex-wrap gap-1.5">
                            {JD_RESULT.skills_optional.map((s,i)=><span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-zinc-200 rounded-lg font-semibold text-zinc-600">{s}</span>)}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white rounded-xl p-2.5 border border-zinc-100">
                            <div className="font-black text-zinc-900">{JD_RESULT.experience}</div>
                            <div className="text-zinc-400 font-bold text-[10px] mt-0.5">Experience</div>
                          </div>
                          <div className="bg-white rounded-xl p-2.5 border border-zinc-100">
                            <div className="font-black text-zinc-900 text-[11px]">{JD_RESULT.salary}</div>
                            <div className="text-zinc-400 font-bold text-[10px] mt-0.5">Salary Range</div>
                          </div>
                          <div className="bg-white rounded-xl p-2.5 border border-zinc-100">
                            <div className="font-black text-zinc-900 text-[11px]">{JD_RESULT.location}</div>
                            <div className="text-zinc-400 font-bold text-[10px] mt-0.5">Location</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Interview Focus Areas</div>
                          <div className="flex flex-wrap gap-1.5">
                            {JD_RESULT.interview_focus.map((f,i)=><span key={i} className="text-[10px] px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-bold">{f}</span>)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={creating} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2">
                    {creating?<RefreshCw className="w-4 h-4 animate-spin"/>:null}
                    <span>{creating?"Creating Job...":"Post Job"}</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
