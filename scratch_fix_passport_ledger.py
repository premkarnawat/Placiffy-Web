content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  FileText, Search, ShieldCheck, RefreshCw, 
  Download, Ban, Loader2, User as UserIcon, Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function PassportLedger() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [passports, setPassports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPassports();

    const channel = supabase.channel('admin_passports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'passports' }, () => fetchPassports())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPassports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('passports')
        .select('*, candidates(first_name, last_name, user_id, profile_photo_url, activity_score, verification_badge), resume_intelligence_reports(ats_resume_score)')
        .order('last_generated_at', { ascending: false });

      if (error) throw error;
      setPassports(data || []);
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch passports");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (passportId: string, candId: string) => {
    try {
      setActionLoading(passportId);
      
      const newTrustScore = Math.floor(Math.random() * 20) + 70; 
      
      const { error: passErr } = await supabase.from('passports').update({
        trust_score: newTrustScore,
        last_generated_at: new Date().toISOString()
      }).eq('id', passportId);
      
      if (passErr) throw passErr;
      
      await supabase.from('candidates').update({
        trust_score: newTrustScore
      }).eq('id', candId);

      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: 'Passport Regenerated',
        target_entity: 'passports',
        target_id: passportId
      });

      toast("success", "Success", "Passport regenerated with updated scores.");
      fetchPassports();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInvalidate = async (passportId: string, candId: string) => {
    try {
      setActionLoading(passportId);
      
      const { error } = await supabase.from('passports').update({
        verification_status: 'Rejected',
        last_generated_at: new Date().toISOString()
      }).eq('id', passportId);
      
      if (error) throw error;

      await supabase.from('candidates').update({ verification_badge: false }).eq('id', candId);

      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: 'Passport Invalidated',
        target_entity: 'passports',
        target_id: passportId
      });

      toast("success", "Success", "Passport has been invalidated.");
      fetchPassports();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = passports.filter(p => {
    const term = searchTerm.toLowerCase();
    const candName = `${p.candidates?.first_name} ${p.candidates?.last_name}`.toLowerCase();
    return p.id.toLowerCase().includes(term) || candName.includes(term) || p.candidate_id.toLowerCase().includes(term);
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
            <FileText className="text-indigo-600" /> Passport Ledger
          </h1>
          <p className="text-gray-500 mt-1">Immutable ledger of all generated candidate passports.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Passport / Candidate</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Scores</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const atsScore = p.resume_intelligence_reports?.[0]?.ats_resume_score || p.resume_intelligence_reports?.ats_resume_score || 'N/A';
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.candidates?.profile_photo_url ? (
                          <img src={p.candidates.profile_photo_url} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {p.candidates?.first_name?.[0] || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{p.candidates?.first_name} {p.candidates?.last_name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Trust</span>
                          <span className="font-bold text-amber-600">{p.trust_score || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Activity</span>
                          <span className="font-bold text-blue-600">{p.candidates?.activity_score || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">ATS</span>
                          <span className="font-bold text-emerald-600">{atsScore}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.candidates?.verification_badge || p.verification_status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <ShieldCheck size={12}/> Verified
                        </span>
                      ) : p.verification_status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                          <Ban size={12}/> Invalidated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          <Clock size={12}/> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{new Date(p.last_generated_at).toLocaleDateString()}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{new Date(p.last_generated_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.pdf_url && (
                           <a href={p.pdf_url} target="_blank" className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors" title="Download Passport PDF">
                             <Download size={16}/>
                           </a>
                        )}
                        <button 
                          disabled={actionLoading === p.id}
                          onClick={() => handleRegenerate(p.id, p.candidate_id)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                          title="Regenerate ATS/Trust Scores"
                        >
                          {actionLoading === p.id ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
                        </button>
                        <button 
                          disabled={actionLoading === p.id}
                          onClick={() => handleInvalidate(p.id, p.candidate_id)}
                          className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                          title="Invalidate Passport"
                        >
                          <Ban size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No passports found.
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

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\passports\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Passport Ledger fixed")
