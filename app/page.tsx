'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Zap, ChevronRight, Shield, ShieldCheck, CheckCircle2,
  Brain, Cloud, Palette, Globe, Star, ArrowRight, Check, Clock,
  Users, FileSearch, Award, Lock, Cpu, BarChart3, Fingerprint,
  BadgeCheck, TrendingUp, Sparkles, Building2, Phone, Mail,
  MapPin, Twitter, Linkedin, Github, Instagram, ChevronDown,
  Briefcase, Target, Eye, Layers, FileText, CheckCircle
} from 'lucide-react';

/* ============ TYPES ============ */
interface NavLinkProps {
  href: string;
  label: string;
}

/* ============ MOTION VARIANTS ============ */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/* ============ COMPONENT: HEADER ============ */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links: NavLinkProps[] = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#services', label: 'Services' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <img 
            src="/logo.jpg" 
            alt="PLACIFY" 
            className="h-10 w-10 rounded-xl object-cover shadow-premium border border-slate-200/50 group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">PLACIFY</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">Hiring OS</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="/login" 
            className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="px-5 py-2.5 bg-[#0052CC] text-white text-[14px] font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="lg:hidden p-2 text-slate-900"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
          >
            <div className="px-6 py-8 space-y-5">
              {links.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMobileOpen(false)} 
                  className="block text-base font-semibold text-slate-700 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                <a 
                  href="/login" 
                  onClick={() => setMobileOpen(false)} 
                  className="text-center py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  onClick={() => setMobileOpen(false)} 
                  className="text-center py-3 text-sm font-bold text-white bg-[#0052CC] rounded-xl shadow-premium"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============ SECTION: HERO ============ */
