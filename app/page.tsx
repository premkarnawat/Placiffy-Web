"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, ArrowRight, Upload, Play, CheckCircle, 
  Layers, Cpu, Award, Zap, HelpCircle, Phone, X, 
  ExternalLink, ChevronDown, Check, Globe, RefreshCw, BarChart2,
  User, Briefcase
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { WavingLines } from '@/components/ui/waving-lines';

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
    { title: "JD Criteria Synthesis", desc: "AI JD Analyzer parses required skills, must-haves, and weights metrics for target folders." },
    { title: "Semantic Talent Matching", desc: "pgvector searches our verified talent pool using cosine similarity to map candidates." },
    { title: "Pipeline Folder Kanban", desc: "Recruiters manage candidate states via Ashby-styled drag-and-drop workspace columns." },
    { title: "High-Trust Hires", desc: "Saves up to 85% of interview cycles with 100% authenticated candidate Passports." }
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7] bg-grid-pattern-light relative overflow-hidden flex flex-col justify-between select-none">
      
      {/* Dynamic Wave Background Animation */}
      <WavingLines />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] bg-[#a88a5d]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-[#18181b]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <header className="border-b border-zinc-200/50 bg-[#FCFAF7]/65 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Placify Logo" 
              className="h-11 w-auto mix-blend-multiply" 
            />
          </div>

          {/* Nav Links dropdown-styled */}
          <nav className="hidden md:flex items-center gap-9 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <a href="#services" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              Services <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a href="#workflow" className="hover:text-zinc-900 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setAuthTab('company'); setShowAuthModal(true); }}
              className="text-xs font-bold uppercase tracking-wider text-zinc-650 hover:text-zinc-900 transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book a Demo
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center flex-1 w-full relative z-10">
        
        <div className="space-y-8 max-w-4xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#a88a5d]/10 border border-[#a88a5d]/20 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a88a5d]" />
            <span className="text-[10px] text-[#8c7149] font-bold uppercase tracking-widest">Hiring Operating System</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-8xl font-serif text-zinc-900 leading-[1.05] tracking-tight"
          >
            Verified Talent. <br />
            <span className="font-serif italic text-gradient-bronze">Faster Hiring.</span> <br />
            <span className="text-gradient-charcoal">Reduced Risk.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-zinc-600 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Placify completely replaces raw, unverified resume databases with an elegant verification network. We analyze portfolios, evaluate work challenges, and deliver certified candidates.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }}
              className="flex items-center justify-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs px-9 py-4.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Candidate Passport <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="flex items-center justify-center gap-2 bg-white/60 border border-zinc-200/80 hover:bg-white text-zinc-800 font-bold uppercase tracking-wider text-xs px-9 py-4.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            >
              Request Access
            </button>
          </motion.div>

          {/* Real time Telemetry stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-10 border-t border-zinc-200/60 max-w-xl mx-auto"
          >
            <div>
              <div className="text-3xl font-bold font-serif text-zinc-900">{livePassports.toLocaleString()}</div>
              <div className="text-[9px] text-zinc-550 font-bold uppercase mt-1 tracking-widest">Passports Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-serif text-zinc-900">{liveMatches.toLocaleString()}</div>
              <div className="text-[9px] text-zinc-550 font-bold uppercase mt-1 tracking-widest">AI Skill Matches</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-serif text-[#a88a5d]">85%</div>
              <div className="text-[9px] text-zinc-550 font-bold uppercase mt-1 tracking-widest">HR Time Saved</div>
            </div>
          </motion.div>

        </div>

      </section>

      {/* Services Grid (What we do) */}
      <section id="services" className="border-t border-zinc-200/50 bg-[#FCFAF7]/20 py-28 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a88a5d] block mb-2">SERVICES & SCOPE</span>
            <h2 className="text-4xl font-serif text-zinc-900">Our Triple-Engine Business Model</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Placify merges high-trust candidate verification pipelines with enterprise bulk automation to deliver maximum recruitment efficacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard className="glass-panel-card hover:border-[#a88a5d]/30 hover:-translate-y-1 transition-all duration-350 p-8 glow-border-light">
              <div className="p-3 bg-[#a88a5d]/10 text-[#a88a5d] border border-[#a88a5d]/20 rounded-xl w-fit">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-zinc-900 mt-6 tracking-wide">1. Verified Talent Network</h3>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed font-sans">
                Candidates build a verified passport with GitHub checks and work sample grades. Companies apply to hire them directly.
              </p>
              <div className="text-xs text-[#a88a5d] font-bold mt-6 tracking-wide uppercase">Revenue: 5%–10% of candidate CTC</div>
            </GlassCard>

            <GlassCard className="glass-panel-card hover:border-[#a88a5d]/30 hover:-translate-y-1 transition-all duration-350 p-8 glow-border-light">
              <div className="p-3 bg-zinc-900/10 text-zinc-800 border border-zinc-200 rounded-xl w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-zinc-900 mt-6 tracking-wide">2. Bulk Resume Screening SaaS</h3>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed font-sans">
                Recruiters upload database CSVs or zip folders. Our AI parses, ranks, and screens candidates with automated scorecards.
              </p>
              <div className="text-xs text-zinc-800 font-bold mt-6 tracking-wide uppercase">Revenue: Flat monthly subscription</div>
            </GlassCard>

            <GlassCard className="glass-panel-card hover:border-[#a88a5d]/30 hover:-translate-y-1 transition-all duration-350 p-8 glow-border-light animate-wave-float">
              <div className="p-3 bg-[#a88a5d]/15 text-[#a88a5d] border border-[#a88a5d]/35 rounded-xl w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-zinc-900 mt-6 tracking-wide">3. Placify Assisted Hiring</h3>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed font-sans">
                Unlock full-stack white-glove screening. We deploy AI grading, manage expert reviews, and compile final shortlists.
              </p>
              <div className="text-xs text-[#a88a5d] font-bold mt-6 tracking-wide uppercase">Revenue: Monthly plan + Success Fee</div>
            </GlassCard>

          </div>

        </div>
      </section>

      {/* Stepper workflow (How we do it) */}
      <section id="workflow" className="border-t border-zinc-200/50 py-28 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a88a5d] block mb-2">CORE WORKFLOW</span>
            <h2 className="text-4xl font-serif text-zinc-900">How Placify Accelerates Hiring</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Step-by-step verification flows mapped for candidates and company hiring departments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            
            {/* Candidate Workflow */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest px-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#a88a5d]" /> Candidate Journey
              </h3>
              <div className="space-y-4">
                {candidateSteps.map((step, i) => (
                  <div key={i} className="flex gap-5 p-6 bg-white/60 border border-zinc-200/60 rounded-xl hover:border-zinc-300 hover:bg-white transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#a88a5d]/10 text-[#a88a5d] border border-[#a88a5d]/20 flex items-center justify-center text-xs font-bold shrink-0">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-800">{step.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Workflow */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest px-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-900" /> Company Journey
              </h3>
              <div className="space-y-4">
                {companySteps.map((step, i) => (
                  <div key={i} className="flex gap-5 p-6 bg-white/60 border border-zinc-200/60 rounded-xl hover:border-zinc-300 hover:bg-white transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-zinc-900/10 text-zinc-850 border border-zinc-200 flex items-center justify-center text-xs font-bold shrink-0">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-800">{step.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Screen resume previewer block */}
      <section className="border-t border-zinc-200/50 py-28 relative z-10 text-left bg-white/20">
        <div className="max-w-4xl mx-auto px-6">
          <GlassCard className="glass-panel-card p-8 shadow-xl relative overflow-hidden group border-zinc-200/60" glow>
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#a88a5d]/5 rounded-full blur-[80px]" />
            
            <h3 className="text-xl font-serif text-zinc-900 mb-2">Try Real-Time Screen Parsing</h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Upload a test resume (TXT/PDF) to see how our parser compiles candidates and maps match scores automatically.
            </p>

            <div className="border-2 border-dashed border-zinc-200 hover:border-[#a88a5d] bg-white/50 hover:bg-white/80 transition-all duration-300 rounded-xl p-10 text-center cursor-pointer relative overflow-hidden group">
              <input 
                type="file" 
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#a88a5d]/10 border border-[#a88a5d]/20 text-[#a88a5d] flex items-center justify-center mx-auto transition-transform group-hover:scale-105 duration-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-800 block">
                    {resumeName || "Upload resume file"}
                  </span>
                  <span className="text-xs text-zinc-400 mt-1 block">
                    PDF, DOCX, or TXT up to 10MB
                  </span>
                </div>
              </div>
            </div>

            {parsing && (
              <div className="mt-6 border border-zinc-200 bg-white p-5 rounded-xl space-y-3 shadow-sm">
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#a88a5d] rounded-full animate-ping" /> Parsing & Extracting Skills...
                  </span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#a88a5d] h-full w-[45%] animate-[pulse_2s_infinite]" />
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 border border-[#a88a5d]/20 bg-[#a88a5d]/5 p-5 rounded-xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8c7149]">Candidate Parsed</h4>
                    <p className="text-base font-bold text-zinc-800 mt-0.5">{result.name}</p>
                    <p className="text-xs text-zinc-500">{result.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Trust Score</span>
                    <span className="text-xl font-bold text-[#a88a5d] mt-0.5 inline-flex items-center gap-1">
                      <Shield className="w-4.5 h-4.5" /> {result.trust_score}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-200/50">
                  {result.skills.map((skill: string) => (
                    <span key={skill} className="text-[10px] bg-white border border-zinc-200 text-zinc-700 px-3 py-1 rounded-md font-medium tracking-wide">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-zinc-500 bg-white/80 p-3 rounded-lg border border-zinc-100">
                  <span>Fraud Risk: <strong className="text-[#a88a5d] font-bold">{result.fraud_risk}</strong></span>
                  <span>ATS Match: <strong className="text-zinc-800 font-bold">{result.ats_match}%</strong></span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="border-t border-zinc-200/50 py-28 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a88a5d] block mb-2">PRICING MODELS</span>
            <h2 className="text-4xl font-serif text-zinc-900">Scale Your Verified Hiring</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Flexible success-fee structures and software subscriptions tailored for small teams to scale enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard className="glass-panel-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[400px] p-8 border-zinc-200/60">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Verified Marketplace</h4>
                <div className="text-4xl font-bold font-serif text-zinc-900 mt-4">5% - 10%<span className="text-xs font-normal text-zinc-400"> / hire CTC</span></div>
                <p className="text-xs text-zinc-550 mt-5 leading-relaxed font-sans">
                  Apply and hire directly from our verified passport network. Pay only when candidates join.
                </p>
              </div>
              <button 
                onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }}
                className="w-full bg-white border border-zinc-200/80 hover:border-zinc-400 text-zinc-800 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300"
              >
                Register as Candidate
              </button>
            </GlassCard>

            <GlassCard className="glass-panel-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[400px] p-8 border-[#a88a5d]/30 shadow-xl bg-white" glow>
              <div>
                <span className="text-[8px] bg-[#a88a5d]/10 border border-[#a88a5d]/20 text-[#a88a5d] font-bold px-2.5 py-1 rounded uppercase tracking-wider">Most Popular</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-4">Bulk Screening SaaS</h4>
                <div className="text-4xl font-bold font-serif text-zinc-900 mt-4">$499<span className="text-xs font-normal text-zinc-400"> / month</span></div>
                <p className="text-xs text-zinc-550 mt-5 leading-relaxed font-sans">
                  Bulk upload resume zip files, parse skills automatically, map scores, and run fraud risk checks.
                </p>
              </div>
              <button 
                onClick={() => { setAuthTab('company'); setShowAuthModal(true); }}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 shadow-md"
              >
                Sign Up as Company
              </button>
            </GlassCard>

            <GlassCard className="glass-panel-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[400px] p-8 border-zinc-200/60">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Assisted Hiring</h4>
                <div className="text-4xl font-bold font-serif text-zinc-900 mt-4">$999<span className="text-xs font-normal text-zinc-400"> / mo + success fee</span></div>
                <p className="text-xs text-zinc-550 mt-5 leading-relaxed font-sans">
                  White-glove assisted hiring. Includes expert marketplace review scorecards and fully managed coding sample challenges.
                </p>
              </div>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="w-full bg-white border border-zinc-200/80 hover:border-zinc-400 text-zinc-800 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300"
              >
                Book a Demonstration
              </button>
            </GlassCard>

          </div>

        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="border-t border-zinc-200/50 py-28 relative z-10 text-left bg-white/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a88a5d] block">SUPPORT COORDINATES</span>
            <h2 className="text-4xl font-serif text-zinc-900">Connect with Placify Architect Teams</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Have questions about pgvector matches, expert panel scorecards, or bulk subscriptions? Get in touch with our engineers.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-zinc-200/60 text-[#a88a5d] rounded-lg shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">Business Operations</div>
                  <div className="text-xs text-zinc-400 mt-0.5">connect@placify.ai</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-zinc-200/60 text-[#a88a5d] rounded-lg shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">Enterprise Support</div>
                  <div className="text-xs text-zinc-400 mt-0.5">support@placify.ai</div>
                </div>
              </div>
            </div>
          </div>

          <GlassCard className="glass-panel-card p-8 border-zinc-200/60 bg-white/80 shadow-md">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-5">Send a Message</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="bg-white border border-zinc-200 focus:border-zinc-450 focus:shadow-sm rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="bg-white border border-zinc-200 focus:border-zinc-450 focus:shadow-sm rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                />
              </div>
              <textarea
                placeholder="How can we accelerate your hiring?"
                rows={4}
                required
                className="w-full bg-white border border-zinc-200 focus:border-zinc-450 focus:shadow-sm rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none resize-none transition-all"
              />
              <button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs px-7 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                Send Query
              </button>
            </form>
          </GlassCard>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 bg-[#FCFAF7] py-16 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Placify Logo" 
                className="h-12 w-auto mix-blend-multiply" 
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Verified Talent. Faster Hiring. Reduced Risk. The verification network replacing unverified resume database listings.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-zinc-500 font-medium">
              <li><a href="#services" className="hover:text-zinc-950 transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-zinc-950 transition-colors">Pricing Matrix</a></li>
              <li><span className="text-zinc-300 cursor-not-allowed">API Documentation</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-zinc-500 font-medium">
              <li><span className="text-zinc-350 cursor-not-allowed">About Us</span></li>
              <li><span className="text-zinc-350 cursor-not-allowed">Hiring Partners</span></li>
              <li><a href="#contact" className="hover:text-zinc-950 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Security</h4>
            <ul className="space-y-2 text-xs text-zinc-500 font-medium">
              <li><span className="text-zinc-800 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#a88a5d]" /> GDPR Compliant</span></li>
              <li><span className="text-zinc-800 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#a88a5d]" /> pgvector Match Encrypted</span></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 mt-10 border-t border-zinc-200/40 flex justify-between items-center text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl relative text-left shadow-2xl"
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-serif text-zinc-900 mb-2">Request Platform Demo</h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Schedule a 15-minute screen share with our architects to see how bulk uploads and trust scores operate.
              </p>

              {demoSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#a88a5d] mx-auto" />
                  <h4 className="text-base font-bold text-zinc-800">Demo Scheduled!</h4>
                  <p className="text-xs text-zinc-500 font-medium">We have sent a calendar invite to {demoForm.email}.</p>
                </div>
              ) : (
                <form onSubmit={submitDemo} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-455 tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-455 tracking-wider">Company</label>
                      <input
                        type="text"
                        value={demoForm.company}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-455 tracking-wider">Company Size</label>
                      <select
                        value={demoForm.size}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs text-zinc-500 outline-none"
                      >
                        <option value="1-10">1 - 10 employees</option>
                        <option value="10-50">10 - 50 employees</option>
                        <option value="50-250">50 - 250 employees</option>
                        <option value="250+">250+ employees</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-colors shadow-md mt-4">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl relative text-left shadow-2xl"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center justify-center mb-6">
                <img 
                  src="/logo.jpg" 
                  alt="Placify Logo" 
                  className="h-16 w-auto mix-blend-multiply mb-3" 
                />
                <p className="text-xs text-zinc-450 font-sans text-center">Select your portal access and enter your credentials.</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl p-1 gap-1 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthTab('company')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'company' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('candidate')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'candidate' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'admin' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Admin
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider">Email address</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-zinc-455 tracking-wider">Password</label>
                    <span className="text-[10px] text-[#a88a5d] hover:underline cursor-pointer font-semibold">Forgot Password?</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-1.5"
                >
                  {authLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {authLoading ? 'Verifying Credentials...' : `Enter ${authTab === 'company' ? 'Company' : authTab === 'candidate' ? 'Candidate' : 'Admin'} Portal`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
