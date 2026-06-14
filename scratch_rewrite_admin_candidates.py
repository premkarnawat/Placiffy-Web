content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, Search, Filter, ShieldCheck, MapPin, 
  Briefcase, MoreVertical, Loader2, Star, Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function CandidateRegistry() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');

  useEffect(() => {
    fetchCandidates();

    const channel = supabase.channel('admin_candidates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchCandidates())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase.from('candidates')
        .select('*, resume_intelligence_reports(ats_resume_score)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter(c => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.full_name} ${c.headline}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVer = filterVerified === 'all' ? true : filterVerified === 'verified' ? c.verification_badge : !c.verification_badge;
    return matchSearch && matchVer;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-indigo-600" /> Candidate Registry
          </h1>
          <p className="text-gray-500 mt-1">Manage and oversee all candidates on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>
          <select 
            value={filterVerified} 
            onChange={e => setFilterVerified(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Headline & Location</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Scores</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(cand => {
                const atsScore = cand.resume_intelligence_reports?.[0]?.ats_resume_score || cand.resume_intelligence_reports?.ats_resume_score || 'N/A';
                
                return (
                  <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cand.profile_photo_url ? (
                          <img src={cand.profile_photo_url} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {cand.first_name?.[0]}{cand.last_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{cand.first_name} {cand.last_name}</div>
                          <div className="text-xs text-gray-500">{cand.user_id?.split('-')[0]}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{cand.headline || 'No headline'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {cand.location || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Trust</span>
                          <span className="font-bold text-amber-600">{cand.trust_score || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">ATS</span>
                          <span className="font-bold text-blue-600">{atsScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cand.verification_badge ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <ShieldCheck size={12}/> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          <Clock size={12}/> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/candidates/${cand.id}`} className="text-indigo-600 font-bold hover:underline text-xs">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Candidate Registry rebuilt")
