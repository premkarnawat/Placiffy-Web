import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Activity, MapPin, Briefcase, Calendar, Mail, FileText, CheckCircle2, TriangleAlert, UserX, Star, GraduationCap, Award, ExternalLink, RefreshCw } from 'lucide-react';
import { calculateCandidateScores, getActivityLevel } from '@/lib/scoring';
import Link from 'next/link';

export default function CandidateDetailsAdmin({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [candRes, eduRes, expRes, projRes, certRes, appRes, passRes] = await Promise.all([
        supabase.from('candidates').select('*, users!user_id(email)').eq('id', params.id).single(),
        supabase.from('candidate_education').select('*').eq('candidate_id', params.id),
        supabase.from('candidate_experience').select('*').eq('candidate_id', params.id),
        supabase.from('candidate_projects').select('*').eq('candidate_id', params.id),
        supabase.from('candidate_certifications').select('*').eq('candidate_id', params.id),
        supabase.from('applications').select('*, jobs(title, companies(name))').eq('candidate_id', params.id),
        supabase.from('passports').select('*').eq('candidate_id', params.id).maybeSingle()
      ]);

      setData({
        cand: candRes.data,
        edu: eduRes.data || [],
        exp: expRes.data || [],
        proj: projRes.data || [],
        cert: certRes.data || [],
        apps: appRes.data || [],
        passport: passRes.data
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    await calculateCandidateScores(params.id);
    await fetchData();
    setRecalculating(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Loading Candidate Intelligence...</p>
    </div>
  );

  const { cand, edu, exp, proj, cert, apps, passport } = data;
  if (!cand) return <div className="p-8 text-center text-slate-500 font-medium">Candidate not found.</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 bg-slate-200 rounded-3xl overflow-hidden border-4 border-white shadow-lg shrink-0">
            {cand.profile_photo_url ? (
               <img src={cand.profile_photo_url} alt="" className="w-full h-full object-cover"/>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-3xl">
                 {cand.full_name?.charAt(0)}
               </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{cand.full_name}</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><MapPin size={16}/> {cand.location || 'Unknown'}</span>
              <span className="flex items-center gap-1"><Mail size={16}/> {cand.users?.email}</span>
            </p>
            <div className="mt-3 flex gap-2">
               <button onClick={handleRecalculate} disabled={recalculating} className="text-xs font-bold bg-white border border-gray-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1">
                 <RefreshCw size={12} className={recalculating ? 'animate-spin' : ''}/> Recalculate Scores
               </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-2 px-4 rounded-xl transition-colors border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={18}/> Verify Candidate
          </button>
          <button className="bg-red-50 text-red-700 hover:bg-red-100 font-bold py-2 px-4 rounded-xl transition-colors border border-red-200 flex items-center gap-2">
            <UserX size={18}/> Suspend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-8">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> Trust Score</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-900 leading-none">{cand.trust_score || 0}</span>
                <span className="text-sm font-bold text-slate-400 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${cand.trust_score || 0}%`}}></div>
              </div>
            </div>
            <div className="w-px h-16 bg-gray-100"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2"><Activity size={16} className="text-emerald-500"/> Activity Level</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-slate-900 leading-none">{getActivityLevel(cand.activity_score || 0)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${cand.activity_score || 0}%`}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase size={18} className="text-blue-500"/> Experience</h3>
            </div>
            <div className="p-5 space-y-4">
              {exp.length === 0 ? <p className="text-sm text-slate-500">No experience listed.</p> : exp.map((e: any) => (
                <div key={e.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-800">{e.title} at {e.company}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">{e.start_date} - {e.end_date || 'Present'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><GraduationCap size={18} className="text-purple-500"/> Education</h3>
            </div>
            <div className="p-5 space-y-4">
              {edu.length === 0 ? <p className="text-sm text-slate-500">No education listed.</p> : edu.map((e: any) => (
                <div key={e.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-800">{e.degree} in {e.field_of_study}</h4>
                  <p className="text-sm font-medium text-slate-600">{e.school}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Graduated: {e.end_date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText size={18} className="text-emerald-500"/> Applications Pipeline</h3>
            </div>
            <div className="p-0">
              {apps.length === 0 ? <p className="p-5 text-sm text-slate-500">No applications yet.</p> : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50">
                    {apps.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="p-4 pl-5">
                          <p className="font-bold text-sm text-slate-900">{a.jobs?.title}</p>
                          <p className="text-xs text-slate-500">{a.jobs?.companies?.name}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><Award size={20} className="text-amber-400"/> Placify Passport</h3>
            {passport ? (
              <div className="space-y-4 relative z-10">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passport ID</p>
                  <p className="font-mono text-sm text-blue-300">PASS-{passport.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14}/> Active & Verified</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700 relative z-10">
                <TriangleAlert size={24} className="text-amber-400 mx-auto mb-2"/>
                <p className="text-sm font-medium text-slate-300">No Passport Issued</p>
                <p className="text-xs text-slate-500 mt-1">Trust Score below 80 or pending manual verification.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Star size={18} className="text-amber-500"/> Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cand.skills && cand.skills.length > 0 ? cand.skills.map((s: string, i: number) => (
                <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">{s}</span>
              )) : <span className="text-sm text-slate-500">No skills extracted.</span>}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Resume Document</h3>
            {cand.resume_url ? (
              <a href={cand.resume_url} target="_blank" className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-bold hover:bg-blue-100 transition-colors">
                <span>View Source PDF</span>
                <ExternalLink size={18}/>
              </a>
            ) : (
              <p className="text-sm text-slate-500">No resume uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
