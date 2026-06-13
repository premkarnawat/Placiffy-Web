import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Loader2, Eye, Mail, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CandidatesAdmin() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('candidates').select('*, users!user_id(email)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const enriched = await Promise.all((data || []).map(async (c) => {
        const [appRes, verRes] = await Promise.all([
          supabase.from('applications').select('id', { count: 'exact' }).eq('candidate_id', c.id),
          supabase.from('verifications').select('status').eq('user_id', c.user_id).maybeSingle()
        ]);
        return { 
          ...c, 
          total_apps: appRes.count || 0,
          verification_status: verRes.data?.status || 'unverified'
        };
      }));
      setCandidates(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter(c => 
    (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Intelligence Registry</h1>
          <p className="text-slate-500 font-medium">Global view of all registered talent profiles.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by name or email..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4 text-center">Scores</th>
                <th className="p-4 text-center">Applications</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No candidates found.</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-start gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                           {c.profile_photo_url ? <img src={c.profile_photo_url} alt="" className="w-full h-full object-cover"/> : <span className="font-bold text-slate-400">{c.full_name?.charAt(0) || 'U'}</span>}
                         </div>
                         <div>
                           <Link href={`/admin/candidates/${c.id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors block">{c.full_name}</Link>
                           <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {c.location || 'Unknown'}</p>
                           <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Mail size={12}/> {c.users?.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4 text-center">
                        <div>
                          <p className="text-sm font-black text-blue-600 leading-none">{c.trust_score || 0}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Trust</p>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-sm font-black text-emerald-600 leading-none">{c.activity_score || 0}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Activity</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-black text-slate-700">{c.total_apps}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${c.verification_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {c.verification_status === 'approved' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {c.verification_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/admin/candidates/${c.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        View Profile <Eye size={14}/>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}"""

os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
