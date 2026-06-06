"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, ArrowRight, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

type Role = "candidate" | "company" | "admin";
type AuthMethod = "email" | "otp";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("candidate");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [otpSent, setOtpSent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"role"|"auth">("role");

  const ROLES = [
    { id:"candidate" as Role, label:"Candidate", emoji:"👤", desc:"Job seekers & professionals", color:"from-emerald-500/10 to-teal-500/10", border:"border-emerald-200" },
    { id:"company" as Role, label:"Company", emoji:"🏢", desc:"HR teams & recruiters", color:"from-blue-500/10 to-indigo-500/10", border:"border-blue-200" },
    { id:"admin" as Role, label:"Admin", emoji:"🛡️", desc:"Platform administrators", color:"from-purple-500/10 to-violet-500/10", border:"border-purple-200" },
  ];

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setOtpSent(true);
    setLoading(false);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (val.length > 1) return;
    const arr = [...otp]; arr[idx] = val;
    setOtp(arr);
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx+1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    const dest = role === "company" ? "/company/dashboard" : role === "admin" ? "/admin" : "/dashboard";
    window.location.href = dest;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] bg-grid flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Bg orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/6 blur-[120px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/6 blur-[120px] pointer-events-none"/>

      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Placify" className="h-10 w-auto rounded-xl object-contain mix-blend-multiply"/>
        </div>

        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div key="role" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
              className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">
              <h1 className="text-2xl font-black text-zinc-900 mb-1 text-center">Welcome to Placify</h1>
              <p className="text-sm text-zinc-500 text-center mb-8">Select your portal to continue</p>

              <div className="space-y-3 mb-8">
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      role === r.id ? `bg-gradient-to-r ${r.color} ${r.border} shadow-sm` : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                    }`}>
                    <div className="text-2xl">{r.emoji}</div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-zinc-900 text-sm">{r.label}</div>
                      <div className="text-xs text-zinc-500">{r.desc}</div>
                    </div>
                    {role === r.id && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"/>
                    </div>}
                  </button>
                ))}
              </div>

              <button onClick={() => setStep("auth")} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4"/>
              </button>
              <p className="text-center text-xs text-zinc-500 mt-5">
                New to Placify?{" "}
                <Link href="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div key="auth" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
              className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">
              <button onClick={() => setStep("role")} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 mb-6 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5"/> Change Portal
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{ROLES.find(r=>r.id===role)?.emoji}</span>
                  <h2 className="text-xl font-black text-zinc-900">{ROLES.find(r=>r.id===role)?.label} Login</h2>
                </div>
                <p className="text-xs text-zinc-500">Sign in to your workspace</p>
              </div>

              {/* Social auth */}
              <div className="space-y-2.5 mb-5">
                {[
                  { name:"Google", bg:"#fff", border:"#E8EAED", logo:<svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg> },
                  { name:"LinkedIn", bg:"#0A66C2", border:"#0A66C2", logo:<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { name:"GitHub", bg:"#24292F", border:"#24292F", logo:<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg> },
                ].map(s => (
                  <button key={s.name} onClick={handleSubmit}
                    style={{ background: s.bg === "#fff" ? "#fff" : s.bg, borderColor: s.border, color: s.bg === "#fff" ? "#374151" : "#fff" }}
                    className="w-full flex items-center justify-center gap-2.5 border py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-sm">
                    {s.logo} Continue with {s.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-zinc-100"/>
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-zinc-100"/>
              </div>

              {/* Method tabs */}
              <div className="flex bg-zinc-50 rounded-xl p-1 gap-1 mb-5 border border-zinc-100">
                {(["email","otp"] as AuthMethod[]).map(m => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize ${method===m ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`}>
                    {m === "email" ? "📧 Password" : "🔢 OTP"}
                  </button>
                ))}
              </div>

              {method === "email" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Email</label>
                    <input className="input-brand" type="email" required placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Password</label>
                      <button type="button" className="text-[11px] text-blue-600 font-bold hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                      <input className="input-brand pr-11" type={showPw?"text":"password"} required placeholder="••••••••••" value={password} onChange={e=>setPassword(e.target.value)}/>
                      <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                        {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : null}
                    <span>{loading ? "Signing in..." : "Sign In"}</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Email / Phone</label>
                    <div className="flex gap-2">
                      <input className="input-brand flex-1" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                      <button onClick={handleSendOtp} disabled={loading||otpSent}
                        className="btn-outline-brand px-4 rounded-xl text-xs whitespace-nowrap">
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : otpSent ? "Sent ✓" : "Send OTP"}
                      </button>
                    </div>
                  </div>
                  {otpSent && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">Enter 6-Digit OTP</label>
                      <div className="flex gap-2 justify-between">
                        {otp.map((v,i) => (
                          <input key={i} id={`otp-${i}`} maxLength={1} value={v} onChange={e=>handleOtpChange(e.target.value,i)}
                            className="w-11 h-12 text-center text-lg font-black input-brand rounded-xl"/>
                        ))}
                      </div>
                      <button onClick={handleSubmit} className="btn-brand w-full py-4 rounded-2xl mt-4 flex items-center justify-center gap-2">
                        <span>Verify & Sign In</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              <p className="text-center text-xs text-zinc-500 mt-5">
                New to Placify?{" "}
                <Link href="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
