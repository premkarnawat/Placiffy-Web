'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, CheckCircle2, AlertCircle, Loader2, Award, Zap, Lock, Eye } from 'lucide-react';

export default function TrustScorePage() {
  const [cand, setCand] = useState<any>(null);
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  const score = cand?.trust_score || 0;
  
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
          <p className="text-slate-300 font-medium tracking-wide">GLOBAL TRUST SCORE</p>
          <div className="mt-8 px-6 py-2 bg-white/10 rounded-full text-sm font-bold text-white border border-white/20">
            {score >= 80 ? 'Top 10% Applicant' : 'Needs Verification'}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Identity Verification</h3>
              <p className="text-sm text-gray-500 mt-1">Your email and basic identity signals have been established.</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                +20 Points
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Shield size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Resume & ATS Consistency</h3>
              <p className="text-sm text-gray-500 mt-1">Your profile completion score directly feeds your trust ranking.</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                +{profilePoints} Points (from Profile)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
             <div className={`${hasMobile ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} p-3 rounded-full`}><CheckCircle2 size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Mobile Number Verification</h3>
              <p className="text-sm text-gray-500 mt-1">{hasMobile ? 'Your mobile number is linked and verified.' : 'Please link your mobile number in the Profile page.'}</p>
              <div className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full w-fit ${hasMobile ? 'text-purple-600 bg-purple-50' : 'text-gray-500 bg-gray-50'}`}>
                {hasMobile ? '+20 Points' : '0 / 20 Points'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 border-dashed shadow-sm flex items-start gap-4 opacity-75">
             <div className="bg-gray-100 p-3 rounded-full text-gray-400"><Lock size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Aadhar / Government ID (Pending)</h3>
              <p className="text-sm text-gray-500 mt-1">Verify your government ID to unlock the maximum trust tier.</p>
              <button className="mt-3 text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                Start Verification <Zap size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
