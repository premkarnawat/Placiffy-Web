'use client';

import { ArrowLeft, Cpu } from 'lucide-react';

export default function SelfHiringPage() {
  const steps = [
    { title: 'Create Job', desc: 'Define roles, required skills, and expected budget parameters in your workspace.' },
    { title: 'AI Analysis', desc: 'Our platform automatically maps semantic keywords and builds role vectors.' },
    { title: 'Candidate Search', desc: 'Run database queries against pre-verified candidate passports.' },
    { title: 'Shortlisting', desc: 'Instantly save and invite top-ranked applicants into your workspace pipeline.' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="PLACIFY" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">PLACIFY</span>
          </a>
          <a href="/services" className="text-sm font-bold text-[#0052CC] hover:underline flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Services</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full mb-6">
          <Cpu size={14} />
          <span>SaaS Platform</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Self Hiring Solution
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">
          Leverage the Placify ATS workspace autonomously. Source from pre-verified candidate profiles, perform semantic keyword searches, and manage applicant funnels independently.
        </p>

        {/* Workflow steps vertical list */}
        <h3 className="text-xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-3">ATS Sourcing Workflow</h3>
        
        <div className="space-y-6 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 items-start bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0052CC] font-bold flex items-center justify-center border border-blue-100 flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">Create your workspace today</h4>
            <p className="text-slate-500 text-xs font-medium">Instantly source candidates using modern semantic filters.</p>
          </div>
          <a href="/register" className="px-6 py-3.5 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium">
            Get Started
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/60 py-10 text-center text-xs font-semibold text-slate-400">
        <p>&copy; {new Date().getFullYear()} PLACIFY. All rights reserved.</p>
      </footer>
    </div>
  );
}
