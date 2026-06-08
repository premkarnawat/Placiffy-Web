'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Zap, ChevronRight, Shield, ShieldCheck, CheckCircle2,
  Brain, Cloud, Palette, Globe, Star, ArrowRight, Check, Clock,
  Users, FileSearch, Award, Lock, Cpu, BarChart3, Fingerprint,
  BadgeCheck, TrendingUp, Sparkles, Building2, Phone, Mail,
  MapPin, Twitter, Linkedin, Github, Instagram, ChevronDown,
  Briefcase, Target, Eye, Layers
} from 'lucide-react';

/* --- helpers --- */
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
const slideLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
const slideRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };

function SectionHeading({ badge, title, subtitle, light = false }: { badge?: string; title: string; subtitle: string; light?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
      {badge && <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 ${light ? 'bg-white/15 text-white/90' : 'bg-blue-50 text-[#1A56DB] border border-blue-100'}`}>{badge}</span>}
      <h2 className={`font-serif text-4xl md:text-5xl mb-5 ${light ? 'text-white' : 'text-[#111827]'}`}>{title}</h2>
      <p className={`text-lg leading-relaxed ${light ? 'text-blue-100' : 'text-[#6B7280]'}`}>{subtitle}</p>
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ============ HEADER ============ */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const navLinks = ['How it Works', 'Services', 'AI Hiring', 'Pricing'];

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#3B82F6] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#111827]">PLACIFY</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">{l}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">Login</a>
          <a href="/register" className="px-5 py-2.5 bg-[#1A56DB] text-white text-[13px] font-bold rounded-xl hover:bg-[#1E40AF] transition-colors shadow-[0_2px_8px_rgba(26,86,219,0.3)]">Sign Up</a>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#111827]">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-[#374151]">{l}</a>)}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <a href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-[#6B7280] border border-gray-200 rounded-xl">Login</a>
                <a href="/register" className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-[#1A56DB] rounded-xl">Sign Up</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
/* ============ HERO ============ */
function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section ref={ref} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-20 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-50 to-blue-100/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 mb-8">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-amber-700">Best Hiring Intelligence</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-5xl md:text-6xl lg:text-[68px] leading-[1.08] text-[#111827] mb-6">
            Hire Better.<br/>
            <span className="text-[#1A56DB]">Hire Faster.</span><br/>
            Hire Verified.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-[#6B7280] leading-relaxed max-w-lg mb-10">
            The ultimate Hiring Intelligence Operating System for modern enterprises. Leverage AI-driven verification and data-rich talent scoring.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4">
            <a href="#services" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A56DB] text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(26,86,219,0.35)] hover:bg-[#1E40AF] hover:shadow-[0_8px_30px_rgba(26,86,219,0.45)] transition-all duration-300">
              Explore PLACIFY
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[#1A56DB] font-bold text-sm rounded-xl border-2 border-[#1A56DB]/20 hover:border-[#1A56DB]/50 hover:bg-blue-50/50 transition-all duration-300">
              Get Started
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: `linear-gradient(135deg, ${['#1A56DB','#3B82F6','#6366F1','#8B5CF6','#EC4899'][i]}, ${['#3B82F6','#60A5FA','#818CF8','#A78BFA','#F472B6'][i]})` }} />
              ))}
            </div>
            <p className="text-sm text-[#6B7280]"><span className="font-bold text-[#111827]">500+</span> enterprises trust PLACIFY</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 50, rotateY: -8 }} animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center lg:justify-end">
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full max-w-[400px]"
          >
            <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="bg-gradient-to-r from-[#1A56DB] to-[#3B82F6] p-6 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-white/90" />
                    <span className="text-white font-bold text-sm tracking-wide">CANDIDATE PASSPORT</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold text-white tracking-wider">VERIFIED</span>
                </div>
                <p className="text-blue-100 text-xs mt-3 relative z-10">Issued by PLACIFY Intelligence Platform</p>
              </div>

              <div className="p-6 -mt-6">
                <div className="flex items-end gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#6366F1] flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white">
                    AP
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-lg">Arjun Patel</h3>
                    <p className="text-[#6B7280] text-sm">Senior Full-Stack Engineer</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3.5 border border-green-100">
                    <p className="text-[10px] font-bold text-green-600 tracking-wider uppercase mb-1">ATS Score</p>
                    <p className="text-2xl font-extrabold text-green-700">98.4<span className="text-sm font-bold">%</span></p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3.5 border border-blue-100">
                    <p className="text-[10px] font-bold text-[#1A56DB] tracking-wider uppercase mb-1">Trust Index</p>
                    <p className="text-2xl font-extrabold text-[#1A56DB]">RA<span className="text-sm font-bold">+</span></p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Identity Verified', icon: Fingerprint, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Employment History', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Skills Assessment', icon: Award, color: 'text-purple-600 bg-purple-50' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80">
                      <div className={`w-8 h-8 rounded-lg ${b.color} flex items-center justify-center`}>
                        <b.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-[#374151]">{b.label}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -left-6 top-32 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase">Match Rate</p>
                <p className="text-sm font-extrabold text-[#111827]">94.2%</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-4 bottom-20 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#1A56DB]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#1A56DB] uppercase">Verified</p>
                <p className="text-sm font-extrabold text-[#111827]">100%</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
/* ============ EVOLUTION OF HIRING ============ */
function EvolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const traditional = [
    { title: 'Manual Resume Sifting', desc: 'Recruiters spend 6-8 seconds per resume' },
    { title: 'Gut-Feel Decisions', desc: 'No data, no validation' },
    { title: 'Ghost Post-Credentials', desc: 'Interviewing unreliable talent, ghost candidates in interviews' },
  ];
  const placify = [
    { title: 'AI Match Precision', desc: '94%+ accuracy in candidate-role matching' },
    { title: 'Verifiable Verification', desc: 'Background, skill, and trust scoring for every candidate' },
    { title: 'Joinable Candidates', desc: 'Candidates with real commitment scores, verified identity' },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHeading badge="Why Placify" title="The Evolution of Hiring" subtitle="Traditional hiring is broken, manual, and risky. PLACIFY injects intelligence into every step of the funnel." />

        <div className="grid md:grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideLeft} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Traditional Hiring</h3>
                <p className="text-xs text-[#6B7280]">Outdated, risky, slow</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {traditional.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100/50">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] text-sm mb-1">{item.title}</h4>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideRight} transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl border border-blue-200/60 overflow-hidden shadow-sm ring-1 ring-blue-100/50">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Placify Intelligence</h3>
                <p className="text-xs text-[#1A56DB]">AI-powered, verified, fast</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {placify.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] text-sm mb-1">{item.title}</h4>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
/* ============ CAPABILITIES ============ */
function CapabilitiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const caps = [
    { icon: FileSearch, title: 'ATS Screening', desc: 'AI-powered 94% accuracy matching. Real-time skill detection, experience validation, and salary benchmarking.', color: '#1A56DB', bg: 'bg-blue-50' },
    { icon: ShieldCheck, title: 'Background Verification', desc: 'Automated checks for education, past employment, professional certifications & identity.', color: '#059669', bg: 'bg-emerald-50' },
    { icon: Layers, title: 'Work Samples', desc: 'Real-time hands-on challenges designed by industry experts to evaluate practical execution.', color: '#7C3AED', bg: 'bg-purple-50' },
    { icon: Shield, title: 'AI Trust Score', desc: 'Proprietary algorithm aggregating 12+ data signals into a single reliability index.', color: '#D97706', bg: 'bg-amber-50' },
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHeading badge="Capabilities" title="Platform Capabilities" subtitle="Production-grade tools for every stage of talent acquisition." />

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {caps.map((c, i) => (
            <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-100 transition-all duration-300 cursor-default">
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}>
                <c.icon className="w-6 h-6" style={{ color: c.color }} />
              </div>
              <h3 className="font-bold text-[#111827] text-lg mb-2">{c.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, delay: 0.5 }}
          className="grid lg:grid-cols-5 gap-6 rounded-3xl overflow-hidden">
          <div className="lg:col-span-3 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(26,86,219,0.15),transparent_60%)]" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-blue-300 tracking-wider uppercase mb-4">One Unified Interface</span>
              <h3 className="text-white font-bold text-2xl md:text-3xl mb-3">One Unified Interface for All Hiring</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                Manage end-to-end hiring from a single dashboard. Track candidates, run verification, and score talent — all in one place.
              </p>
              <div className="space-y-3">
                {[85, 70, 95, 60].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                    </div>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={inView ? { width: `${w}%` } : {}} transition={{ duration: 1.2, delay: 0.8 + i * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#1A56DB] to-[#3B82F6]" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono w-8">{w}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10 border border-blue-100/50 flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-blue-100">
              <Shield className="w-7 h-7 text-[#1A56DB]" />
            </div>
            <h3 className="font-bold text-[#111827] text-xl mb-3">AI Trust Score</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Our proprietary algorithm aggregates 12+ data signals including employment history, education verification, skill assessments, and behavioral analysis into a single, actionable reliability index.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Data Signals', val: '12+' },
                { label: 'Accuracy', val: '99.2%' },
                { label: 'Processing', val: '<2s' },
                { label: 'Coverage', val: 'Global' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 border border-blue-100/50">
                  <p className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider">{s.label}</p>
                  <p className="text-lg font-extrabold text-[#111827]">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
/* ============ INDUSTRY SECTORS ============ */
function SectorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const sectors = [
    { icon: Brain, label: 'AI & Machine Learning' },
    { icon: Cloud, label: 'DevOps & Cloud' },
    { icon: Palette, label: 'UI/UX Design' },
    { icon: Globe, label: 'Media & Crypto' },
  ];

  return (
    <section id="ai-hiring" className="py-24 md:py-32 bg-gradient-to-br from-[#1A56DB] to-[#1E40AF] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHeading light title="Hiring Intelligence for Every Sector" subtitle="From AI startups to enterprise cloud, PLACIFY adapts to your industry's unique talent requirements." />

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sectors.map((s, i) => (
            <motion.div key={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/15 hover:bg-white/20 transition-all duration-300 cursor-default group">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5 group-hover:bg-white/25 transition-colors">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">{s.label}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
          {[
            { label: 'Candidates Verified', val: '150K+' },
            { label: 'Enterprise Clients', val: '500+' },
            { label: 'Avg Hire Time', val: '14 days' },
            { label: 'Accuracy Rate', val: '94%' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.val}</p>
              <p className="text-blue-200 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
/* ============ PRICING ============ */
function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Startup',
      price: annual ? 399 : 499,
      desc: 'Perfect for small teams getting started with intelligent hiring.',
      features: ['10 Active Job Postings', '50 Verified Candidates/mo', 'AI Screening', 'Email Support', 'Basic Analytics'],
      cta: 'Start 14-Day Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: annual ? 1039 : 1299,
      desc: 'Scale your hiring with advanced tools and priority support.',
      features: ['50 Active Job Postings', 'Bulk Screening Unlocked', 'Priority Support & Analytics Toolkit', 'Custom Workflows', 'Team Collaboration'],
      cta: 'Get Started Now',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      desc: 'Tailored solutions for large organizations with complex needs.',
      features: ['Unlimited Job Postings', 'API Access', 'Custom Integrations', '24/7 STS Inspection', 'Dedicated Account Manager'],
      cta: 'Talk to Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <SectionHeading badge="Pricing" title="Transparent Intelligence Pricing" subtitle="Choose the plan that matches your hiring needs. All plans include core AI features." />

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-14">
          <div className="inline-flex items-center bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${!annual ? 'bg-[#1A56DB] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${annual ? 'bg-[#1A56DB] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>
              Annually <span className={annual ? 'text-green-200' : 'text-emerald-500'}>(Save 20%)</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -8, rotateX: 2, rotateY: i === 0 ? 2 : i === 2 ? -2 : 0 }}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                p.popular
                  ? 'bg-gradient-to-br from-[#1A56DB] to-[#1E40AF] text-white shadow-[0_20px_60px_rgba(26,86,219,0.3)] scale-[1.03] z-10'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg'
              }`}>
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-[10px] font-extrabold text-white uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className={`font-bold text-lg mb-2 ${p.popular ? 'text-white' : 'text-[#111827]'}`}>{p.name}</h3>
              <p className={`text-sm mb-5 ${p.popular ? 'text-blue-100' : 'text-[#6B7280]'}`}>{p.desc}</p>

              <div className="mb-6">
                {p.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${p.popular ? 'text-white' : 'text-[#111827]'}`}>${p.price.toLocaleString()}</span>
                    <span className={`text-sm ${p.popular ? 'text-blue-200' : 'text-[#6B7280]'}`}>/mo</span>
                  </div>
                ) : (
                  <span className={`text-4xl font-extrabold ${p.popular ? 'text-white' : 'text-[#111827]'}`}>Custom</span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${p.popular ? 'text-blue-200' : 'text-emerald-500'}`} />
                    <span className={`text-sm ${p.popular ? 'text-blue-50' : 'text-[#374151]'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                p.popular
                  ? 'bg-white text-[#1A56DB] hover:bg-blue-50 shadow-lg'
                  : 'bg-[#1A56DB] text-white hover:bg-[#1E40AF] shadow-[0_4px_16px_rgba(26,86,219,0.3)]'
              }`}>
                {p.cta} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ============ CTA / CONTACT ============ */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [formData, setFormData] = useState({ name: '', email: '', companySize: '', message: '' });

  return (
    <section id="contact" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/50 to-transparent rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideLeft} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-blue-50 text-[#1A56DB] border border-blue-100">Get Started</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-5">Upgrade Your Hiring Intelligence Today.</h2>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
              Stop wasting time with ATS failures. Join 500+ top-tier companies using PLACIFY to build their dream teams.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-[#374151]">Trusted by 500+ Enterprises Globally</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-[#374151]">ISO 4,100 &amp; SOC2 Compliant Platform</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { val: '500+', label: 'Companies' },
                { val: '150K+', label: 'Hires Made' },
                { val: '99.2%', label: 'Uptime' },
              ].map(s => (
                <div key={s.label} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xl font-extrabold text-[#1A56DB]">{s.val}</p>
                  <p className="text-xs font-medium text-[#6B7280] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideRight} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
              <h3 className="font-bold text-xl text-[#111827] mb-1">Book Your Intelligence Demo</h3>
              <p className="text-sm text-[#6B7280] mb-8">Send to us or book your 1:1 demo and get started</p>

              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Full Name</label>
                  <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Work Email</label>
                  <input type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Company Size</label>
                  <select value={formData.companySize} onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all appearance-none">
                    <option value="">Select company size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1,000 employees</option>
                    <option value="1000+">1,000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Message</label>
                  <textarea rows={4} placeholder="Tell us about your hiring needs..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all resize-none" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#1A56DB] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(26,86,219,0.35)] hover:bg-[#1E40AF] transition-colors">
                  Book My Intelligence Demo <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
/* ============ FOOTER ============ */
function Footer() {
  const columns = [
    { title: 'Product', links: ['Features', 'ATS', 'Verification', 'Passport', 'Trust Score'] },
    { title: 'Resources', links: ['Blog', 'Case Studies', 'Documentation', 'API Reference'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms', 'SOC2 Compliance', 'Data Processing'] },
  ];

  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#3B82F6] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#111827]">PLACIFY</span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-6 max-w-xs">
              Making hiring intelligent, fair, and verified for the modern workforce.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#6B7280] hover:text-[#1A56DB] hover:border-blue-200 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-[#111827] text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm text-[#6B7280] hover:text-[#1A56DB] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-bold text-[#111827] text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#6B7280]"><Mail className="w-3.5 h-3.5" />hello@placify.io</li>
              <li className="flex items-center gap-2 text-sm text-[#6B7280]"><Phone className="w-3.5 h-3.5" />+1 (415) 555-0142</li>
              <li className="flex items-center gap-2 text-sm text-[#6B7280]"><MapPin className="w-3.5 h-3.5" />San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">&copy; 2026 Placify Hiring Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A56DB] transition-colors">Privacy</a>
            <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A56DB] transition-colors">Terms</a>
            <a href="#" className="text-xs text-[#6B7280] hover:text-[#1A56DB] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============ PAGE ============ */
export default function LandingPage() {
  return (
    <main className="min-min-h-screen bg-white font-sans">
      <Header />
      <HeroSection />
      <EvolutionSection />
      <CapabilitiesSection />
      <SectorsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}