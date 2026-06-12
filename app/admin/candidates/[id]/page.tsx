"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Activity, MapPin, Briefcase, Calendar, Mail, FileText, CheckCircle2, AlertTriangle, UserX } from 'lucide-react';

export default function CandidateProfileAdmin({ params }: { params: { id: string } }) {
  const [cand, setCand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const { data } = await supabase.from('candidates').select('*, users!user_id(email)').eq('id', params.id).single();
      setCand(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Candidate Intelligence...</div>;
  if (!cand) return <div className="p-8 text-center text-red-500 font-bold">Candidate not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[100px] -z-10"></div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold text-4xl">
             {cand.profile_photo_url ? <img src={cand.profile_photo_url} className="w-full h-full object-cover"/> : (cand.full_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{cand.full_name || 'Unknown Candidate'}</h1>
                <p className="text-lg font-medium text-slate-600 mt-1">{cand.headline || 'No Headline Provided'}</p>
                <div className="flex items-center gap-4 mt-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {cand.location || 'N/A'}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400"/> {cand.experience_years || 0} Yrs Exp</span>
                  <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400"/> {cand.users?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"><CheckCircle2 size={16}/> Verify</button>
                <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"><Mail size={16}/> Message</button>
              </div>
            </div>
            <div className="mt-8 flex gap-6 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trust Score</p>
                <p className="text-2xl font-black text-slate-900 flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> {cand.trust_score || 0}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity Score</p>
                <p className="text-2xl font-black text-slate-900 flex items-center gap-2"><Activity className="text-blue-500"/> {cand.activity_score || 0}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Completion</p>
                <p className="text-2xl font-black text-slate-900 flex items-center gap-2"><FileText className="text-purple-500"/> {cand.profile_completion_pct || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="text-blue-500"/> Professional Summary</h3>
            <p className="text-slate-600 font-medium leading-relaxed">{cand.summary || 'No summary provided.'}</p>
            
            {cand.skills && cand.skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cand.skills.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Original Resume</h3>
              <p className="text-slate-500 font-medium text-sm mt-1">View the source document parsed by the ATS.</p>
            </div>
            {cand.resume_url ? (
              <a href={cand.resume_url} target="_blank" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-colors border border-blue-200">View PDF Resume</a>
            ) : (
              <span className="text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl">Not Uploaded</span>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Danger Zone</h3>
             <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-sm transition-colors">
                 <span className="flex items-center gap-2"><AlertTriangle size={16}/> Suspend Candidate</span>
               </button>
               <button className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-sm transition-colors">
                 <span className="flex items-center gap-2"><UserX size={16}/> Delete Candidate</span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
