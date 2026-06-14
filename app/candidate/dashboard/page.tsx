'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getBackendToken } from '@/lib/backend-auth';
import { Activity, ShieldCheck, Zap, Briefcase, MessageSquare, TrendingUp, ChevronRight, Lock,  } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
      
      const channel = supabase.channel(`dash_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchData())
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      // Execute all Supabase queries simultaneously using Promise.all for < 1s load time
      const [candRes, appCountRes, msgCountRes, interviewCountRes, offerCountRes] = await Promise.all([
        supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user?.id).single(),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id).in('status', ['shortlisted', 'interviewing']),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id).in('status', ['offered', 'hired'])
      ]);

      setData({ 
        cand: candRes.data, 
        appCount: appCountRes.count || 0,
        msgCount: msgCountRes.count || 0,
        interviewCount: interviewCountRes.count || 0,
        offerCount: offerCountRes.count || 0
      });
      
      // We removed the slow Render Python API call to ensure instant loads.
      setInsights([]);
    } catch (e) {
      console.error("Dashboard DB fetch error:", e);
    }
  };  if (!data) return <div className="p-8 text-center text-gray-500">Loading Dashboard Engine...</div>;

  const pct = data.cand?.profile_completion_pct || 0;
  

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {data.cand?.first_name || data.cand?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}</h1>
          <p className="text-gray-500 mt-1">Here is your Candidate Operating System overview.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Completion Widget */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
          <h3 className="font-bold text-gray-900 mb-4 self-start w-full">Profile Strength</h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="10" strokeDasharray={`${pct * 2.827} 282.7`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900">{pct}%</span>
            </div>
          </div>
          
          <button onClick={() => router.push('/candidate/profile/edit')} className="mt-6 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl w-full hover:bg-blue-100 transition-colors">
            {pct < 100 ? 'Complete Profile' : 'Edit Profile'}
          </button>
        </div>

        {/* ATS & Trust Scores */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Placify Insights</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-500 font-medium flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Avg ATS Match</span><span className="font-bold">{data.passport?.ats_score || 0}%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-amber-500 h-2.5 rounded-full" style={{width: `${data.passport?.ats_score || 0}%`}}></div></div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-500 font-medium flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Trust Score</span><span className="font-bold">{data.passport?.trust_score || 0} / {data.passport?.recommendation || 'Pending'}</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="h-2.5 rounded-full bg-green-500" style={{width: `${data.passport?.trust_score || 0}%`}}></div></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">Scores determine your ranking to employers.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow" onClick={()=>router.push('/candidate/applications')}>
            <Briefcase size={24} className="text-blue-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">{data.appCount}</span>
            <span className="text-sm font-medium text-gray-600">Applications</span>
          </div>
          <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow" onClick={()=>router.push('/candidate/messages')}>
            <MessageSquare size={24} className="text-purple-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">{data.msgCount || 0}</span>
            <span className="text-sm font-medium text-gray-600">Messages</span>
          </div>
          <div className="bg-green-50 rounded-3xl p-5 border border-green-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">{data.interviewCount || 0}</span>
            <span className="text-sm font-medium text-gray-600">Interviews</span>
          </div>
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow">
            <Activity size={24} className="text-amber-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">{data.offerCount || 0}</span>
            <span className="text-sm font-medium text-gray-600">Offers</span>
          </div>
        </div>

      </div>

      {/* ATS Resume & Verification CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden lg:col-span-2">
          <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-white opacity-10" />
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3"><Lock className="text-blue-400" /> Unlock Premium Status</h2>
          <p className="text-blue-100 mb-6">You are currently unverified. Complete the Verification Journey to get your Candidate Passport and double your ATS ranking.</p>
          <button onClick={() => router.push('/candidate/verification')} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2">
            Start Verification <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group" onClick={() => router.push('/candidate/resume-intelligence')}>
          <Sparkles className="absolute -top-4 -right-4 text-blue-50 opacity-50 group-hover:opacity-100 transition-opacity" size={100}/>
          <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">ATS Resume Score</h3>
          <div className="text-5xl font-black text-slate-900 mb-2 relative z-10">{atsScore !== null ? atsScore : '--'}</div>
          <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">{atsScore !== null ? 'Out of 100' : 'Not analyzed yet'}</p>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full relative z-10 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            View Full Report <ChevronRight size={14}/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
        {/* Removing duplicate verification banner */}
          <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-white opacity-10" />
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3"><Lock className="text-blue-400" /> Unlock Premium Status</h2>
          <p className="text-blue-100 mb-6">You are currently unverified. Complete the Verification Journey to get your Candidate Passport and double your ATS ranking.</p>
          <button onClick={() => router.push('/candidate/verification')} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2">
            Start Verification <ChevronRight size={18} />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={20} className="text-amber-500"/> AI Actionable Insights</h2>
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="p-4 rounded-2xl bg-gray-50 text-gray-500 text-center text-sm border border-gray-100">Generating personalized insights...</div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className={`flex gap-4 p-4 rounded-2xl border bg-${insight.color || 'blue'}-50/50 border-${insight.color || 'blue'}-100`}>
                  <div className={`w-10 h-10 rounded-full bg-${insight.color || 'blue'}-100 text-${insight.color || 'blue'}-600 flex items-center justify-center shrink-0 font-bold`}>{idx + 1}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
