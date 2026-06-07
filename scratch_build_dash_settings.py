# -*- coding: utf-8 -*-
import os

# 1. Dashboard
content_dash = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Activity, ShieldCheck, Zap, Briefcase, MessageSquare, TrendingUp, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', user?.id);
      setData({ cand, appCount: appCount || 0 });
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <div className="p-8 text-center text-gray-500">Loading Dashboard Engine...</div>;

  const pct = data.cand.profile_completion_pct || 0;
  const isVerified = data.cand.verification_status === 'verified';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.email?.split('@')[0]}</h1>
          <p className="text-gray-500 mt-1">Here is your Candidate Operating System overview.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
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
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-500 font-medium flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Avg ATS Match</span><span className="font-bold">85%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-amber-500 h-2.5 rounded-full" style={{width: '85%'}}></div></div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-500 font-medium flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Trust Score</span><span className="font-bold">{isVerified ? '100 / RA+' : '45 / Pending'}</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-300'}`} style={{width: isVerified ? '100%' : '45%'}}></div></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">Scores determine your ranking to employers.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow" onClick={()=>router.push('/candidate/applications')}>
            <Briefcase size={24} className="text-blue-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">{data.appCount}</span>
            <span className="text-sm font-medium text-gray-600">Applications</span>
          </div>
          <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow" onClick={()=>router.push('/candidate/messages')}>
            <MessageSquare size={24} className="text-purple-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">3</span>
            <span className="text-sm font-medium text-gray-600">Messages</span>
          </div>
          <div className="bg-green-50 rounded-3xl p-5 border border-green-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">0</span>
            <span className="text-sm font-medium text-gray-600">Interviews</span>
          </div>
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow">
            <Activity size={24} className="text-amber-600 mb-2" />
            <span className="text-3xl font-extrabold text-gray-900">0</span>
            <span className="text-sm font-medium text-gray-600">Offers</span>
          </div>
        </div>

      </div>

      {/* AI Insights & Verification CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
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
            <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Missing "AWS" Skill</h4>
                <p className="text-xs text-gray-600 mt-1">Adding AWS to your skills would increase your match rate for 14 active jobs.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Portfolio Links Missing</h4>
                <p className="text-xs text-gray-600 mt-1">Candidates with active GitHub links get 3x more company messages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""
with open(r"app\candidate\dashboard\page.tsx", "w", encoding="utf-8") as f: f.write(content_dash)

# 2. Settings
content_settings = """'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Bell, Database, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<any>({
    data_processing_consent: true, resume_parsing_consent: true, verification_consent: false,
    ai_analysis_consent: false, passport_consent: false, communication_consent: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('candidate_consents').select('*').eq('candidate_id', user.id).single().then(({data}) => {
        if (data) setConsents(data);
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: check } = await supabase.from('candidate_consents').select('id').eq('candidate_id', user?.id);
      if (check && check.length > 0) {
        await supabase.from('candidate_consents').update(consents).eq('candidate_id', user?.id);
      } else {
        await supabase.from('candidate_consents').insert({ ...consents, candidate_id: user?.id });
      }
      toast('success', 'Preferences Saved', 'Consent preferences updated securely.');
    } catch (e:any) {
      toast('error', 'Error', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ label, desc, checked, onChange }: any) => (
    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-2xl mb-3 bg-gray-50/50">
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 mt-1">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Settings className="text-blue-600"/> Settings & Consents</h1>
        <p className="text-gray-500 mt-1">Manage your privacy, security, and data usage preferences.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Database className="text-blue-500"/>
          <h2 className="text-xl font-bold text-gray-900">Data Governance & AI Consent</h2>
        </div>

        <div className="space-y-4">
          <Toggle 
            label="Resume AI Parsing" 
            desc="Allow Placify Llama-3 AI models to parse your uploaded resume to build your profile." 
            checked={consents.resume_parsing_consent} 
            onChange={(v:boolean) => setConsents({...consents, resume_parsing_consent: v})} 
          />
          <Toggle 
            label="AI Vector Matching (ATS)" 
            desc="Allow generating a pgvector embedding of your profile for automated job matching." 
            checked={consents.ai_analysis_consent} 
            onChange={(v:boolean) => setConsents({...consents, ai_analysis_consent: v})} 
          />
          <Toggle 
            label="Background Verification" 
            desc="Authorize Placify's expert team to verify your education and employment history." 
            checked={consents.verification_consent} 
            onChange={(v:boolean) => setConsents({...consents, verification_consent: v})} 
          />
          <Toggle 
            label="Candidate Passport Generation" 
            desc="Enable creation of a secure, shareable PDF Passport of your verified credentials." 
            checked={consents.passport_consent} 
            onChange={(v:boolean) => setConsents({...consents, passport_consent: v})} 
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-sm">
            {isSaving ? 'Saving...' : <><Save size={18}/> Save Preferences</>}
          </button>
        </div>
      </div>
    </div>
  );
}
"""
with open(r"app\candidate\settings\page.tsx", "w", encoding="utf-8") as f: f.write(content_settings)

print("Injected Dashboard and Settings pages!")
