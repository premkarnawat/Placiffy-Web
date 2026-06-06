"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Shield, Sparkles, ArrowRight, CheckCircle, Layers, Cpu, Award, Zap,
  X, ChevronDown, Check, Globe, RefreshCw, BarChart2, User, Briefcase,
  Mail, Phone, MapPin, Star, Play, Building2, Users, TrendingUp, Lock,
  FileCheck, Search, MessageSquare, Send, Menu, Rocket, Target, Heart
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { AnimatedBackground } from '@/components/ui/animated-bg';

/* ─ Fade-in utility ─ */
function FadeIn({ children, delay = 0, direction = "up", className = "" }: {
  children: React.ReactNode; delay?: number; direction?: "up"|"down"|"left"|"right"|"none"; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up:[0,40], down:[0,-40], left:[40,0], right:[-40,0], none:[0,0] };
  const [x, y] = dirs[direction];
  return (
    <motion.div ref={ref} initial={{ opacity:0, x, y }} animate={inView ? { opacity:1, x:0, y:0 } : {}}
      transition={{ duration:0.75, delay, ease:[0.23,1,0.32,1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─ Animated Counter ─ */
function Counter({ value, suffix="" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─ Stats data ─ */
const STATS = [
  { value: 2800, suffix: "+", label: "Verified Candidates" },
  { value: 94, suffix: "%", label: "Placement Rate" },
  { value: 150, suffix: "+", label: "Partner Companies" },
  { value: 72, suffix: "hrs", label: "Avg. Time-to-Hire" },
];

/* ─ Services ─ */
const SERVICES = [
  {
    icon: <Cpu className="w-6 h-6"/>,
    title: "AI Resume Screening",
    desc: "Intelligent parsing of resumes with semantic matching against JD requirements. Our AI cross-checks skills, experience, and cultural fit automatically.",
    color: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: <Shield className="w-6 h-6"/>,
    title: "Candidate Verification",
    desc: "End-to-end background verification covering employment history, education credentials, certifications, and skill assessments with fraud detection.",
    color: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: <Layers className="w-6 h-6"/>,
    title: "Smart Talent Pipeline",
    desc: "Ashby-style Kanban board for managing candidate stages. Drag, drop, and move talent through hiring stages with full audit trails.",
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <BarChart2 className="w-6 h-6"/>,
    title: "Hiring Analytics",
    desc: "Real-time dashboards tracking pipeline velocity, offer acceptance, diversity metrics, and recruiter performance with actionable insights.",
    color: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: <FileCheck className="w-6 h-6"/>,
    title: "Candidate Passport",
    desc: "A verified, shareable digital profile with QR code — trusted credentials candidates carry from role to role, reducing re-screening costs.",
    color: "from-rose-500/10 to-pink-500/10",
  },
  {
    icon: <Globe className="w-6 h-6"/>,
    title: "Enterprise Integrations",
    desc: "Native connectors to ATS platforms, HRMS systems, LinkedIn, and job boards. Sync your existing tools without workflow disruption.",
    color: "from-indigo-500/10 to-blue-500/10",
  },
];

/* ─ Workflow steps ─ */
const CANDIDATE_STEPS = [
  { num: "01", title: "Upload Resume", desc: "Submit your resume or LinkedIn profile. Our AI parser extracts all structured data in seconds." },
  { num: "02", title: "AI Verification", desc: "We verify employment history, education, skills, and run integrity checks automatically." },
  { num: "03", title: "Receive Passport", desc: "Get your verified digital Passport — a shareable URL, QR code, and PDF with trust scores." },
  { num: "04", title: "Get Matched", desc: "Our semantic engine matches you to live opportunities that align with your verified profile." },
];
const COMPANY_STEPS = [
  { num: "01", title: "Post Job Description", desc: "Paste your JD. Our AI synthesizes required skills, weights, and candidate persona automatically." },
  { num: "02", title: "Semantic Matching", desc: "We scan our verified talent pool and surface pre-screened candidates ranked by fit score." },
  { num: "03", title: "Review Pipeline", desc: "Manage candidates in a Kanban board with notes, interview scores, and collaboration tools." },
  { num: "04", title: "Hire with Confidence", desc: "Every shortlisted candidate is 100% verified. Reduce bad hires and reduce re-screening by 85%." },
];

/* ─ Pricing ─ */
const PLANS = [
  {
    name: "Starter",
    price: "₹9,999",
    period: "/month",
    desc: "Perfect for startups and small teams beginning structured hiring.",
    features: ["Up to 5 active roles", "50 candidate screenings/mo", "Basic pipeline kanban", "Email support", "Standard reports"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "₹24,999",
    period: "/month",
    desc: "Built for scaling teams that need speed, accuracy, and integrations.",
    features: ["Up to 25 active roles", "Unlimited screenings", "Advanced AI matching", "Priority support", "Analytics dashboard", "ATS integrations", "Candidate Passport"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored solutions for large enterprises with complex hiring needs.",
    features: ["Unlimited roles & screenings", "Custom AI models", "Dedicated account manager", "SLA guarantees", "Custom integrations", "HRMS sync", "White-label option"],
    cta: "Contact Sales",
    popular: false,
  },
];

/* ─ Testimonials ─ */
const TESTIMONIALS = [
  { name: "Ananya Sharma", role: "VP Talent, FinCore Technologies", text: "Placify reduced our time-to-hire from 45 days to 11 days. The candidate verification alone saved us 3 bad hires last quarter.", stars: 5 },
  { name: "Rahul Mehra", role: "HR Director, NeoScale Ventures", text: "The AI matching is remarkably accurate. We saw a 91% offer acceptance rate — up from 64% — within the first month.", stars: 5 },
  { name: "Priya Kulkarni", role: "Chief People Officer, BuildRight Corp", text: "The Candidate Passport is a game-changer. Candidates love it, and we trust every shortlist that comes through.", stars: 5 },
];

/* ─ FAQs ─ */
const FAQS = [
  { q: "How does the AI verification work?", a: "Our AI cross-references candidate-provided data against public records, employment databases, educational registries, and GitHub/portfolio analysis using a multi-layer verification pipeline." },
  { q: "How long does it take to get a Candidate Passport?", a: "Most profiles are verified and Passport-activated within 24–48 hours of submission. Expedited processing is available for enterprise clients." },
  { q: "Can we integrate Placify with our existing ATS?", a: "Yes. We support native integrations with Greenhouse, Lever, Workday, SAP SuccessFactors, and offer a REST API for custom integrations." },
  { q: "Is our data secure?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II compliant and GDPR-ready." },
  { q: "What is the minimum contract duration?", a: "Our Starter and Growth plans are available month-to-month with no lock-in. Enterprise plans are typically annual with custom terms." },
];

/* ─ Company logos (text placeholders with premium styling) ─ */
const LOGOS = ["TechCorp", "NeoScale", "BuildRight", "FinCore", "DataPeak", "InnoVenture", "CloudNova", "GrowthLab"];

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'candidate' | 'company' | 'admin'>('company');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', company: '', size: '10-50', message: '' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [workflowTab, setWorkflowTab] = useState<'candidate'|'company'>('company');
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // Live counters
  const [liveCount, setLiveCount] = useState({ passports: 2847, matches: 18921 });
  useEffect(() => {
    const id = setInterval(() => setLiveCount(p => ({ passports: p.passports + Math.floor(Math.random()*2), matches: p.matches + Math.floor(Math.random()*4) })), 3500);
    return () => clearInterval(id);
  }, []);

  const submitDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email) return;
    setDemoSubmitted(true);
    setTimeout(() => { setShowDemoModal(false); setDemoSubmitted(false); setDemoForm({ name:'', email:'', company:'', size:'10-50', message:'' }); }, 2800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setShowAuthModal(false);
      window.location.href = '/dashboard';
    }, 1400);
  };

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 3000);
    setContactForm({ name:'', email:'', message:'' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar onLogin={(tab) => { setAuthTab(tab); setShowAuthModal(true); }} onDemo={() => setShowDemoModal(true)} />

      {/* ══════════════════════════════════════════════════════════════ HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-mesh pt-20">
        <AnimatedBackground />

        {/* Grid overlay */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 badge-gold mb-8"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Hiring Operating System</span>
            <Sparkles className="w-3 h-3" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.06] tracking-tight mb-6"
          >
            <span className="font-serif italic text-dark-gradient">Hire Smarter.</span>
            <br />
            <span className="text-dark-gradient">Hire </span>
            <span className="text-gold-gradient font-serif italic">Verified.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Placify is the verified talent platform that eliminates mis-hires, slashes screening time, and builds trust between companies and candidates through AI-powered verification.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button onClick={() => setShowDemoModal(true)} className="btn-primary text-sm px-8 py-4 rounded-2xl glow-gold-hover group flex items-center gap-2">
              <span>Book a Free Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }}
              className="btn-outline text-sm px-8 py-4 rounded-2xl flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Candidate Login
            </button>
            <button
              onClick={() => { setAuthTab('company'); setShowAuthModal(true); }}
              className="btn-outline text-sm px-8 py-4 rounded-2xl flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" /> Company Login
            </button>
          </motion.div>

          {/* Live Stats Ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-zinc-500 font-medium">
                <span className="text-zinc-800 font-bold tabular-nums">{liveCount.passports.toLocaleString()}</span> Passports Issued Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-zinc-500 font-medium">
                <span className="text-zinc-800 font-bold tabular-nums">{liveCount.matches.toLocaleString()}</span> Matches Made
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Scroll</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ MARQUEE */}
      <div className="py-6 border-y border-zinc-100 bg-zinc-50/60 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} className="mx-10 text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-zinc-200 inline-block"/>
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ STATS */}
      <section className="py-24 px-6 bg-white" id="about">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Our Impact</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-dark-gradient mt-2">
              Numbers That <span className="font-serif italic text-gold-gradient">Speak</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass rounded-3xl p-8 text-center card-lift border border-zinc-100 group">
                  <div className="text-5xl font-black text-dark-gradient mb-2 tabular-nums">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-sm text-zinc-500 font-semibold uppercase tracking-wider">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ SERVICES */}
      <section id="services" className="py-28 px-6 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              <span className="text-dark-gradient">Everything You Need</span>
              <br />
              <span className="font-serif italic text-gold-gradient">To Hire Confidently</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto mt-4 font-medium leading-relaxed">
              A complete hiring operating system — from intelligent sourcing to verified onboarding.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`relative rounded-3xl p-7 border border-zinc-100 bg-gradient-to-br ${s.color} card-lift group cursor-default overflow-hidden`}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-700 mb-5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{s.desc}</p>

                  {/* Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <span className="badge-gold mb-4 inline-block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              <span className="text-dark-gradient">Simple Process,</span>{" "}
              <span className="font-serif italic text-gold-gradient">Remarkable Results</span>
            </h2>
          </FadeIn>

          {/* Tab switcher */}
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex glass rounded-2xl p-1.5 border border-zinc-100 shadow-sm">
              {(['company', 'candidate'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setWorkflowTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                    workflowTab === tab
                      ? 'bg-zinc-900 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {tab === 'company' ? '🏢 For Companies' : '👤 For Candidates'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={workflowTab}
              initial={{ opacity: 0, x: workflowTab === 'company' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: workflowTab === 'company' ? 20 : -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
            >
              {(workflowTab === 'company' ? COMPANY_STEPS : CANDIDATE_STEPS).map((step, i) => (
                <div key={i} className="relative">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-px z-0">
                      <div className="w-2/3 h-px bg-gradient-to-r from-zinc-200 to-transparent ml-4" />
                    </div>
                  )}
                  <div className="glass rounded-3xl p-6 border border-zinc-100 card-lift relative z-10 h-full">
                    <div className="text-4xl font-black text-gold-gradient mb-4 font-serif">{step.num}</div>
                    <h3 className="text-base font-bold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ REAL-TIME FEATURE */}
      <section className="py-28 px-6 bg-zinc-900 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-yellow-500/8 to-amber-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <span className="badge-gold mb-4 inline-block">Live Platform</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 leading-tight">
                Real-Time Hiring<br />
                <span className="font-serif italic text-gold-gradient">Intelligence Dashboard</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Watch candidates move through your pipeline in real time. Get live notifications on assessment completions, verification updates, and match scores — all in one unified workspace.
              </p>
              <ul className="space-y-3">
                {[
                  "Live candidate progress tracking",
                  "Instant verification status updates",
                  "AI-scored match recommendations",
                  "Team collaboration & notes",
                  "Offer management & e-signatures",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Dashboard mockup */}
            <FadeIn direction="right" delay={0.2}>
              <div className="glass-dark rounded-3xl p-6 shadow-2xl glow-gold">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-zinc-500 font-medium">Placify Dashboard</span>
                </div>

                {/* Mini KPI row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Active Pipelines", value: "14", icon: <Layers className="w-3 h-3"/> },
                    { label: "Avg. Match Score", value: "92%", icon: <Target className="w-3 h-3"/> },
                    { label: "Time to Hire", value: "11d", icon: <TrendingUp className="w-3 h-3"/> },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1 text-zinc-500 mb-1 text-[10px]">{kpi.icon} {kpi.label}</div>
                      <div className="text-xl font-black text-white">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                {/* Pipeline rows */}
                {[
                  { name: "Neha Joshi", role: "Senior Engineer", score: 96, stage: "Interview", color: "text-blue-400" },
                  { name: "Arjun Nair", role: "Product Designer", score: 91, stage: "Offer Sent", color: "text-emerald-400" },
                  { name: "Sneha Rao", role: "Data Scientist", score: 88, stage: "Assessment", color: "text-amber-400" },
                  { name: "Kiran Verma", role: "DevOps Lead", score: 94, stage: "Shortlisted", color: "text-purple-400" },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.12 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-2 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-zinc-500">{c.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-white">{c.score}%</div>
                      <div className={`text-[10px] font-semibold ${c.color}`}>{c.stage}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ PRICING */}
      <section id="pricing" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Pricing Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              <span className="text-dark-gradient">Transparent Pricing,</span>
              <br />
              <span className="font-serif italic text-gold-gradient">Real ROI</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto mt-4 font-medium">
              No hidden fees. No per-hire charges. Just predictable pricing that scales with your team.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {PLANS.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className={`rounded-3xl p-8 relative overflow-hidden ${
                  plan.popular
                    ? 'pricing-popular'
                    : 'glass border border-zinc-100 card-lift'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-5 right-5 badge-gold text-[10px] py-1 px-3">
                      Most Popular
                    </div>
                  )}

                  <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-dark-gradient'}`}>
                      {plan.price}
                    </span>
                    {plan.period && <span className={`text-sm mb-2 ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.period}</span>}
                  </div>
                  <p className={`text-sm mb-7 leading-relaxed ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.desc}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-amber-400' : 'text-emerald-500'}`} />
                        <span className={plan.popular ? 'text-zinc-300' : 'text-zinc-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowDemoModal(true)}
                    className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-900 hover:from-amber-500 hover:to-yellow-600 shadow-lg'
                        : 'btn-primary'
                    }`}
                  >
                    {plan.popular ? <span>{plan.cta}</span> : plan.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ TESTIMONIALS */}
      <section className="py-24 px-6 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              <span className="text-dark-gradient">Loved by </span>
              <span className="font-serif italic text-gold-gradient">HR Leaders</span>
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="glass rounded-3xl p-7 border border-zinc-100 card-lift h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 text-sm leading-relaxed flex-1 mb-5 italic">"{t.text}"</p>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">{t.name}</div>
                    <div className="text-xs text-zinc-500 font-medium">{t.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="badge-gold mb-4 inline-block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 text-dark-gradient">
              Common <span className="font-serif italic text-gold-gradient">Questions</span>
            </h2>
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="glass rounded-2xl border border-zinc-100 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-zinc-900 text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ CONTACT */}
      <section id="contact" className="py-28 px-6 bg-zinc-50/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <FadeIn direction="left">
              <span className="badge-gold mb-4 inline-block">Contact Us</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-6">
                <span className="text-dark-gradient">Let's Start a</span>
                <br />
                <span className="font-serif italic text-gold-gradient">Conversation</span>
              </h2>
              <p className="text-zinc-500 leading-relaxed mb-10">
                Ready to transform your hiring? Our team is here to help you get started, answer questions, and tailor Placify to your organization's needs.
              </p>

              <div className="space-y-5">
                {[
                  { icon: <Mail className="w-5 h-5"/>, label: "Email Us", value: "hello@placify.in" },
                  { icon: <Phone className="w-5 h-5"/>, label: "Call Us", value: "+91 98765 43210" },
                  { icon: <MapPin className="w-5 h-5"/>, label: "Office", value: "Bengaluru, Karnataka, India" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{c.label}</div>
                      <div className="text-sm font-bold text-zinc-900">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <div className="glass rounded-3xl p-8 border border-zinc-100 shadow-sm">
                {contactSent ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Message Sent!</h3>
                    <p className="text-zinc-500 text-sm">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={submitContact} className="space-y-5">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Your Name</label>
                      <input className="input-premium" type="text" required placeholder="John Doe" value={contactForm.name}
                        onChange={e => setContactForm(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                      <input className="input-premium" type="email" required placeholder="john@company.com" value={contactForm.email}
                        onChange={e => setContactForm(p => ({...p, email: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Message</label>
                      <textarea className="input-premium resize-none" rows={4} required placeholder="Tell us about your hiring needs..."
                        value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm">
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ FOOTER */}
      <footer className="bg-zinc-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            <div className="md:col-span-2">
              <img src="/logo.jpg" alt="Placify" className="h-10 w-auto rounded-lg object-contain mb-4 bg-white/5 p-1" />
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
                The verified hiring operating system for modern enterprises. Faster hires. Zero mis-hires. Total confidence.
              </p>
              <div className="flex gap-3">
                {['LinkedIn', 'Twitter', 'GitHub'].map(s => (
                  <a key={s} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["AI Screening", "Candidate Passport", "Talent Pipeline", "Analytics", "Integrations"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Privacy Policy", "Terms of Service"] },
            ].map((col, i) => (
              <div key={i}>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-5">{col.title}</div>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-zinc-400 text-sm hover:text-white transition-colors hover-underline">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="section-divider mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs">© 2025 Placify Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => { setAuthTab('candidate'); setShowAuthModal(true); }} className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">Candidate Login</button>
              <button onClick={() => { setAuthTab('company'); setShowAuthModal(true); }} className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">Company Login</button>
              <button onClick={() => { setAuthTab('admin'); setShowAuthModal(true); }} className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">Admin Login</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════ DEMO MODAL */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
            >
              {/* Top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />

              <div className="p-8">
                <button onClick={() => setShowDemoModal(false)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-zinc-100 transition-colors">
                  <X className="w-4 h-4 text-zinc-500" />
                </button>

                {demoSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-2">Demo Requested!</h3>
                    <p className="text-zinc-500 text-sm">Our team will reach out within 2 business hours to schedule your personalized demo.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <img src="/logo.jpg" alt="Placify" className="h-8 w-auto mb-4 mix-blend-multiply" />
                      <h2 className="text-2xl font-black text-zinc-900 mb-1">Book a Free Demo</h2>
                      <p className="text-sm text-zinc-500">See Placify in action — tailored to your hiring workflow.</p>
                    </div>

                    <form onSubmit={submitDemo} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                          <input className="input-premium" type="text" required placeholder="John Doe"
                            value={demoForm.name} onChange={e => setDemoForm(p => ({...p, name: e.target.value}))} />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Work Email *</label>
                          <input className="input-premium" type="email" required placeholder="john@co.com"
                            value={demoForm.email} onChange={e => setDemoForm(p => ({...p, email: e.target.value}))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Company</label>
                          <input className="input-premium" type="text" placeholder="Your Company"
                            value={demoForm.company} onChange={e => setDemoForm(p => ({...p, company: e.target.value}))} />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Team Size</label>
                          <select className="input-premium text-sm" value={demoForm.size}
                            onChange={e => setDemoForm(p => ({...p, size: e.target.value}))}>
                            <option>1–10</option><option>10–50</option><option>50–250</option><option>250+</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">What are you looking for?</label>
                        <textarea className="input-premium resize-none" rows={3} placeholder="Tell us about your hiring challenges..."
                          value={demoForm.message} onChange={e => setDemoForm(p => ({...p, message: e.target.value}))} />
                      </div>
                      <button type="submit" className="btn-primary w-full py-4 rounded-2xl text-sm flex items-center justify-center gap-2">
                        <span>Request Demo</span>
                        <Rocket className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
            >
              <div className="h-1 w-full bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-900" />

              <div className="p-8">
                <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-zinc-100 transition-colors">
                  <X className="w-4 h-4 text-zinc-500" />
                </button>

                <div className="text-center mb-7">
                  <img src="/logo.jpg" alt="Placify" className="h-10 w-auto mx-auto mb-3 mix-blend-multiply" />
                  <p className="text-xs text-zinc-500">Select your portal and sign in</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-zinc-50 rounded-2xl p-1.5 gap-1 mb-7 border border-zinc-100">
                  {([
                    { label: '🏢 Company', val: 'company' },
                    { label: '👤 Candidate', val: 'candidate' },
                    { label: '🛡️ Admin', val: 'admin' },
                  ] as const).map(t => (
                    <button key={t.val} onClick={() => setAuthTab(t.val)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${authTab === t.val ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <input className="input-premium" type="email" required placeholder="you@company.com"
                      value={authForm.email} onChange={e => setAuthForm(p => ({...p, email: e.target.value}))} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Password</label>
                      <button type="button" className="text-[11px] text-amber-600 hover:underline font-semibold">Forgot Password?</button>
                    </div>
                    <input className="input-premium" type="password" required placeholder="••••••••••••"
                      value={authForm.password} onChange={e => setAuthForm(p => ({...p, password: e.target.value}))} />
                  </div>
                  <button type="submit" disabled={authLoading}
                    className="btn-primary w-full py-4 rounded-2xl text-sm flex items-center justify-center gap-2 mt-2">
                    {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    <span>{authLoading ? 'Authenticating...' : `Enter ${authTab === 'company' ? 'Company' : authTab === 'candidate' ? 'Candidate' : 'Admin'} Portal`}</span>
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
