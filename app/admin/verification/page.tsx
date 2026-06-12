"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerificationAdmin() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      // Simulating a verification queue by finding candidates with profile completion but trust score < 50
      const { data, error } = await supabase.from('candidates').select('id, full_name, trust_score, profile_completion_pct').gte('profile_completion_pct', 50).lt('trust_score', 80).order('created_at', { ascending: false });
      if (error) throw error;
      setCandidates(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verification Queue</h1>
          <p className="text-slate-500 font-medium">Review and approve pending candidate and company verifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <h3 className="font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="text-blue-500"/> Pending Candidate Verifications</h3>
           {loading ? (
             <div className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></div>
           ) : candidates.length === 0 ? (
             <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-slate-500 font-medium shadow-sm">No pending verifications.</div>
           ) : (
             candidates.map(c => (
               <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><Clock size={24}/></div>
                   <div>
                     <h4 className="font-bold text-slate-900">{c.full_name}</h4>
                     <p className="text-xs font-medium text-slate-500 mt-1">Completion: {c.profile_completion_pct}% | Current Trust: {c.trust_score}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 rounded-xl transition-colors"><CheckCircle2 size={20}/></button>
                   <button className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-xl transition-colors"><XCircle size={20}/></button>
                 </div>
               </div>
             ))
           )}
        </div>
        
        <div className="space-y-4">
           <h3 className="font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="text-purple-500"/> Pending Company Verifications</h3>
           <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-slate-500 font-medium shadow-sm">No companies pending verification.</div>
        </div>
      </div>
    </div>
  );
}
