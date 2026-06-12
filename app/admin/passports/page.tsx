"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Search, ShieldCheck, Download, RefreshCw, Loader2 } from 'lucide-react';

export default function PassportsAdmin() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassports();
  }, []);

  const fetchPassports = async () => {
    try {
      setLoading(true);
      // Passports are implicitly issued to candidates with high trust scores
      const { data, error } = await supabase.from('candidates').select('id, full_name, trust_score, activity_score, location').gte('trust_score', 80).order('trust_score', { ascending: false });
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Passport Ledger</h1>
          <p className="text-slate-500 font-medium">Log of all issued Placify Verified ATS Passports.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2">
          <RefreshCw size={18}/> Batch Regenerate
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
              ) : candidates.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No passports issued yet.</td></tr>
              ) : (
                candidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.full_name}</p>
                      <p className="text-xs text-slate-500">{c.location}</p>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600">PASS-{c.id.split('-')[0].toUpperCase()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-500"/>
                        <span className="font-bold text-slate-700">{c.trust_score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">Active</span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"><Download size={16}/></button>
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
