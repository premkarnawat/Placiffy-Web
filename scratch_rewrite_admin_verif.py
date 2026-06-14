content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, Building2, User as UserIcon, CheckCircle2, 
  XCircle, Clock, FileText, Loader2, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'candidates'|'companies'>('candidates');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();

    const channel = supabase.channel('admin_verifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'passports' }, () => fetchVerifications())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchVerifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      if (activeTab === 'candidates') {
        // Fetch from passports which is the source of truth for candidate verification
        const { data, error } = await supabase.from('passports')
          .select('*, candidates(first_name, last_name, profile_photo_url)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      } else {
        // Fetch from companies directly
        const { data, error } = await supabase.from('companies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      }
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateAction = async (passportId: string, candId: string, action: 'Verified' | 'Rejected' | 'Pending') => {
    try {
      setActionLoading(passportId);
      
      // 1. Update passport status
      const { error: passErr } = await supabase.from('passports').update({
        verification_status: action,
        updated_at: new Date().toISOString()
      }).eq('id', passportId);
      
      if (passErr) throw passErr;

      // 2. Update candidate badge and trust score
      const isVerified = action === 'Verified';
      
      const { data: cand } = await supabase.from('candidates').select('trust_score').eq('id', candId).single();
      const currentScore = cand?.trust_score || 0;
      const newScore = isVerified ? Math.min(100, currentScore + 30) : Math.max(0, currentScore - 30);

      await supabase.from('candidates').update({
        verification_badge: isVerified,
        trust_score: newScore
      }).eq('id', candId);

      // 3. Log Audit
      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `Candidate Passport ${action}`,
        target_entity: 'passports',
        target_id: passportId,
        details: `Candidate ID: ${candId}`
      });

      toast("success", "Success", `Candidate ${action.toLowerCase()} successfully`);
      fetchVerifications();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompanyAction = async (compId: string, action: 'Verified' | 'Rejected' | 'Pending') => {
    try {
      setActionLoading(compId);
      
      const { error } = await supabase.from('companies').update({
        verification_status: action
      }).eq('id', compId);

      if (error) throw error;

      // Log Audit
      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `Company ${action}`,
        target_entity: 'companies',
        target_id: compId
      });

      toast("success", "Success", `Company ${action.toLowerCase()} successfully`);
      fetchVerifications();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Verified':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 size={14}/> Verified</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1 w-max"><XCircle size={14}/> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1 w-max"><Clock size={14}/> Pending Review</span>;
    }
  };

  if (loading && items.length === 0) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" /> Verification Center
        </h1>
        <p className="text-gray-500 mt-1">Review and process platform verification requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'candidates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <UserIcon size={18}/> Candidate Passports
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'companies' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Building2 size={18}/> Company Profiles
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <ShieldCheck className="mx-auto text-gray-300 mb-4" size={48}/>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No verifications found</h3>
            <p className="text-gray-500 text-sm">All requests have been processed.</p>
          </div>
        ) : items.map(item => {
          const isCand = activeTab === 'candidates';
          const name = isCand ? `${item.candidates?.first_name} ${item.candidates?.last_name || ''}` : item.company_name;
          const status = item.verification_status || 'Pending';
          const isLoading = actionLoading === item.id;

          return (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isCand ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                  {isCand ? <UserIcon size={24}/> : <Building2 size={24}/>}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 md:border-l md:border-gray-100 md:pl-6">
                <button 
                  disabled={isLoading}
                  onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'Verified') : handleCompanyAction(item.id, 'Verified')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={16}/> Approve
                </button>
                <button 
                  disabled={isLoading}
                  onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'Rejected') : handleCompanyAction(item.id, 'Rejected')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={16}/> Reject
                </button>
                <button 
                  disabled={isLoading}
                  onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'Pending') : handleCompanyAction(item.id, 'Pending')}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <AlertCircle size={16}/> Reopen
                </button>
                {isLoading && <Loader2 className="animate-spin text-indigo-600" size={20}/>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Verification Center rebuilt")
