'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, BrainCircuit, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, Star, FileText, Code2, Briefcase, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeIntelligencePage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cand } = await supabase.from('candidates').select('id').eq('user_id', user.id).single();
      if (!cand) return;
      const { data } = await supabase.from('resume_intelligence_reports').select('*').eq('candidate_id', cand.id).single();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Resume Intelligence Engine</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8">Upload your resume in the Profile Editor to trigger our deep AI analysis. We will break down your structure, writing quality, and ATS compatibility.</p>
        <a href="/candidate/profile/edit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
          Upload Resume Now
        </a>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'from-emerald-500 to-emerald-400 text-emerald-900';
    if (grade.includes('B')) return 'from-blue-500 to-blue-400 text-blue-900';
    if (grade.includes('C')) return 'from-amber-500 to-amber-400 text-amber-900';
    return 'from-red-500 to-red-400 text-red-900';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BrainCircuit size={24} /></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resume Intelligence</h1>
          </div>
          <p className="text-slate-500 font-medium">Deep algorithmic analysis of your resume's structure, impact, and ATS readability.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">OVERALL SCORE</div>
            <div className={`text-4xl font-black ${report.overall_score >= 85 ? 'text-emerald-500' : report.overall_score >= 65 ? 'text-blue-500' : 'text-amber-500'}`}>
              {report.overall_score}<span className="text-lg text-slate-400">/100</span>
            </div>
          </div>
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradeColor(report.grade)} flex items-center justify-center shadow-lg transform rotate-3`}>
            <span className="text-4xl font-black text-white">{report.grade}</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><HelpCircle className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.ats_compatibility_score)}`}>{report.ats_compatibility_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">ATS Compatibility</h3>
          <p className="text-sm text-slate-500 mt-1">Machine readability and standard section parsing reliability.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><FileText className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.writing_score)}`}>{report.writing_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Writing Quality</h3>
          <p className="text-sm text-slate-500 mt-1">Professional tone, grammar, action verbs, and lack of fluff.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><TrendingUp className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.achievement_score)}`}>{report.achievement_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Achievement Impact</h3>
          <p className="text-sm text-slate-500 mt-1">Usage of metrics, numbers, and verifiable business impact.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><Code2 className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.skill_score)}`}>{report.skill_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Skill Coverage</h3>
          <p className="text-sm text-slate-500 mt-1">Relevance and depth of technical/hard skills vs industry standards.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><Briefcase className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.project_score)}`}>{report.project_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Project Strength</h3>
          <p className="text-sm text-slate-500 mt-1">Complexity, tech stack details, and live URLs in project descriptions.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><BookOpen className="text-slate-600" size={24} /></div>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(report.structure_score)}`}>{report.structure_score}/100</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">Resume Structure</h3>
          <p className="text-sm text-slate-500 mt-1">Logical ordering of summary, experience, skills, and education.</p>
        </motion.div>

      </div>

      {/* Improvement Engine Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Strengths */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Star className="text-yellow-500" /> Top Strengths</h2>
          <ul className="space-y-4">
            {report.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-700">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Improvements */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-blue-500">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Zap className="text-blue-500" /> Improvement Opportunities</h2>
          <ul className="space-y-4">
            {report.recommendations?.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
             <a href="/candidate/profile/edit" className="inline-block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-bold transition-colors">
               Fix Resume & Re-Analyze
             </a>
          </div>
        </div>
      </div>

    </div>
  );
}
