'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ChevronRight, ArrowRight, ShieldCheck, 
  Cpu, Building2, Layers, Briefcase, FileText, CheckCircle2 
} from 'lucide-react';

/* ============ COMPONENT: HEADER ============ */
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="PLACIFY" className="h-10 w-10 rounded-xl object-cover border border-slate-200/50" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">PLACIFY</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">Hiring OS</span>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Home</a>
          <a href="/services" className="text-[14px] font-semibold text-slate-900 transition-colors">Services</a>
          <a href="/#pricing" className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          <a href="/#about" className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">About</a>
          <a href="/contact" className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Login</a>
          <a href="/register" className="px-5 py-2.5 bg-[#0052CC] text-white text-[14px] font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium">Sign Up</a>
        </div>
      </div>
    </header>
  );
}

/* ============ COMPONENT: FOOTER ============ */
function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 text-center text-xs font-semibold text-slate-400">
        <p>&copy; {new Date().getFullYear()} PLACIFY. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function ServicesPage() {
  const services = [
    {
      id: 'hiring',
      title: 'Placify Hiring Service',
      badge: 'Assisted Sourcing',
      desc: 'A complete end-to-end recruitment solution where Placify partners directly with your company to find, evaluate, and onboard top engineering candidates.',
      color: 'from-blue-500 to-indigo-600',
      icon: Briefcase,
      steps: ['Job Creation', 'AI Matching', 'Shortlisting', 'Interview Coordination', 'Hiring'],
      link: '/services/hiring'
    },
    {
      id: 'self-hiring',
      title: 'Self Hiring Solution',
      badge: 'SaaS Platform',
      desc: 'Gain direct access to the Placify ATS and talent database. Perfect for companies who want to manage searches independently with powerful AI matching filters.',
      color: 'from-[#0052CC] to-cyan-500',
      icon: Cpu,
      steps: ['Create Job', 'AI JD Analysis', 'Candidate Sourcing & Filter', 'Shortlisting & Contact'],
      link: '/services/self-hiring'
    },
    {
      id: 'bulk-resume',
      title: 'Bulk Resume ATS Shortlisting',
      badge: 'Automated Screening',
      desc: 'Upload batches of hundreds of resumes from external job portals or databases, and let our semantic matching engine parse, skill-map, and rank candidates instantly.',
      color: 'from-emerald-500 to-teal-600',
      icon: FileText,
      steps: ['Upload Resumes', 'Resume Parsing', 'Skill Extraction', 'ATS Matching Score', 'Shortlisting'],
      link: '/services/bulk-resume'
    },
    {
      id: 'academic-projects',
      title: 'Academic Software Projects',
      badge: 'Student Services',
      desc: 'Custom structured software developments, final year guides, and training programs tailored for college students to build industry-relevant technical profiles.',
      color: 'from-purple-500 to-indigo-600',
      icon: Layers,
      steps: ['Domains: AI/ML, Web Dev, Cloud, Cyber Security, IoT, Data Science'],
      link: '/services/academic-projects'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Our Offerings
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Placify Service Verticals
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover how our range of AI-powered hiring platforms and fully-assisted recruitment services help scale engineering workspaces.
          </p>
        </div>

        {/* Catalog List */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((serv) => (
            <motion.div 
              key={serv.id}
              whileHover={{ y: -4 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm card-lift"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0052CC] shadow-sm">
                    <serv.icon size={22} />
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold">
                    {serv.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-950 mb-3">{serv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{serv.desc}</p>

                {/* Workflow Line */}
                <div className="mb-8">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Service Pipeline</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {serv.steps.map((step, sidx) => (
                      <div key={sidx} className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-slate-700 font-semibold shadow-sm">
                          {step}
                        </span>
                        {sidx < serv.steps.length - 1 && (
                          <ChevronRight size={14} className="text-slate-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <a 
                href={serv.link} 
                className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-sm font-bold rounded-xl shadow-sm text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore {serv.title}</span>
                <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
