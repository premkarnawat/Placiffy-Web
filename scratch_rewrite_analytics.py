import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\analytics\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Building2, Briefcase, FileText, CheckCircle2, Award, MessageSquare, AlertCircle, TrendingUp, Loader2, BarChart2 } from 'lucide-react';

export default function AnalyticsAdmin() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({
     candidates: { total: 0, verified: 0, active: 0 },
     companies: { total: 0, verified: 0, active: 0 },
     jobs: { total: 0, open: 0, closed: 0 },
     applications: { total: 0, shortlisted: 0, interviewing: 0, offered: 0, hired: 0 },
     passports: 0,
     messages: 0,
     tickets: 0
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const [candRes, compRes, jobRes, appRes, passRes, msgRes, tickRes, verRes] = await Promise.all([
        supabase.from('candidates').select('id, last_active_at'),
        supabase.from('companies').select('id, created_at'),
        supabase.from('jobs').select('status'),
        supabase.from('applications').select('status'),
        supabase.from('passports').select('id', { count: 'exact' }),
        supabase.from('messages').select('id', { count: 'exact' }),
        supabase.from('support_tickets').select('id', { count: 'exact' }),
        supabase.from('verifications').select('type, status')
      ]);

      const cands = candRes.data || [];
      const comps = compRes.data || [];
      const jobs = jobRes.data || [];
      const apps = appRes.data || [];
      const vers = verRes.data || [];

      // Active in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      setMetrics({
        candidates: {
           total: cands.length,
           verified: vers.filter(v => v.type === 'candidate' && v.status === 'approved').length,
           active: cands.filter(c => c.last_active_at && new Date(c.last_active_at) > sevenDaysAgo).length
        },
        companies: {
           total: comps.length,
           verified: vers.filter(v => v.type === 'company' && v.status === 'approved').length,
           active: comps.length // all assumed active unless suspended
        },
        jobs: {
           total: jobs.length,
           open: jobs.filter(j => j.status === 'open' || j.status === 'active' || !j.status).length,
           closed: jobs.filter(j => j.status === 'closed' || j.status === 'archived').length
        },
        applications: {
           total: apps.length,
           shortlisted: apps.filter(a => a.status === 'shortlisted').length,
           interviewing: apps.filter(a => a.status === 'interviewing').length,
           offered: apps.filter(a => a.status === 'offered').length,
           hired: apps.filter(a => a.status === 'hired').length,
        },
        passports: passRes.count || 0,
        messages: msgRes.count || 0,
        tickets: tickRes.count || 0
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Computing Platform Analytics...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">Platform Analytics <TrendingUp className="text-emerald-500" size={28}/></h1>
          <p className="text-slate-500 font-medium">Real-time aggregate platform metrics.</p>
        </div>
        <button onClick={fetchMetrics} className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 text-sm shadow-sm">
          <BarChart2 size={16}/> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Candidates Card */}
         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors"><Users size={120}/></div>
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-2"><Users size={14} className="text-blue-500"/> Talent Pool</h3>
            <div className="text-5xl font-black text-slate-900 mb-4 relative z-10">{metrics.candidates.total}</div>
            <div className="space-y-2 relative z-10">
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Verified</span><span className="text-emerald-600">{metrics.candidates.verified}</span></div>
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Active (7d)</span><span className="text-blue-600">{metrics.candidates.active}</span></div>
            </div>
         </div>

         {/* Companies Card */}
         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-purple-500/10 group-hover:text-purple-500/20 transition-colors"><Building2 size={120}/></div>
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-2"><Building2 size={14} className="text-purple-500"/> Enterprise Partners</h3>
            <div className="text-5xl font-black text-slate-900 mb-4 relative z-10">{metrics.companies.total}</div>
            <div className="space-y-2 relative z-10">
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Verified</span><span className="text-emerald-600">{metrics.companies.verified}</span></div>
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Active</span><span className="text-purple-600">{metrics.companies.active}</span></div>
            </div>
         </div>

         {/* Jobs Card */}
         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors"><Briefcase size={120}/></div>
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-2"><Briefcase size={14} className="text-amber-500"/> Job Postings</h3>
            <div className="text-5xl font-black text-slate-900 mb-4 relative z-10">{metrics.jobs.total}</div>
            <div className="space-y-2 relative z-10">
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Open/Active</span><span className="text-emerald-600">{metrics.jobs.open}</span></div>
               <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Closed/Archived</span><span className="text-amber-600">{metrics.jobs.closed}</span></div>
            </div>
         </div>

         {/* Infrastructure Card */}
         <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors"><CheckCircle2 size={120}/></div>
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-2"><Award size={14} className="text-emerald-400"/> Security & Comm</h3>
            <div className="space-y-4 relative z-10">
               <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">Passports Generated</span>
                 <span className="font-black text-emerald-400">{metrics.passports}</span>
               </div>
               <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">Messages Sent</span>
                 <span className="font-black text-blue-400">{metrics.messages}</span>
               </div>
               <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">Support Tickets</span>
                 <span className="font-black text-purple-400">{metrics.tickets}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
         <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Application Funnel</h3>
         
         <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <div className="flex-1 w-full bg-slate-50 border border-gray-100 rounded-2xl p-6 text-center">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Apps</p>
               <p className="text-4xl font-black text-slate-900">{metrics.applications.total}</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-200"></div>
            <div className="flex-1 w-full bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
               <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Shortlisted</p>
               <p className="text-4xl font-black text-blue-700">{metrics.applications.shortlisted}</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-200"></div>
            <div className="flex-1 w-full bg-purple-50 border border-purple-100 rounded-2xl p-6 text-center">
               <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">Interviews</p>
               <p className="text-4xl font-black text-purple-700">{metrics.applications.interviewing}</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-200"></div>
            <div className="flex-1 w-full bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
               <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Offered</p>
               <p className="text-4xl font-black text-amber-700">{metrics.applications.offered}</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-200"></div>
            <div className="flex-1 w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center shadow-lg shadow-emerald-500/10">
               <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Hired</p>
               <p className="text-4xl font-black text-emerald-700">{metrics.applications.hired}</p>
            </div>
         </div>
      </div>
    </div>
  );
}"""

os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
