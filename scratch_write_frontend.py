import os

os.makedirs(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\resume-intelligence", exist_ok=True)

content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Award, RefreshCw, AlertCircle, CheckCircle2, TrendingUp, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ResumeIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cand } = await supabase.from('candidates').select('id, resume_parsed_at, resume_url').eq('user_id', user.id).single();
      if (!cand) return;
      
      setCandidateId(cand.id);

      const res = await fetch(`/api/candidate/resume-intelligence?candidate_id=${cand.id}`);
      const data = await res.json();
      
      if (data.report) {
        setReport(data.report);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!candidateId) return;
    setAnalyzing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/candidate/resume-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setReport(data.report);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><RefreshCw className="animate-spin text-blue-600" size={32}/></div>;
  }

  const getStrengthLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 80) return { label: 'Strong', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 70) return { label: 'Good', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    if (score >= 60) return { label: 'Needs Improvement', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  if (!report && !analyzing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-blue-600" size={40}/>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">ATS Resume Intelligence</h1>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto text-lg">
            Get a deep, 100-point AI analysis of your resume quality, structural ATS compatibility, and actionable improvement suggestions.
          </p>
          {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{errorMsg}</div>}
          <button onClick={handleAnalyze} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mx-auto text-lg">
            <Zap size={20}/> Analyze My Resume Now
          </button>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin text-blue-600 mb-6" size={48}/>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Resume Data...</h2>
          <p className="text-slate-500">Evaluating structure, keywords, and achievements via Groq AI.</p>
        </div>
      </div>
    );
  }

  const strength = getStrengthLevel(report.ats_resume_score);
  
  const radarData = [
    { subject: 'Structure', A: report.structure_score, fullMark: 100 },
    { subject: 'Skills', A: report.skills_score, fullMark: 100 },
    { subject: 'Experience', A: report.experience_score, fullMark: 100 },
    { subject: 'Education', A: report.education_score, fullMark: 100 },
    { subject: 'Keywords', A: report.keyword_score, fullMark: 100 },
    { subject: 'ATS Ready', A: report.ats_compatibility_score, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="text-blue-600"/> ATS Intelligence Report
          </h1>
          <p className="text-slate-500 font-medium">Last analyzed: {new Date(report.last_analyzed_at).toLocaleDateString()}</p>
        </div>
        <button onClick={handleAnalyze} className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold rounded-xl transition-all flex items-center gap-2">
          <RefreshCw size={18}/> Reanalyze
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-slate-500 font-bold mb-4 uppercase tracking-wider text-sm">Overall ATS Score</div>
          <div className="relative mb-4">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * report.ats_resume_score) / 100} className={strength.color.replace('text-', 'text-')} strokeLinecap="round" />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-slate-900">
              {report.ats_resume_score}
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${strength.bg} ${strength.color} ${strength.border}`}>
            {strength.label} Profile
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> Quality Breakdown</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip wrapperStyle={{ outline: 'none' }} cursor={{ fill: 'transparent' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Improvement Suggestions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><AlertCircle size={18} className="text-amber-500"/> Actionable Suggestions</h3>
          <ul className="space-y-4">
            {(report.improvement_suggestions || []).length > 0 ? report.improvement_suggestions.map((s: string, i: number) => (
              <li key={i} className="flex gap-3 items-start bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5"/>
                <span className="text-sm font-medium text-slate-700">{s}</span>
              </li>
            )) : (
              <li className="text-sm text-slate-500 p-4 bg-slate-50 rounded-2xl">No critical improvements needed! Great job.</li>
            )}
          </ul>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500"/> Keyword Intelligence</h3>
          
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Strengths Found</h4>
            <div className="flex flex-wrap gap-2">
              {(report.strength_keywords || []).map((k: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Missing Critical Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {(report.missing_keywords || []).length > 0 ? report.missing_keywords.map((k: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                  {k}
                </span>
              )) : (
                <span className="text-sm text-slate-500">None detected!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\resume-intelligence\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Frontend page saved")