function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 gradient-mesh overflow-hidden noise-overlay">
      {/* Glow Rings */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[120px] opacity-30 animate-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Hero Left */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Smarter Hiring Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
              Right Talent.<br />
              Right Place.<br />
              <span className="text-[#0052CC] bg-gradient-to-r from-[#0052CC] to-[#4F46E5] bg-clip-text text-transparent">Smarter Hiring.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-10">
              Placify helps companies discover qualified talent faster through AI-powered hiring intelligence and helps candidates showcase their skills professionally.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="/register" 
                className="px-8 py-4 bg-[#0052CC] text-white font-bold rounded-2xl hover:bg-[#0040A3] transition-colors shadow-premium flex items-center gap-2 group"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#services" 
                className="px-8 py-4 bg-white text-slate-800 font-bold rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
              >
                Explore Services
              </a>
            </div>

            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-100 text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold">AI Talent Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold">Verified Passports</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Right: Interactive Dashboard Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            {/* Main Dashboard Panel */}
            <div className="w-full max-w-[540px] bg-white rounded-3xl shadow-premium-lg border border-slate-200/60 p-6 overflow-hidden relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-xs font-semibold text-slate-400 ml-2">Hiring Intelligence Dashboard</span>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>

              <div className="space-y-4">
                {/* Score & Match */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>ATS Matching</span>
                      <Cpu size={14} className="text-blue-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">98.4%</div>
                    <div className="text-[10px] font-semibold text-emerald-600 mt-1">Excellent Score Match</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Trust index</span>
                      <Shield size={14} className="text-indigo-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-[#0052CC]">RA+</div>
                    <div className="text-[10px] font-semibold text-blue-600 mt-1">Highly Reliable Profile</div>
                  </div>
                </div>

                {/* Candidate Passport Preview Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#0052CC] to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
                      AP
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Arjun Patel</h4>
                      <p className="text-slate-500 text-xs font-medium">Senior Full-Stack Engineer</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-bold tracking-wider uppercase">Elite</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1">Score: 842/1000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Identity Verification', icon: Fingerprint, text: 'Verified PAN & Aadhaar' },
                      { label: 'Employment Verification', icon: Briefcase, text: 'Last 3 Companies Confirmed' },
                      { label: 'Skills Assessment', icon: Award, text: 'A+ Grade (React, Node, Cloud)' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <step.icon size={16} className="text-[#0052CC]" />
                        <div className="flex-1">
                          <span className="font-semibold text-slate-800 block">{step.label}</span>
                          <span className="text-slate-400 text-[10px]">{step.text}</span>
                        </div>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Funnel */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Hiring Pipeline Funnel</span>
                  <div className="space-y-2">
                    {[
                      { label: 'Applied', count: 543, pct: 'w-full bg-[#0052CC]' },
                      { label: 'Screened', count: 212, pct: 'w-[70%] bg-blue-600' },
                      { label: 'Interviewed', count: 88, pct: 'w-[45%] bg-blue-500' },
                      { label: 'Offered', count: 15, pct: 'w-[20%] bg-indigo-500' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs font-semibold">
                        <span className="w-20 text-slate-500">{row.label}</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.pct}`} />
                        </div>
                        <span className="w-10 text-right text-slate-800">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div 
              animate={{ y: [-6, 6, -6] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-premium p-3 border border-slate-200/60 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0052CC]">
                <Brain size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">AI Matching</p>
                <p className="text-sm font-extrabold text-slate-800">94% Accuracy</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [6, -6, 6] }} 
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-premium p-3 border border-slate-200/60 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Verification</p>
                <p className="text-sm font-extrabold text-slate-800">100% Trusted</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: ABOUT PLACIFY ============ */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    { title: 'Manual Hiring', desc: 'Sifting through hundreds of applicants manually takes days and invites human bias.' },
    { title: 'Resume Overload', desc: 'Drowning in standard resume templates without verifiable proof of competencies.' },
    { title: 'Poor Visibility', desc: 'No reliable ways to see the candidate\'s real commitments and professional trust score.' },
    { title: 'Slow Turnarounds', desc: 'Weeks wasted scheduling interviews for non-vetted or non-matching applicants.' },
    { title: 'Unstructured Funnels', desc: 'Recruiting steps operate in silos rather than a cohesive hiring workspace.' }
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            About Placify
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Placify exists to bridge the trust gap in engineering and technology recruiting. By introducing data-rich hiring intelligence, we automate validation processes and make talent acquisition objective.
          </p>
        </div>

        {/* Problems Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {problems.map((prob, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 card-lift flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0052CC] mb-6">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{prob.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{prob.desc}</p>
              </div>
            </motion.div>
          ))}
          
          {/* Summary / Mission Card */}
          <motion.div 
            variants={fadeIn}
            className="bg-gradient-to-br from-[#0052CC] to-indigo-700 text-white rounded-2xl p-6 shadow-premium flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Our Mission</span>
              <h3 className="text-2xl font-black tracking-tight mt-4 mb-4">
                Redefining Professional Identity & Trust.
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Empowering candidates to build verifiable technical credentials, and giving enterprises a modern workspace to hire them instantly.
              </p>
            </div>
            <a href="/register" className="mt-8 flex items-center gap-2 text-sm font-bold text-white hover:underline">
              <span>Learn more</span>
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ SECTION: HOW PLACIFY WORKS ============ */
function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { title: 'Create Job', desc: 'Company publishes a job description with requirements' },
    { title: 'AI Analysis', desc: 'ATS extracts core skills and computes optimal candidate profiles' },
    { title: 'Matching', desc: 'Search engine ranks verified profiles using semantic matching' },
    { title: 'Intelligence', desc: 'Deep resume parsing and verified experience score extraction' },
    { title: 'Verification', desc: 'Instant identity, educational, and employment checks' },
    { title: 'Interview', desc: 'Schedule and orchestrate Technical/Culture interviews' },
    { title: 'Hiring', desc: 'Onboard candidates with confidence and zero credentials risk' }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Workflow Funnel
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            How Placify Works
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Placify standardizes the entire talent discovery and acquisition funnel, ensuring speed, security, and credentials precision.
          </p>
        </div>

        {/* Workflow Line Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative grid md:grid-cols-4 lg:grid-cols-7 gap-6 z-10"
        >
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-colors text-center flex flex-col items-center justify-between"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0052CC] font-bold text-sm flex items-center justify-center mb-4 border border-blue-100">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
              
              {/* Connector Arrow for Desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[50%] right-[-14px] translate-y-[-50%] text-slate-300 pointer-events-none">
                  <ChevronRight size={18} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============ SECTION: CANDIDATE PORTAL ============ */
function CandidatePromo() {
  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Dashboard Preview */}
          <div className="lg:col-span-6 relative flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[480px] bg-slate-50 rounded-2xl p-5 border border-slate-200/70 shadow-premium relative">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Candidate Passport Preview</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-bold uppercase">Ready</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Jayesh Deshmukh</h4>
                    <p className="text-slate-500 text-[11px]">Backend & Cloud Engineer</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Skills Score:</span>
                    <span className="font-bold text-slate-900">A (92/100)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Identity check:</span>
                    <span className="font-bold text-emerald-600">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>LinkedIn Sync:</span>
                    <span className="font-bold text-blue-600">Connected</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay element */}
            <div className="absolute -top-4 -right-4 bg-white shadow-premium rounded-xl p-3 border border-slate-200 text-xs font-semibold flex items-center gap-2 animate-float-slow">
              <Star className="text-yellow-400" size={16} />
              <span>Elite Talent Verified</span>
            </div>
          </div>

          {/* Right Column: Copy and Info */}
          <div className="lg:col-span-6 text-left order-1 lg:order-2">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              For Candidates
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
              Build More Than A Resume.<br />
              <span className="text-[#0052CC]">Build Your Professional Identity.</span>
            </h2>
            
            <ul className="space-y-4 mb-8">
              {[
                { title: 'AI Resume Intelligence', desc: 'Let our model extract and format your technical history accurately.' },
                { title: 'Job Matching', desc: 'Get matched with companies looking precisely for your verified skill set.' },
                { title: 'Professional Candidate Passport', desc: 'Export a secure, verified passport that proves your identity and skill claims.' },
                { title: 'Better Visibility', desc: 'Stand out with pre-verified profiles that jump past initial screening steps.' },
                { title: 'Faster Hiring Opportunities', desc: 'Shorten your interview funnel since companies trust your pre-evaluated passport.' },
                { title: 'Direct Communication', desc: 'Connect directly with hiring managers inside dedicated job workspaces.' }
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 text-[#0052CC] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check size={12} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{benefit.title}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{benefit.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a 
              href="/candidate/register" 
              className="px-6 py-3 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium inline-flex items-center gap-2"
            >
              <span>Join Placify</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: COMPANY PORTAL ============ */
function CompanyPromo() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Copy and Info */}
          <div className="lg:col-span-6 text-left">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              For Companies
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
              Hire Smarter.<br />
              <span className="text-[#0052CC]">Hire Faster.</span>
            </h2>
            
            <ul className="space-y-4 mb-8">
              {[
                { title: 'ATS Matching', desc: 'Instantly source candidates using our high-accuracy vector match engine.' },
                { title: 'Resume Intelligence', desc: 'Scan and score high volumes of applicant CVs against core job requirements.' },
                { title: 'Candidate Discovery', desc: 'Query our public pre-verified pool for vetted tech talent.' },
                { title: 'Hiring Workspaces', desc: 'Manage applicant stages using modern workflow pipelines and kanban boards.' },
                { title: 'Candidate Passport Inspection', desc: 'Inspect candidate verification badges (identity, background, test score).' },
                { title: 'Advanced Filtering', desc: 'Filter by Notice Period, Expected Salary, and Specific Skills Matrix.' }
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 text-[#0052CC] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check size={12} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{benefit.title}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{benefit.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a 
              href="/company/register" 
              className="px-6 py-3 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium inline-flex items-center gap-2"
            >
              <span>Create Company Workspace</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Right Column: Workspace Preview Mockup */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-[480px] bg-white rounded-2xl p-5 border border-slate-200 shadow-premium relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">Enterprise Workspace</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">Job Title: Tech Lead</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Applications: 120 Vetted Matches</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">Job Title: Frontend Dev</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Applications: 94 Vetted Matches</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white shadow-premium rounded-xl p-3 border border-slate-200 text-xs font-semibold flex items-center gap-2 animate-float-slower">
              <BarChart3 className="text-blue-500" size={16} />
              <span>ATS Funnel Open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: TRADITIONAL VS SMART HIRING ============ */
function Comparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const traditional = [
    { title: 'Manual Screening', desc: 'Recruiters wasting hours scanning files.' },
    { title: 'Resume Overload', desc: 'No reliable credentials verify or trust ranking.' },
    { title: 'Slow Hiring', desc: 'Taking weeks to run interviews and finalize hires.' },
    { title: 'Scattered Communication', desc: 'Managing processes on emails, spreadsheets, and chats.' }
  ];

  const placify = [
    { title: 'AI Matching', desc: 'Instant vector candidate scoring against Job criteria.' },
    { title: 'Resume Intelligence', desc: 'Verifiable proof of educational and technical claims.' },
    { title: 'Structured Hiring', desc: 'Centralized workspace funnels for candidate sourcing.' },
    { title: 'Faster Decisions', desc: 'Reduce screening pipeline times by up to 80%.' }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Comparison
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Traditional vs Smart Hiring
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            See how Placify transforms classical recruiting workflows into an optimized intelligence operating system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <X size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950">Traditional Hiring</h4>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Legacy Recruiting</p>
                </div>
              </div>
              
              <ul className="space-y-4">
                {traditional.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <X size={16} className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-700">{item.title}</span>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 text-center text-xs text-slate-400 font-semibold uppercase">
              Risky & Inefficient
            </div>
          </motion.div>

          {/* Placify Smart Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-white border-2 border-[#0052CC]/40 rounded-3xl p-8 shadow-premium flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-950">Placify Hiring</h4>
                  <p className="text-[11px] text-[#0052CC] font-bold uppercase">Modern SaaS</p>
                </div>
              </div>
              
              <ul className="space-y-4">
                {placify.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <Check size={16} className="text-[#0052CC] mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 text-center text-xs text-[#0052CC] font-bold uppercase">
              AI-Powered & Verified
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: INDUSTRIES / SLIDER ============ */
function Industries() {
  const domains = [
    'Software Engineering', 'Frontend Development', 'Backend Development',
    'Full Stack Development', 'UI/UX Design', 'Cloud Engineering',
    'Cyber Security', 'DevOps', 'AI Engineering', 'Data Science',
    'Machine Learning', 'QA Testing', 'Product Management',
    'Business Analysis', 'Digital Marketing', 'HR', 'Finance'
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Industry Verticals We Support</span>
      </div>
      
      {/* Infinite slider container */}
      <div className="relative flex overflow-x-hidden">
        <div className="flex gap-6 animate-infinite-scroll whitespace-nowrap py-2">
          {/* Double list to loop seamlessly */}
          {[...domains, ...domains].map((domain, idx) => (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-semibold text-slate-800"
            >
              <Zap size={14} className="text-[#0052CC]" />
              <span>{domain}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: SERVICES ============ */
function ServicesSection() {
  const services = [
    {
      title: 'Placify Hiring Service',
      desc: 'Complete hiring solution where Placify assists companies in finding, screening and hiring candidates.',
      url: '/services/hiring',
      steps: ['Job Creation', 'AI Matching', 'Shortlisting', 'Interview', 'Hiring']
    },
    {
      title: 'Self Hiring Solution',
      desc: 'Companies use Placify ATS and candidate discovery tools independently to source technical talent.',
      url: '/services/self-hiring',
      steps: ['Create Job', 'AI Analysis', 'Candidate Search', 'Shortlisting']
    },
    {
      title: 'Bulk Resume ATS Shortlisting',
      desc: 'Upload hundreds of resumes and receive ATS-ranked candidate shortlists instantly.',
      url: '/services/bulk-resume',
      steps: ['Upload Resumes', 'Resume Parsing', 'Skill Extraction', 'ATS Ranking', 'Shortlisting']
    },
    {
      title: 'Academic Software Projects',
      desc: 'Custom software projects and final-year academic builds designed for college students.',
      url: '/services/academic-projects',
      steps: ['Domains: AI/ML, Web, Cloud, Cyber, IoT, Data Science']
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Placify Service Verticals
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Choose the recruiting model that fits your workspace needs. From fully managed assisted searches to autonomous ATS workflows.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((serv, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm card-lift flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">{serv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{serv.desc}</p>
                
                {/* Steps workflow visual */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {serv.steps.map((step, sidx) => (
                    <div key={sidx} className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full font-semibold text-slate-700">
                        {step}
                      </span>
                      {sidx < serv.steps.length - 1 && (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href={serv.url} 
                className="px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-sm font-bold rounded-xl shadow-sm text-center transition-colors block"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: PRICING ============ */
function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plansHiring = [
    {
      name: 'Starter',
      priceMonthly: 39999,
      priceYearly: 31999,
      desc: 'Ideal for early-stage startups and small projects.',
      features: ['5 Active Jobs postings', '50 Resume parsing matches', 'Base ATS evaluation Engine', 'Email Support'],
      recommended: false
    },
    {
      name: 'Growth',
      priceMonthly: 99999,
      priceYearly: 79999,
      desc: 'Perfect for fast-growing companies and teams.',
      features: ['20 Active Jobs postings', '250 Resume parsing matches', 'Advanced AI match algorithms', 'Priority Chat Support', 'Candidate Trust badges Sync'],
      recommended: true
    },
    {
      name: 'Enterprise',
      priceMonthly: null, // Custom
      priceYearly: null,
      desc: 'For larger enterprises with volume hiring workloads.',
      features: ['Unlimited Active Jobs', 'Unlimited Resume shortlists', 'Custom API & database integration', '24/7 dedicated account support', 'Full RLS Candidate passport verification'],
      recommended: false
    }
  ];

  const plansShortlisting = [
    {
      name: 'Basic',
      priceMonthly: 14999,
      priceYearly: 11999,
      desc: 'For simple resume sifting projects.',
      features: ['100 Resumes parsed/mo', 'Skill Extraction analysis', 'Basic ATS rank shortlist'],
      recommended: false
    },
    {
      name: 'Professional',
      priceMonthly: 39999,
      priceYearly: 31999,
      desc: 'Optimized for recurring recruitment sifting.',
      features: ['500 Resumes parsed/mo', 'Skill Extraction analysis', 'Advanced ATS vector rank shortlist', 'Direct CSV exports'],
      recommended: true
    },
    {
      name: 'Enterprise',
      priceMonthly: null,
      priceYearly: null,
      desc: 'High-volume candidate matching pipelines.',
      features: ['Unlimited resume uploads', 'Custom skill weighting models', 'Direct candidate API connections'],
      recommended: false
    }
  ];

  const formatPrice = (p: number | null) => {
    if (p === null) return 'Custom';
    return `₹${p.toLocaleString('en-IN')}`;
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Subscription
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Transparent Pricing plans
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            All prices displayed in INR. Toggle between monthly and yearly billing to save up to 20%.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${billingPeriod === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-blue-100 rounded-full p-1 relative flex items-center transition-colors"
            >
              <div 
                className={`w-4 h-4 bg-[#0052CC] rounded-full shadow-sm transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`} 
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2.5 ${billingPeriod === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
              <span>Yearly</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Category 1: Placify Hiring */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-3">Placify Hiring Plans</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {plansHiring.map((plan, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-3xl p-8 border shadow-sm relative flex flex-col justify-between card-lift ${
                  plan.recommended ? 'border-2 border-[#0052CC]/50 shadow-premium' : 'border-slate-200'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#0052CC] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h4>
                  <p className="text-slate-500 text-xs mb-6">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {formatPrice(billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly)}
                    </span>
                    {plan.priceMonthly && (
                      <span className="text-xs text-slate-400 font-semibold">/month</span>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-600">
                        <Check size={14} className="text-emerald-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="/register" 
                  className={`px-5 py-3 text-center text-xs font-bold rounded-xl transition-colors ${
                    plan.recommended ? 'bg-[#0052CC] text-white hover:bg-[#0040A3]' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Category 2: Bulk Resume Shortlisting */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-3">Bulk Resume Shortlisting Plans</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {plansShortlisting.map((plan, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-3xl p-8 border shadow-sm relative flex flex-col justify-between card-lift ${
                  plan.recommended ? 'border-2 border-[#0052CC]/50 shadow-premium' : 'border-slate-200'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#0052CC] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h4>
                  <p className="text-slate-500 text-xs mb-6">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {formatPrice(billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly)}
                    </span>
                    {plan.priceMonthly && (
                      <span className="text-xs text-slate-400 font-semibold">/month</span>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-600">
                        <Check size={14} className="text-emerald-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="/register" 
                  className={`px-5 py-3 text-center text-xs font-bold rounded-xl transition-colors ${
                    plan.recommended ? 'bg-[#0052CC] text-white hover:bg-[#0040A3]' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION: CONTACT ============ */
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Placify Hiring Service',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'Placify Hiring Service',
        message: ''
      });
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Us / Request Demo</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase block mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase block mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone" 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com" 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="text-xs font-bold text-slate-600 uppercase block mb-2">Inquiry For</label>
                <select 
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                >
                  <option>Placify Hiring Service</option>
                  <option>Self Hiring Solution</option>
                  <option>Bulk Resume ATS Shortlisting</option>
                  <option>Academic Software Projects</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase block mb-2">Message</label>
                <textarea 
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help your team?" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full px-6 py-4 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium flex items-center justify-center gap-2"
              >
                <span>{submitted ? 'Inquiry Sent ✓' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details */}
          <div className="lg:col-span-5 space-y-8 lg:pt-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Contact Details</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Get In Touch With Placify</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions about our vector match engine, ATS workflows, or student academic software plans? Our team in Pune is ready to assist.
              </p>
            </div>

            <div className="space-y-5 text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Phone size={18} />
                </div>
                <span>7796420465</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Mail size={18} />
                </div>
                <a href="mailto:placiffy.contact@gmail.com" className="hover:underline">placiffy.contact@gmail.com</a>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ COMPONENT: FOOTER ============ */
function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="PLACIFY" 
                className="h-9 w-9 rounded-lg object-cover" 
              />
              <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">PLACIFY</span>
            </a>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Right Talent. Right Place. SMARTER HIRING OS.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0052CC] hover:border-[#0052CC] transition-all">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0052CC] hover:border-[#0052CC] transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0052CC] hover:border-[#0052CC] transition-all">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li><a href="#home" className="hover:text-slate-900 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-slate-900 transition-colors">About</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a></li>
              <li><a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Services</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li><a href="/services/hiring" className="hover:text-slate-900 transition-colors">Placify Hiring Service</a></li>
              <li><a href="/services/self-hiring" className="hover:text-slate-900 transition-colors">Self Hiring Solution</a></li>
              <li><a href="/services/bulk-resume" className="hover:text-slate-900 transition-colors">Bulk Resume shortlists</a></li>
              <li><a href="/services/academic-projects" className="hover:text-slate-900 transition-colors">Academic software Projects</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Legal</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-semibold text-slate-400">
          <span>&copy; {new Date().getFullYear()} PLACIFY. All rights reserved.</span>
          <span className="mt-2 md:mt-0 uppercase tracking-widest">Right Talent. Right Place.</span>
        </div>
      </div>
    </footer>
  );
}

/* ============ MAIN PAGE ============ */
export default function Page() {
  // Initialize Lenis scroll dynamically
  useEffect(() => {
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <Hero />
      <About />
      <HowItWorks />
      <CandidatePromo />
      <CompanyPromo />
      <Comparison />
      <Industries />
      <ServicesSection />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
