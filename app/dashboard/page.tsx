"use client";

import React, { useState } from 'react';
import { Shield, Sparkles, User, Briefcase, FileText, CheckCircle, Award, RefreshCw, Upload, Cpu, BarChart2, MessageSquare, Key, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import KanbanBoard from '@/components/dashboard/kanban-board';
import PassportShowcase from '@/components/passport/passport-showcase';
import AiAssistant from '@/components/dashboard/ai-assistant';
import Analytics from '@/components/dashboard/analytics';
import DiscussionBoard from '@/components/community/discussion-board';

type Section = 'workspace' | 'assistant' | 'analytics' | 'community' | 'expert' | 'settings';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('workspace');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // JD Analyzer States
  const [jdFile, setJdFile] = useState<string | null>(null);
  const [analyzingJd, setAnalyzingJd] = useState(false);
  const [jdAnalysisResult, setJdAnalysisResult] = useState<any>(null);

  // Bulk parser states
  const [bulkUploaded, setBulkUploaded] = useState(false);

  // API Key States
  const [apiKeys, setApiKeys] = useState<any[]>([
    { name: "Stripe Key", key: "plc_live_8792hjs82js01", created_at: "06-06-2026", status: "active" }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  const handleJdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJdFile(e.target.files[0].name);
      setAnalyzingJd(true);
      setTimeout(() => {
        setAnalyzingJd(false);
        setJdAnalysisResult({
          role: "Senior React Developer",
          experience: "5+ Years",
          must_have: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
          nice_to_have: ["FastAPI", "PostgreSQL", "Supabase"],
          screening_criteria: "Evaluate candidate on clean coding standards, repository setup activity, and architectural consistency."
        });
      }, 2000);
    }
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const key = {
      name: newKeyName,
      key: `plc_live_${Math.floor(1000 + Math.random() * 9000)}hjs${Math.floor(1000 + Math.random() * 9000)}js01`,
      created_at: "06-06-2026",
      status: "active"
    };
    setApiKeys(prev => [...prev, key]);
    setNewKeyName('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar - Stripe/Linear Style */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8 text-left">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">PLACIFY</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveSection('workspace'); setSelectedCandidate(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'workspace' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> Workspace Folder
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => setActiveSection('assistant')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'assistant' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" /> AI Recruiter chat
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'analytics' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4" /> Analytics & Reports
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => setActiveSection('community')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'community' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" /> Community Hub
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => { setActiveSection('expert'); setSelectedCandidate(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'expert' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <Award className="w-4 h-4" /> Expert Evaluation
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'settings' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/15' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              <span className="flex items-center gap-2.5">
                <Key className="w-4 h-4" /> Developer API Settings
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>
        </div>
        
        {/* User Account bottom widget */}
        <div className="p-6 border-t border-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">R</div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-300">Recruiter Account</div>
            <div className="text-[10px] text-slate-500">Stripe Enterprise</div>
          </div>
        </div>
      </aside>

      {/* Main Workspace content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header switcher */}
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40 md:hidden p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">PLACIFY</span>
          </div>
          {/* Simple selector */}
          <select 
            value={activeSection} 
            onChange={(e) => setActiveSection(e.target.value as Section)}
            className="bg-slate-900 border border-slate-800 text-xs rounded-xl p-2 outline-none text-slate-350"
          >
            <option value="workspace">Workspace</option>
            <option value="assistant">AI Recruiter</option>
            <option value="analytics">Analytics</option>
            <option value="community">Community</option>
            <option value="expert">Expert Center</option>
            <option value="settings">API Keys</option>
          </select>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8 z-10">
          
          {/* WORKSPACE PANEL (Phases 1-1.5) */}
          {activeSection === 'workspace' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Active Jobs</span>
                    <div className="text-2xl font-black text-white mt-1">3</div>
                    <span className="text-[10px] text-emerald-400">All matching verified pools</span>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Applicants</span>
                    <div className="text-2xl font-black text-white mt-1">48</div>
                    <span className="text-[10px] text-orange-400">32 parsed via Bulk SaaS</span>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Verified Candidates</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">12</div>
                    <span className="text-[10px] text-slate-400">Average trust score: 91%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Hiring Success Fee</span>
                    <div className="text-2xl font-black text-white mt-1">5%–10%</div>
                    <span className="text-[10px] text-slate-400">CTC success based fee</span>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-450 border border-orange-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard glow className="text-left">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" /> AI JD Analyzer
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Upload a Job Description (JD). Our AI extracts skills and creates an active tracking folder with semantic search matching.
                  </p>

                  <div className="flex gap-4">
                    <div className="border border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-950/60 transition-all rounded-xl p-6 text-center cursor-pointer relative overflow-hidden group flex-1">
                      <input 
                        type="file" 
                        accept=".txt,.pdf" 
                        onChange={handleJdUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-300">
                          {jdFile || "Upload JD TXT/PDF"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Extracts must-have skills & matching weights
                        </div>
                      </div>
                    </div>
                  </div>

                  {analyzingJd && (
                    <div className="mt-4 border border-slate-800 bg-slate-950/40 p-4 rounded-xl text-xs text-slate-500 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-orange-400" /> Analyzing skills and building scoring rules...
                    </div>
                  )}

                  {jdAnalysisResult && (
                    <div className="mt-4 border border-orange-500/10 bg-orange-500/5 p-4 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-300">Extracted Role: {jdAnalysisResult.role}</span>
                        <span className="text-slate-500">Exp: {jdAnalysisResult.experience}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block mb-1">Must Have Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {jdAnalysisResult.must_have.map((s: string) => (
                            <span key={s} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block mb-1">Nice to Have:</span>
                        <div className="flex flex-wrap gap-1">
                          {jdAnalysisResult.nice_to_have.map((s: string) => (
                            <span key={s} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-950 p-2 rounded text-slate-500 leading-relaxed">
                        <strong>Scoring weights:</strong> {jdAnalysisResult.screening_criteria}
                      </div>
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="text-left">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-orange-400" /> Bulk Resume Screening SaaS
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Upload candidate database CSV, zip folder of resumes, or import from your current ATS to rank candidate profiles.
                  </p>

                  <div className="space-y-4">
                    <div className="border border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-950/60 transition-all rounded-xl p-6 text-center cursor-pointer relative overflow-hidden group">
                      <button 
                        onClick={() => setBulkUploaded(true)}
                        className="text-xs font-bold text-slate-300"
                      >
                        {bulkUploaded ? "Successfully imported candidates!" : "Click to select CSV / Resume ZIP"}
                      </button>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Processes and ranks applicants against active folders
                      </div>
                    </div>

                    {bulkUploaded && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> 32 candidates processed
                          </div>
                          <div className="text-slate-500 mt-1">Parser generated match profiles & ATS scores</div>
                        </div>
                        <button className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors">
                          View List
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>

              {selectedCandidate ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedCandidate(null)}
                      className="text-xs text-slate-500 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
                    >
                      ← Back to Job Folder
                    </button>
                  </div>
                  <PassportShowcase data={
                    selectedCandidate.id === "c1" ? {
                      candidate_id: "PLC-C1-872",
                      name: "Sarah Jenkins",
                      role: "Senior React Developer",
                      trust_score: 95,
                      ats_score: 94,
                      portfolio_score: 92,
                      work_sample_score: 96,
                      expert_score: 94,
                      reliability_score: 100,
                      communication_score: 95,
                      fraud_risk: "LOW",
                      joining_probability: 98,
                      recommendation: "EXCELLENT CANDIDATE: Demonstrates high proficiency in code architecture, fully clean security history, and outstanding communications ratings during expert assessment."
                    } : selectedCandidate.id === "c2" ? {
                      candidate_id: "PLC-C2-332",
                      name: "David Chen",
                      role: "Frontend Architect",
                      trust_score: 87,
                      ats_score: 88,
                      portfolio_score: 85,
                      work_sample_score: 89,
                      expert_score: 88,
                      reliability_score: 90,
                      communication_score: 85,
                      fraud_risk: "LOW",
                      joining_probability: 88,
                      recommendation: "STRONG HIRE: Solid technical capabilities. Verified portfolios demonstrate consistent open source contributions."
                    } : selectedCandidate.id === "c3" ? {
                      candidate_id: "PLC-C3-112",
                      name: "Elena Rostova",
                      role: "React Native Dev",
                      trust_score: 91,
                      ats_score: 82,
                      portfolio_score: 90,
                      work_sample_score: 92,
                      expert_score: 91,
                      reliability_score: 100,
                      communication_score: 90,
                      fraud_risk: "LOW",
                      joining_probability: 95,
                      recommendation: "RECOMMENDED: Strong architectural consistency. Work samples exhibit meticulous testing methodologies."
                    } : {
                      candidate_id: `PLC-${selectedCandidate.id.toUpperCase()}-990`,
                      name: selectedCandidate.name,
                      role: selectedCandidate.role,
                      trust_score: selectedCandidate.trust_score || 86,
                      ats_score: selectedCandidate.ats_score,
                      portfolio_score: 80,
                      work_sample_score: 85,
                      expert_score: 80,
                      reliability_score: 90,
                      communication_score: 85,
                      fraud_risk: selectedCandidate.fraud_risk,
                      joining_probability: 90,
                      recommendation: "AI RECOMMENDATION: Suitable match based on general profiles. Pending expert review grading scorecard."
                    }
                  } />
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-450 uppercase tracking-widest px-1 text-left">WORKSPACE PIPELINE</h3>
                  <KanbanBoard onSelectCandidate={(c) => setSelectedCandidate(c)} />
                </div>
              )}
            </div>
          )}

          {/* AI ASSISTANT PANEL (Phase 4) */}
          {activeSection === 'assistant' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white text-left">Recruiter AI Chat Assistant</h2>
              <AiAssistant />
            </div>
          )}

          {/* ANALYTICS PANEL (Phases 4-5) */}
          {activeSection === 'analytics' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white text-left">Analytics and Pipeline Telemetry</h2>
              <Analytics />
            </div>
          )}

          {/* COMMUNITY PANEL (Phase 3) */}
          {activeSection === 'community' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white text-left">Community Boards & Top Verifiers</h2>
              <DiscussionBoard />
            </div>
          )}

          {/* EXPERT PANEL (Phase 3) */}
          {activeSection === 'expert' && (
            <div className="max-w-4xl mx-auto space-y-8 text-left">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Expert Evaluation Center</h2>
                    <p className="text-xs text-slate-500">Domain: Frontend (React & Next.js) • Verified Evaluator</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">
                    Approved Tasks: 14
                  </span>
                  <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg">
                    Earned: $720.00
                  </span>
                </div>
              </div>

              <GlassCard>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Available Tasks to Evaluate</h3>
                <div className="space-y-4">
                  <div className="border border-slate-900 bg-slate-950/40 hover:border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">Sarah Jenkins — React Challenge</span>
                        <span className="text-[9px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold px-1.5 py-0.5 rounded">
                          High Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Build responsive e-commerce checkout page with states. Includes tests.</p>
                      <div className="flex gap-4 mt-2 text-[10px] text-slate-600">
                        <span>Received: 3 hrs ago</span>
                        <span>Rubric payout: $50</span>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                      Review Code & Rubric
                    </button>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/40 hover:border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all opacity-60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">Liam O'Connor — Next.js Challenge</span>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                          Standard
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Build custom cache handler logic for dynamic product pages.</p>
                      <div className="flex gap-4 mt-2 text-[10px] text-slate-600">
                        <span>Received: 1 day ago</span>
                        <span>Rubric payout: $50</span>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-400 px-4 py-2 rounded-lg text-xs cursor-not-allowed">
                      Under Review
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* DEVELOPER SETTINGS & API KEYS (Phase 5) */}
          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 text-left">
              <GlassCard glow>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Key className="w-4.5 h-4.5 text-orange-400" /> API Marketplace Keys
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Generate secure client API keys to interface your custom applications, CRMs, and ATS systems directly with the Placify Verification Network.
                </p>

                <form onSubmit={handleCreateKey} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="API Key Descriptor (e.g. Workday ATS)"
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors">
                    Generate Key
                  </button>
                </form>

                <div className="border border-slate-900 bg-slate-950/20 rounded-xl divide-y divide-slate-900 text-xs">
                  {apiKeys.map((key, i) => (
                    <div key={i} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="font-bold text-slate-300">{key.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1 select-all">{key.key}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-500">Created: {key.created_at}</span>
                        <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {key.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
