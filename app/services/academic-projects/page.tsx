'use client';

import { ArrowLeft, Layers } from 'lucide-react';

export default function AcademicProjectsPage() {
  const domains = [
    { name: 'Artificial Intelligence & Machine Learning', desc: 'Build and deploy deep learning models, computer vision systems, or NLP chat agents.' },
    { name: 'Web Development', desc: 'High-performance React/Next.js and node full-stack platforms with modern architectures.' },
    { name: 'Cloud Computing & DevOps', desc: 'AWS/GCP automation infrastructure pipelines, docker containers, and serverless builds.' },
    { name: 'Data Science & Big Data', desc: 'Exploratory data analysis pipelines, predictive algorithms, and statistical dashboards.' },
    { name: 'Cyber Security', desc: 'Cryptographical projects, network intrusion detection systems, or vulnerability scanners.' },
    { name: 'Internet of Things (IoT)', desc: 'Sensor networking systems, smart home controllers, and real-time telemetry hubs.' },
    { name: 'Software Engineering & Desktop Apps', desc: 'Enterprise architecture projects, secure database programs, and design pattern builds.' }
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
          <Layers size={14} />
          <span>Student Services</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Academic Software Projects
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">
          We design and build custom software projects for final-year college students. Our programs help students learn production-grade development standards, Git workflows, and deployment best practices to make their technical profiles highly competitive.
        </p>

        {/* Project Domains Grid */}
        <h3 className="text-xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-3">Supported Technical Domains</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {domains.map((dom, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                <span>{dom.name}</span>
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">{dom.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">Get project guidance today</h4>
            <p className="text-slate-500 text-xs font-medium">Contact our office in Pune for domains curriculum and custom builds.</p>
          </div>
          <a href="/contact" className="px-6 py-3.5 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium">
            Contact Us
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
