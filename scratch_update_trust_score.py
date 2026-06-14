content = """'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, CheckCircle2, AlertCircle, Loader2, Award, Zap, Lock, Eye, Briefcase, Code, Activity, UserCheck } from 'lucide-react';

export default function TrustScorePage() {
  const [cand, setCand] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrustData();
  }, []);

  const fetchTrustData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
      setCand(data);

      if (data?.id) {
          const { data: atsData } = await supabase.from('resume_intelligence_reports').select('ats_resume_score').eq('candidate_id', data.id).single();
          setAtsScore(atsData?.ats_resume_score || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  const calculateTrustBreakdown = () => {
    if (!cand) return { total: 0, profile: 0, resume: 0, verification: 0, skills: 0, experience: 0, activity: 0 };
    
    // 1. Profile Completion (25%)
    const pct = cand.profile_completion_pct || 0;
    const profile = Math.floor(pct * 0.25);

    // 2. Resume Intelligence (20%)
    const resume = Math.floor(atsScore * 0.20);

    // 3. Verification (20%)
    const hasMobile = !!cand.candidate_profiles?.[0]?.mobile_number;
    const hasVerificationBadge = cand.verification_badge;
    const verification = (hasMobile ? 10 : 0) + (hasVerificationBadge ? 10 : 0);

    // 4. Skills & Portfolio (15%)
    let skillsObj: any = [];
    try {
       if (typeof cand.skills === 'string') skillsObj = JSON.parse(cand.skills);
       else if (Array.isArray(cand.skills)) skillsObj = cand.skills;
    } catch (e) {}
    const hasSkills = skillsObj.length > 3;
    const hasPortfolio = !!cand.candidate_profiles?.[0]?.github_url || !!cand.candidate_profiles?.[0]?.portfolio_url;
    const skills = (hasSkills ? 10 : 0) + (hasPortfolio ? 5 : 0);

    // 5. Experience Consistency (10%)
    const hasExperience = cand.experience_years > 0 || pct > 50;
    const experience = hasExperience ? 10 : 0;

    // 6. Activity Score (10%)
    const isRecentlyActive = cand.last_active_at ? (new Date().getTime() - new Date(cand.last_active_at).getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
    const activity = isRecentlyActive ? 10 : 5; // Base 5 for existing users

    const total = Math.min(100, Math.max(0, profile + resume + verification + skills + experience + activity));
    
    return { total, profile, resume, verification, skills, experience, activity, hasMobile, hasVerificationBadge, hasSkills, hasPortfolio };
  };

  useEffect(() => {
    if (cand && !loading) {
      const breakdown = calculateTrustBreakdown();
      // Ensure we don't spam updates if unchanged
      const currentScore = cand.trust_score || 0;
      if (currentScore !== breakdown.total) {
        supabase.from('candidates').update({ 
           trust_score: breakdown.total,
           trust_score_breakdown: breakdown
        }).eq('id', cand.id).then();
      }
    }
  }, [cand, atsScore, loading]);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  const breakdown = calculateTrustBreakdown();
  const score = breakdown.total;
  
  let trustLevel = 'Weak';
  if (score >= 90) trustLevel = 'Excellent';
  else if (score >= 75) trustLevel = 'Strong';
  else if (score >= 60) trustLevel = 'Good';
  else if (score >= 40) trustLevel = 'Moderate';

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trust Score & Reliability</h1>
        <p className="text-gray-500 mt-1">A higher trust score pushes your application to the top of recruiter pipelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-xl shadow-slate-900/10">
          <Award size={48} className="text-yellow-400 mb-4" />
          <h2 className="text-6xl font-black mb-2">{score}<span className="text-2xl text-slate-400">/100</span></h2>
          <p className="text-slate-300 font-medium tracking-wide mb-6">GLOBAL TRUST SCORE</p>
          <div className={`px-6 py-2 rounded-full text-sm font-bold border ${score >= 75 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
            Level: {trustLevel}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><UserCheck size={24} /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Profile Completion (25%)</h3>
                 <span className="font-bold text-blue-600">+{breakdown.profile} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Based on {cand?.profile_completion_pct || 0}% overall completion.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><Zap size={24} /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Resume Intelligence (20%)</h3>
                 <span className="font-bold text-indigo-600">+{breakdown.resume} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">ATS match quality and parsing score ({atsScore}%).</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className="bg-green-100 p-3 rounded-full text-green-600"><Shield size={24} /></div>
            <div className="flex-1">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Identity & Verification (20%)</h3>
                 <span className="font-bold text-green-600">+{breakdown.verification} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {breakdown.hasMobile ? 'Mobile linked.' : 'Mobile missing.'} {breakdown.hasVerificationBadge ? 'Govt ID verified.' : 'Govt ID pending.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Code size={24} /></div>
            <div className="flex-1">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Skills & Portfolio (15%)</h3>
                 <span className="font-bold text-purple-600">+{breakdown.skills} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {breakdown.hasSkills ? 'Skills listed.' : 'Add more skills.'} {breakdown.hasPortfolio ? 'Portfolio linked.' : 'Portfolio link missing.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Briefcase size={24} /></div>
            <div className="flex-1">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Experience Consistency (10%)</h3>
                 <span className="font-bold text-orange-600">+{breakdown.experience} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Experience mapping from resume matches profile claims.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className="bg-cyan-100 p-3 rounded-full text-cyan-600"><Activity size={24} /></div>
            <div className="flex-1">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Platform Activity (10%)</h3>
                 <span className="font-bold text-cyan-600">+{breakdown.activity} pts</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Active platform engagement and recent logins.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"""
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated trust score logic")
