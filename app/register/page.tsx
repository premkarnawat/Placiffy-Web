"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, RefreshCw, CheckCircle, ArrowRight, ArrowLeft, User, Mail, Phone, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const STEPS = ["Basic Info", "Resume Upload", "Profile Review"];

interface Profile {
  name: string; email: string; phone: string;
  skills: string[]; experience: string; education: string;
  linkedin: string; github: string; portfolio: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", loginMethod:"email" });
  const [resumeFile, setResumeFile] = useState<File|null>(null);
  const [parsing, setParsing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name:"", email:"", phone:"", skills:[], experience:"", education:"", linkedin:"", github:"", portfolio:""
  });
  const [done, setDone] = useState(false);

  const handleSocial = async (provider: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setForm(p => ({ ...p, loginMethod: provider, name: "Alex Johnson", email: "alex@example.com", phone: "+91 98765 43210" }));
    setLoading(false);
    setStep(1);
  };

  const handleBasicNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setParsing(true);
    await new Promise(r => setTimeout(r, 2000));
    setParsing(false);
    setProfile({
      name: form.name || "Alexander Johnson",
      email: form.email || "alex@example.com",
      phone: form.phone || "+91 98765 43210",
      skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker"],
      experience: "4 years — Senior Frontend Engineer at FinCore Technologies",
      education: "B.Tech Computer Science — IIT Bombay, 2020",
      linkedin: "linkedin.com/in/alexjohnson",
      github: "github.com/alexjohnson",
      portfolio: "alexjohnson.dev"
    });
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "pending"}`}>
              {i < step ? "✓" : i+1}
            </div>
            <span className={`text-[10px] font-bold mt-1.5 ${i === step ? "text-blue-600" : i < step ? "text-emerald-600" : "text-zinc-400"}`}>
              {s}
            </span>
          </div>
          {i < STEPS.length-1 && <div className={`step-line mb-5 ${i < step ? "done" : ""}`}/>}
        </React.Fragment>
      ))}
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
        className="text-center bg-white rounded-3xl p-12 shadow-sm border border-zinc-200 max-w-sm mx-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-500"/>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Welcome to Placify!</h2>
        <p className="text-sm text-zinc-500">Your profile is being set up. Redirecting to your dashboard...</p>
        <div className="mt-5 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-500 rounded-full" initial={{width:0}} animate={{width:"100%"}} transition={{duration:2}}/>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] bg-grid flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"/>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Placify" className="h-10 w-auto rounded-xl object-contain mix-blend-multiply"/>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">
          <StepIndicator/>

          <AnimatePresence mode="wait">
            {/* ─ Step 0: Basic Info ─ */}
            {step === 0 && (
              <motion.div key="s0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-2xl font-black text-zinc-900 mb-1">Create Your Account</h1>
                <p className="text-sm text-zinc-500 mb-7">Join Placify's verified talent network</p>

                <div className="space-y-2.5 mb-6">
                  {[
                    { name:"Google", bg:"#fff", border:"#E8EAED", textColor:"#374151", logo:<svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg> },
                    { name:"LinkedIn", bg:"#0A66C2", border:"#0A66C2", textColor:"#fff", logo:<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { name:"GitHub", bg:"#24292F", border:"#24292F", textColor:"#fff", logo:<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg> },
                  ].map(s => (
                    <button key={s.name} onClick={() => handleSocial(s.name)}
                      style={{ background: s.bg, borderColor: s.border, color: s.textColor }}
                      className="w-full flex items-center justify-center gap-2.5 border py-3 rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-sm transition-all">
                      {s.logo} Continue with {s.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-zinc-100"/><span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">or</span><div className="flex-1 h-px bg-zinc-100"/>
                </div>

                <form onSubmit={handleBasicNext} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                      <input className="input-brand" type="text" required placeholder="John Doe" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Mobile *</label>
                      <input className="input-brand" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Email Address *</label>
                    <input className="input-brand" type="email" required placeholder="you@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                  </div>
                  <button type="submit" className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2">
                    Continue <ArrowRight className="w-4 h-4"/>
                  </button>
                </form>

                <p className="text-center text-xs text-zinc-500 mt-5">
                  Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
              </motion.div>
            )}

            {/* ─ Step 1: Resume Upload ─ */}
            {step === 1 && (
              <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h2 className="text-2xl font-black text-zinc-900 mb-1">Upload Your Resume</h2>
                <p className="text-sm text-zinc-500 mb-7">Our AI will auto-fill your profile from your resume</p>

                {parsing ? (
                  <div className="flex flex-col items-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 relative">
                      <RefreshCw className="w-7 h-7 text-blue-500 animate-spin"/>
                      <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 animate-ping opacity-30"/>
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-1">AI Parsing Resume...</h3>
                    <p className="text-sm text-zinc-500 text-center max-w-xs">Extracting skills, experience, education, and contact details automatically</p>
                    <div className="mt-6 w-full max-w-xs h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-blue-500 rounded-full" initial={{width:0}} animate={{width:"100%"}} transition={{duration:2}}/>
                    </div>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-zinc-200 rounded-3xl p-10 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
                    <input type="file" accept=".pdf,.docx" className="hidden" onChange={e=>e.target.files?.[0]&&handleResumeUpload(e.target.files[0])}/>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-blue-500"/>
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-1">Drop your resume here</h3>
                    <p className="text-xs text-zinc-500 mb-4">PDF or DOCX · Max 10MB</p>
                    <div className="inline-block btn-brand text-xs px-6 py-2.5 rounded-xl">Browse Files</div>
                  </label>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={()=>setStep(0)} className="btn-outline-brand flex-1 py-3 rounded-2xl flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5"/> Back
                  </button>
                  <button onClick={()=>setStep(2)} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-zinc-500 border border-zinc-200 hover:bg-zinc-50 transition-colors">
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─ Step 2: Profile Review ─ */}
            {step === 2 && (
              <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500"/>
                  <h2 className="text-xl font-black text-zinc-900">Profile Pre-Filled!</h2>
                </div>
                <p className="text-sm text-zinc-500 mb-6">Review and verify your extracted information</p>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {[
                    { icon:<User className="w-4 h-4"/>, label:"Name", val: profile.name || form.name },
                    { icon:<Mail className="w-4 h-4"/>, label:"Email", val: profile.email || form.email },
                    { icon:<Phone className="w-4 h-4"/>, label:"Phone", val: profile.phone || form.phone },
                    { icon:<Linkedin className="w-4 h-4"/>, label:"LinkedIn", val: profile.linkedin },
                    { icon:<Github className="w-4 h-4"/>, label:"GitHub", val: profile.github },
                  ].map((f,i) => (
                    <div key={i}>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">{f.icon}{f.label}</label>
                      <input className="input-brand" type="text" defaultValue={f.val} placeholder={`Enter ${f.label.toLowerCase()}...`}/>
                    </div>
                  ))}

                  {profile.skills.length > 0 && (
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Skills Extracted</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((s,i) => (
                          <span key={i} className="badge-brand">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.experience && (
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Experience</label>
                      <input className="input-brand" type="text" defaultValue={profile.experience}/>
                    </div>
                  )}
                  {profile.education && (
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Education</label>
                      <input className="input-brand" type="text" defaultValue={profile.education}/>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={()=>setStep(1)} className="btn-outline-brand py-3 px-5 rounded-2xl flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={handleFinish} disabled={loading} className="btn-brand flex-1 py-4 rounded-2xl flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
                    <span>{loading ? "Setting up..." : "Complete Registration"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
