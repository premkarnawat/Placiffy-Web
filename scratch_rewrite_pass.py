import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Search, ShieldCheck, Download, RefreshCw, Loader2, CheckCircle2, UserX, Trash2 } from 'lucide-react';
import { calculateCandidateScores } from '@/lib/scoring';
import Link from 'next/link';

export default function PassportsAdmin() {
  const [passports, setPassports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPassports();
  }, []);

  const fetchPassports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('passports').select('*, candidates(full_name, location, users(email))').order('last_generated_at', { ascending: false });
      if (error) throw error;
      setPassports(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchRegenerate = async () => {
    setSyncing(true);
    try {
      // Find all candidates
      const { data: allCands } = await supabase.from('candidates').select('id, user_id, trust_score');
      if (allCands) {
        for (const cand of allCands) {
           const { data: existing } = await supabase.from('passports').select('id').eq('candidate_id', cand.id).maybeSingle();
           const { data: ver } = await supabase.from('verifications').select('status').eq('user_id', cand.user_id).maybeSingle();
           
           // Only issue passports to verified candidates OR those with score >= 80
           if (cand.trust_score >= 80 || ver?.status === 'approved') {
               if (!existing) {
                 await supabase.from('passports').insert({
                   candidate_id: cand.id,
                   verification_status: 'active',
                   trust_score: cand.trust_score
                 });
               } else {
                 await supabase.from('passports').update({ trust_score: cand.trust_score }).eq('id', existing.id);
               }
           }
        }
      }
      await fetchPassports();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Deactivate this passport?")) return;
    try {
      await supabase.from('passports').update({ verification_status: 'suspended' }).eq('id', id);
      fetchPassports();
    } catch (e) { console.error(e); }
  };

  const handleRecalculate = async (candidateId: string, passportId: string) => {
     try {
       const result = await calculateCandidateScores(candidateId);
       if (result) {
         await supabase.from('passports').update({ trust_score: result.trustScore }).eq('id', passportId);
         fetchPassports();
       }
     } catch (e) { console.error(e); }
  };

  const filtered = passports.filter(p => {
     const s = searchTerm.toLowerCase();
     return (p.candidates?.full_name || '').toLowerCase().includes(s) || 
            (p.candidates?.users?.email || '').toLowerCase().includes(s) || 
            (p.id || '').toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Passport Ledger</h1>
          <p className="text-slate-500 font-medium">Log of all issued Placify Verified ATS Passports.</p>
        </div>
        <button onClick={handleBatchRegenerate} disabled={syncing} className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2">
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''}/> {syncing ? 'Syncing Ledger...' : 'Batch Regenerate'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by name, email, or Passport ID..." 
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
                <th className="p-4">Passport ID</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No passports issued yet. Click Batch Regenerate to sync eligible candidates.</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <Link href={`/admin/candidates/${p.candidate_id}`} className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">{p.candidates?.full_name}</Link>
                      <p className="text-xs text-slate-500">{p.candidates?.users?.email}</p>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600">PASS-{p.id.split('-')[0].toUpperCase()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-500"/>
                        <span className="font-bold text-slate-700">{p.trust_score || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${p.verification_status === 'active' || p.verification_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {p.verification_status ? p.verification_status.toUpperCase() : 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1 flex justify-end">
                      <button onClick={() => handleRecalculate(p.candidate_id, p.id)} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 text-xs font-bold" title="Recalculate"><RefreshCw size={14}/> Recalculate</button>
                      <button className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Download"><Download size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Suspend"><UserX size={16}/></button>
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
