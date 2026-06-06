"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, ArrowRight, Upload, Play, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';

export default function Home() {
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

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
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />

      <header className="border-b border-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">PLACIFY</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4.5 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center flex-1 w-full z-10">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">The Verification Era is Here</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.08] tracking-tighter">
            Verified Talent. <br />
            <span className="text-gradient-orange">Faster Hiring.</span> <br />
            Reduced Risk.
          </h1>

          <p className="text-slate-400 text-md md:text-lg font-normal leading-relaxed max-w-xl">
            Placify is a Verified Hiring Intelligence platform that eliminates resume fraud and interviewing dropouts. We analyze, challenge, and score candidates prior to introduction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl text-base shadow-xl shadow-orange-500/10 transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#demo"
              className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-xl text-base transition-all"
            >
              <Play className="w-4 h-4 fill-slate-300" /> Watch Demo
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 max-w-lg">
            <div>
              <div className="text-2xl font-black text-white">85%</div>
              <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Hiring Time Saved</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">0%</div>
              <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Candidate Fraud</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Verified Passports</div>
            </div>
          </div>
        </div>

        <div id="demo" className="lg:col-span-5 w-full">
          <GlassCard className="border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden group" glow>
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-600/5 rounded-full blur-[80px]" />
            
            <h3 className="text-lg font-bold text-slate-200 mb-2">Instant Screening Portal</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed text-left">
              Upload a candidate's resume to experience our AI resume parsing and trust score pipeline.
            </p>

            <div className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 bg-slate-950/60 transition-all rounded-xl p-8 text-center cursor-pointer relative overflow-hidden group">
              <input 
                type="file" 
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-all">
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
              <div className="mt-6 border border-slate-800/60 bg-slate-950/40 p-4 rounded-xl space-y-3 text-left">
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
              <div className="mt-6 border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl space-y-4 text-left">
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
      </main>

      <footer className="border-t border-slate-900/60 bg-slate-950/85 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">PLACIFY</span>
          </div>
          <p className="text-xs text-slate-655">&copy; 2026 Placify Technologies Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
