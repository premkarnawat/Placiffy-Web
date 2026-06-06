"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, ArrowRight, Upload, Play, CheckCircle, 
  Layers, Cpu, Award, Zap, HelpCircle, Phone, X, 
  ExternalLink, ChevronDown, Check, Globe, RefreshCw, BarChart2,
  User, Briefcase
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import PassportShowcase from '@/components/passport/passport-showcase';

export default function Home() {
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'candidate' | 'company' | 'admin'>('company');
  const [showDemoModal, setShowDemoModal] = useState(false);
  
  // Input validations & simulator states
  const [demoForm, setDemoForm] = useState({ name: '', email: '', company: '', size: '10-50' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Resume screening demo state
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Stats ticker mock numbers
  const [livePassports, setLivePassports] = useState(1482);
  const [liveMatches, setLiveMatches] = useState(8792);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePassports(prev => prev + Math.floor(Math.random() * 2));
      setLiveMatches(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      setParsing(true);
      
      setTimeout(() => {
        setParsing(false);
        setResult({
          name: "Alexander Vance",
          role: "Senior Full Stack Engineer",
          ats_match: 94,
          trust_score: 93,
          skills: ["React", "FastAPI", "TypeScript", "SQLAlchemy"],
          fraud_risk: "LOW"
        });
      }, 2000);
    }
  };

  const submitDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email) return;
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      setDemoForm({ name: '', email: '', company: '', size: '10-50' });
    }, 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setShowAuthModal(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }, 1500);
  };

  // Stepper workflows
  const candidateSteps = [
    { title: "AI Profile Parsing", desc: "Upload resume; our system parses skills, work histories, and outputs structured profile metadata." },
    { title: "Interest Confirmation Check", desc: "Validates notice periods, expected salaries, and availability to secure low dropout rates." },
    { title: "Verification Sandbox", desc: "Automated work samples and GitHub analysis cross-checks code quality and structures." },
    { title: "Passport Activation", desc: "Grants a shareable secure URL, PDF, and QR containing verification badges and trust scores." }
  ];

  const companySteps = [
    { title: "JD Criteria Synthesis", desc: "AI JD Analyzer parses required skills,must-haves, and weights metrics for target folders." },
    { title: "Semantic Talent Matching", desc: "pgvector searches our verified talent pool using cosine similarity to map candidates." },
    { title: "Pipeline Folder Kanban", desc: "Recruiters manage candidate states via Ashby-styled drag-and-drop workspace columns." },
    { title: "High-Trust Hires", desc: "Saves up to 85% of interview cycles with 100% authenticated candidate Passports." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern relative overflow-hidden flex flex-col justify-between">
      
      {/* Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-650/15 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />

      {/* Nav */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white uppercase">PLACIFY</span>
          </div>

          {/* Nav Links dropdown-styled */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#services" className="hover:text-slate-100 transition-colors flex items-center gap-1">
              Services <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a href="#workflow" className="hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-slate-100 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setAuthTab('company'); setShowAuthModal(true); }}
              className="text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-200 px-5.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Book a Demo
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center flex-1 w-full relative z-10">
        
        {/* Hero Left */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] text-orange-450 font-bold uppercase tracking-wider">Hiring Operating System</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.08] tracking-tighter">
            Verified Talent. <br />
            <span className="text-gradient-orange">Faster Hiring.</span> <br />
            <span className="text-gradient-indigo">Reduced Risk.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
            Placify completely replaces raw, unverified resume databases with a high-trust verification network. We analyze portfolios, evaluate work challenges, and deliver certified candidates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl text-sm shadow-xl shadow-orange-500/20 transition-all"
            >
              Create Candidate Passport <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-bold px-8 py-4 rounded-xl text-sm transition-all"
            >
              Request Access
            </button>
          </div>

          {/* Real time Telemetry stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-md">
            <div>
              <div className="text-2xl font-black text-white">{livePassports.toLocaleString()}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Passports Active</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{liveMatches.toLocaleString()}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">AI Skill Matches</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">85%</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">HR Time Saved</div>
            </div>
          </div>

        </div>

        {/* Hero Right: 3D interactive showcase widget */}
        <div className="lg:col-span-5 w-full">
          <div className="relative w-full py-8">
            <div className="absolute inset-0 bg-orange-600/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
            <PassportShowcase />
          </div>
        </div>

      </section>

      {/* Services Grid (What we do) */}
      <section id="services" className="border-t border-slate-900 bg-slate-950/20 py-20 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block mb-2">SERVICES & SCOPE</span>
            <h2 className="text-3xl font-extrabold text-slate-200">Our Triple-Engine Business Model</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Placify merges high-trust candidate verification pipelines with enterprise bulk automation to deliver maximum recruitment efficacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard className="hover:border-slate-850 transition-all">
              <div className="p-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-300 mt-5 uppercase tracking-wide">1. Verified Talent Network</h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Candidates build a verified passport with GitHub checks and work sample grades. Companies apply to hire them directly.
              </p>
              <div className="text-xs text-orange-400 font-bold mt-4">Revenue: 5%–10% of candidate CTC</div>
            </GlassCard>

            <GlassCard className="hover:border-slate-850 transition-all">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-300 mt-5 uppercase tracking-wide">2. Bulk Resume Screening SaaS</h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Recruiters upload database CSVs or zip folders. Our AI parses, ranks, and screens candidates with automated scorecards.
              </p>
              <div className="text-xs text-indigo-400 font-bold mt-4">Revenue: Flat monthly subscription</div>
            </GlassCard>

            <GlassCard className="hover:border-slate-850 transition-all animate-float">
              <div className="p-2.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-300 mt-5 uppercase tracking-wide">3. Placify Assisted Hiring</h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Unlock full-stack white-glove screening. We deploy AI grading, manage expert reviews, and compile final shortlists.
              </p>
              <div className="text-xs text-violet-400 font-bold mt-4">Revenue: Monthly plan + Success Fee</div>
            </GlassCard>

          </div>

        </div>
      </section>

      {/* Stepper workflow (How we do it) */}
      <section id="workflow" className="border-t border-slate-900 py-20 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block mb-2">CORE WORKFLOW</span>
            <h2 className="text-3xl font-extrabold text-slate-200">How Placify Accelerates Hiring</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Step-by-step verification flows mapped for candidates and company hiring departments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            
            {/* Candidate Workflow */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" /> Candidate Journey
              </h3>
              <div className="space-y-4">
                {candidateSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-950 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs font-black shrink-0">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-350">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Workflow */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Company Journey
              </h3>
              <div className="space-y-4">
                {companySteps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-950 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-black shrink-0">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-350">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Screen resume previewer block */}
      <section className="border-t border-slate-900 py-20 relative z-10 text-left bg-slate-950/20">
        <div className="max-w-4xl mx-auto px-6">
          <GlassCard className="p-8 shadow-2xl relative overflow-hidden group" glow>
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-600/5 rounded-full blur-[80px]" />
            
            <h3 className="text-lg font-bold text-slate-200 mb-2">Try Real-Time Screen Parsing</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Upload a test resume (TXT/PDF) to see how our parser compiles candidates and maps match scores automatically.
            </p>

            <div className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-950/60 transition-all rounded-xl p-8 text-center cursor-pointer relative overflow-hidden group">
              <input 
                type="file" 
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-450 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-300 block">
                    {resumeName || "Upload resume file"}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    PDF, DOCX, or TXT up to 10MB
                  </span>
                </div>
              </div>
            </div>

            {parsing && (
              <div className="mt-6 border border-slate-800 bg-slate-950 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" /> Parsing & Extracting Skills...
                  </span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[45%] animate-[pulse_2s_infinite]" />
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Parsed</h4>
                    <p className="text-sm font-bold text-white mt-0.5">{result.name}</p>
                    <p className="text-xs text-slate-500">{result.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Trust Score</span>
                    <span className="text-lg font-black text-emerald-400 mt-0.5 inline-flex items-center gap-1">
                      <Shield className="w-4 h-4" /> {result.trust_score}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                  {result.skills.map((skill: string) => (
                    <span key={skill} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-950 p-2 rounded">
                  <span>Fraud Risk: <strong className="text-emerald-400 font-bold">{result.fraud_risk}</strong></span>
                  <span>ATS Match: <strong className="text-white font-bold">{result.ats_match}%</strong></span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="border-t border-slate-900 py-20 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block mb-2">PRICING MODELS</span>
            <h2 className="text-3xl font-extrabold text-slate-200">Scale Your Verified Hiring</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Flexible success-fee structures and software subscriptions tailored for small teams to scale enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard className="flex flex-col justify-between h-[380px]">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Verified Marketplace</h4>
                <div className="text-3xl font-extrabold text-white mt-4">5% - 10%<span className="text-xs font-normal text-slate-500"> / hire CTC</span></div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Apply and hire directly from our verified passport network. Pay only when candidates join.
                </p>
              </div>
              <button 
                onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }}
                className="w-full bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-250 py-3 rounded-xl text-xs font-bold transition-all"
              >
                Register as Candidate
              </button>
            </GlassCard>

            <GlassCard className="flex flex-col justify-between h-[380px] border-orange-500/20" glow>
              <div>
                <span className="text-[8px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded uppercase">Most Popular</span>
                <h4 className="text-xs font-bold uppercase text-slate-400 mt-3">Bulk Screening SaaS</h4>
                <div className="text-3xl font-extrabold text-white mt-4">$499<span className="text-xs font-normal text-slate-500"> / month</span></div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Bulk upload resume zip files, parse skills automatically, map scores, and run fraud risk checks.
                </p>
              </div>
              <button 
                onClick={() => { setAuthTab('company'); setShowAuthModal(true); }}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-110 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/10"
              >
                Sign Up as Company
              </button>
            </GlassCard>

            <GlassCard className="flex flex-col justify-between h-[380px]">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Assisted Hiring</h4>
                <div className="text-3xl font-extrabold text-white mt-4">$999<span className="text-xs font-normal text-slate-500"> / month + success fee</span></div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  White-glove assisted hiring. Includes expert marketplace review scorecards and fully managed coding sample challenges.
                </p>
              </div>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="w-full bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-250 py-3 rounded-xl text-xs font-bold transition-all"
              >
                Book a Demonstration
              </button>
            </GlassCard>

          </div>

        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="border-t border-slate-900 py-20 relative z-10 text-left bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block">SUPPORT COORDINATES</span>
            <h2 className="text-3xl font-extrabold text-slate-200">Connect with Placify Architect Teams</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Have questions about pgvector matches, expert panel scorecards, or bulk subscriptions? Get in touch with our engineers.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 text-orange-400 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-350">Business Operations</div>
                  <div className="text-xs text-slate-500 mt-0.5">connect@placify.ai</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 text-orange-400 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-350">Enterprise Support</div>
                  <div className="text-xs text-slate-500 mt-0.5">support@placify.ai</div>
                </div>
              </div>
            </div>
          </div>

          <GlassCard>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Send a Message</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none"
                />
              </div>
              <textarea
                placeholder="How can we accelerate your hiring?"
                rows={4}
                required
                className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none resize-none"
              />
              <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors">
                Send Query
              </button>
            </form>
          </GlassCard>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-12 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white uppercase">PLACIFY</span>
            </div>
            <p className="text-xs text-slate-550 leading-relaxed">
              Verified Talent. Faster Hiring. Reduced Risk. The verification network replacing unverified resume database listings.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-slate-550 font-medium">
              <li><a href="#services" className="hover:text-slate-300 transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing Matrix</a></li>
              <li><span className="text-slate-700 cursor-not-allowed">API Documentation</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-slate-550 font-medium">
              <li><span className="text-slate-700 cursor-not-allowed">About Us</span></li>
              <li><span className="text-slate-700 cursor-not-allowed">Hiring Partners</span></li>
              <li><a href="#contact" className="hover:text-slate-300 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security</h4>
            <ul className="space-y-2 text-xs text-slate-550 font-medium">
              <li><span className="text-emerald-500/90 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> GDPR Compliant</span></li>
              <li><span className="text-emerald-500/90 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> pgvector Match Encrypted</span></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 font-semibold">
          <span>&copy; 2026 Placify Technologies Inc. All rights reserved.</span>
          <span className="flex gap-4">
            <span className="cursor-not-allowed">Privacy</span>
            <span className="cursor-not-allowed">Terms of Service</span>
          </span>
        </div>
      </footer>

      {/* BOOK A DEMO MODAL */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl relative text-left"
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-bold text-slate-200 mb-2">Request Platform Demo</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Schedule a 15-minute screen share with our architects to see how bulk uploads and trust scores operate.
              </p>

              {demoSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Demo Scheduled!</h4>
                  <p className="text-xs text-slate-500">We have sent a calendar invite to {demoForm.email}.</p>
                </div>
              ) : (
                <form onSubmit={submitDemo} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Company</label>
                      <input
                        type="text"
                        value={demoForm.company}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Company Size</label>
                      <select
                        value={demoForm.size}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full bg-slate-955 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-400 outline-none"
                      >
                        <option value="1-10">1 - 10 employees</option>
                        <option value="10-50">10 - 50 employees</option>
                        <option value="50-250">50 - 250 employees</option>
                        <option value="250+">250+ employees</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg mt-4">
                    Submit Request
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UNIFIED AUTH MODAL WITH TABS */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl relative text-left"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-200 mb-2">Sign in to Placify</h3>
              <p className="text-xs text-slate-500 mb-6">Select your portal access and enter your credentials.</p>

              {/* Tabs */}
              <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-1 gap-1 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthTab('company')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'company' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Company Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('candidate')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'candidate' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Candidate Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'admin' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Admin Login
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Email address</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-350 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Password</label>
                    <span className="text-[10px] text-orange-400 hover:underline cursor-pointer">Forgot Password?</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-350 outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg mt-4 flex items-center justify-center gap-1.5"
                >
                  {authLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {authLoading ? 'Verifying Credentials...' : `Enter ${authTab === 'company' ? 'Company' : authTab === 'candidate' ? 'Candidate' : 'Admin'} Dashboard`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
