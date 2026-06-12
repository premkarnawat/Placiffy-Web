"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, MoreVertical, ShieldCheck, Activity, UserX, Loader2, Mail } from 'lucide-react';
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
      const { data, error } = await supabase.from('candidates').select('id, full_name, headline, location, trust_score, activity_score, profile_completion_pct, last_active_at, profile_photo_url').order('created_at', { ascending: false });
      if (error) throw error;
      setCandidates(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter(c => (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.headline || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Registry</h1>
          <p className="text-slate-500 font-medium">Manage and audit all platform candidates.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by name, headline..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4">Location</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Profile</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">No candidates found.</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-500 shrink-0 border border-gray-200">
                          {c.profile_photo_url ? <img src={c.profile_photo_url} alt="" className="w-full h-full object-cover"/> : (c.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.full_name || 'Unknown Candidate'}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{c.headline || 'No Headline'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">{c.location || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className={c.trust_score >= 80 ? 'text-emerald-500' : 'text-amber-500'}/>
                        <span className="font-bold text-slate-700">{c.trust_score || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Activity size={16} className="text-blue-500"/>
                        <span className="font-bold text-slate-700">{c.activity_score || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[80px] bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${c.profile_completion_pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width: `${c.profile_completion_pct || 0}%`}}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{c.profile_completion_pct || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Link href={`/admin/candidates/${c.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">View Profile</Link>
                      <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><MoreVertical size={16}/></button>
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
}
