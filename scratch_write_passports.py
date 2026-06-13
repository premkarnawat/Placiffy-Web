import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Search, ShieldCheck, Download, RefreshCw, Loader2, CheckCircle2, UserX } from 'lucide-react';

export default function PassportsAdmin() {
  const [passports, setPassports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchPassports();
  }, []);

  const fetchPassports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('passports').select('*, candidates(full_name, trust_score, activity_score, location)').order('created_at', { ascending: false });
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
      // Find all candidates with trust_score >= 80
      const { data: eligible } = await supabase.from('candidates').select('id, trust_score').gte('trust_score', 80);
      if (eligible) {
        for (const cand of eligible) {
           const { data: existing } = await supabase.from('passports').select('id').eq('candidate_id', cand.id).maybeSingle();
           if (!existing) {
             await supabase.from('passports').insert({
               candidate_id: cand.id,
               status: 'active',
               metadata: { generated_by: 'admin_batch_sync' }
             });
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
              ) : passports.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No passports issued yet. Click Batch Regenerate to sync eligible candidates.</td></tr>
              ) : (
                passports.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.candidates?.full_name}</p>
                      <p className="text-xs text-slate-500">{p.candidates?.location}</p>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600">PASS-{p.id.split('-')[0].toUpperCase()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-500"/>
                        <span className="font-bold text-slate-700">{p.candidates?.trust_score || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {p.status ? p.status.toUpperCase() : 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1">
                      <button className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Verify"><CheckCircle2 size={16}/></button>
                      <button className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Suspend"><UserX size={16}/></button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Download PDF"><Download size={16}/></button>
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

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
