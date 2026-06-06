"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Globe, Users, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, Mail } from "lucide-react";
import Link from "next/link";

const STEPS = ["Company Info", "Verification", "Get Access"];

export default function CompanyRegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", website:"", industry:"Technology", size:"51-200", email:"", domain:"" });
  const [otp, setOtp] = useState(["","","","","",""]);
  const [done, setDone] = useState(false);

  const handleOtpChange = (val: string, idx: number) => {
    if (val.length > 1) return;
    const arr = [...otp]; arr[idx] = val;
    setOtp(arr);
    if (val && idx < 5) { const next = document.getElementById(`cotp-${idx+1}`); (next as HTMLInputElement)?.focus(); }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep(1);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
    setTimeout(() => { window.location.href = "/company/dashboard"; }, 2000);
  };

  const StepBar = () => (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s,i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`step-dot ${i<step?"done":i===step?"active":"pending"}`}>{i<step?"✓":i+1}</div>
            <span className={`text-[10px] font-bold mt-1.5 whitespace-nowrap ${i===step?"text-blue-600":i<step?"text-emerald-600":"text-zinc-400"}`}>{s}</span>
          </div>
          {i<STEPS.length-1&&<div className={`step-line mb-5 ${i<step?"done":""}`}/>}
        </React.Fragment>
      ))}
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
        className="text-center bg-white rounded-3xl p-12 shadow-sm border border-zinc-200 max-w-sm mx-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-blue-500"/>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Account Created!</h2>
        <p className="text-sm text-zinc-500">Setting up your hiring workspace...</p>
        <div className="mt-5 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-blue-500 rounded-full" initial={{width:0}} animate={{width:"100%"}} transition={{duration:2}}/>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] bg-grid flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/6 blur-[120px] pointer-events-none"/>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Placify" className="h-10 w-auto rounded-xl object-contain mix-blend-multiply"/>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">
          <StepBar/>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="c0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-2xl font-black text-zinc-900 mb-1">Register Your Company</h1>
                <p className="text-sm text-zinc-500 mb-7">Set up your hiring workspace on Placify</p>
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Company Name *</label>
                    <input className="input-brand" required placeholder="Acme Technologies" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Website</label>
                      <input className="input-brand" placeholder="acme.com" value={form.website} onChange={e=>setForm(p=>({...p,website:e.target.value}))}/>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Team Size</label>
                      <select className="input-brand" value={form.size} onChange={e=>setForm(p=>({...p,size:e.target.value}))}>
                        {["1-10","11-50","51-200","201-1000","1000+"].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Industry</label>
                    <select className="input-brand" value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))}>
                      {["Technology","Finance","Healthcare","E-Commerce","Manufacturing","Education","Other"].map(i=><option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Work Email *</label>
                    <input className="input-brand" type="email" required placeholder="hr@acme.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2">
                    {loading?<RefreshCw className="w-4 h-4 animate-spin"/>:null}
                    <span>Continue</span> <ArrowRight className="w-4 h-4"/>
                  </button>
                </form>
                <p className="text-center text-xs text-zinc-500 mt-5">Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link></p>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="c1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4"><Mail className="w-5 h-5 text-blue-500"/></div>
                <h2 className="text-xl font-black text-zinc-900 mb-1">Verify Your Domain</h2>
                <p className="text-sm text-zinc-500 mb-2">We sent a 6-digit OTP to <strong>{form.email || "your work email"}</strong></p>
                <p className="text-xs text-zinc-400 mb-6">This confirms your company domain ownership</p>
                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="flex gap-2 justify-between">
                    {otp.map((v,i) => (
                      <input key={i} id={`cotp-${i}`} maxLength={1} value={v} onChange={e=>handleOtpChange(e.target.value,i)}
                        className="w-11 h-12 text-center text-lg font-black input-brand rounded-xl"/>
                    ))}
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2">
                    {loading?<RefreshCw className="w-4 h-4 animate-spin"/>:<CheckCircle className="w-4 h-4"/>}
                    <span>Verify & Continue</span>
                  </button>
                </form>
                <button onClick={()=>setStep(0)} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 mt-4 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5"/> Back
                </button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="c2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-500"/>
                </div>
                <h2 className="text-2xl font-black text-zinc-900 mb-2">Domain Verified!</h2>
                <p className="text-sm text-zinc-500 mb-8 max-w-xs mx-auto">Your company account is ready. Start posting jobs and finding verified candidates.</p>
                <div className="grid grid-cols-3 gap-3 mb-8 text-left">
                  {[
                    { icon:<Building2 className="w-5 h-5 text-blue-500"/>, label:"Active Jobs", val:"Unlimited" },
                    { icon:<Users className="w-5 h-5 text-emerald-500"/>, label:"Candidates", val:"2,800+" },
                    { icon:<Globe className="w-5 h-5 text-purple-500"/>, label:"AI Matching", val:"Enabled" },
                  ].map((f,i)=>(
                    <div key={i} className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                      {f.icon}
                      <div className="text-base font-black text-zinc-900 mt-2">{f.val}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{f.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={handleFinish} disabled={loading} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2">
                  {loading?<RefreshCw className="w-4 h-4 animate-spin"/>:null}
                  <span>Enter Dashboard</span> <ArrowRight className="w-4 h-4"/>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
