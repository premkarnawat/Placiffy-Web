content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, Building2, User as UserIcon, CheckCircle2, 
  XCircle, Clock, FileText, Loader2, AlertCircle, Link as LinkIcon, FileImage 
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidate_verifications' }, () => fetchVerifications())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_verifications' }, () => fetchVerifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      if (activeTab === 'candidates') {
        const { data, error } = await supabase.from('candidate_verifications')
          .select('*, candidates(first_name, last_name, profile_photo_url, location, email)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      } else {
        const { data, error } = await supabase.from('company_verifications')
          .select('*, companies(name, logo_url, hq_location, industry)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      }
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to load verifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateAction = async (verifId: string, candId: string, action: 'approved' | 'rejected' | 'pending') => {
    try {
      setActionLoading(verifId);
      
      const { error: verErr } = await supabase.from('candidate_verifications').update({
        status: action,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', verifId);
      
      if (verErr) throw verErr;

      const isVerified = action === 'approved';
      const { data: cand } = await supabase.from('candidates').select('trust_score').eq('id', candId).single();
      const currentScore = cand?.trust_score || 0;
      const newScore = isVerified ? Math.min(100, currentScore + 30) : Math.max(0, currentScore - 30);

      await supabase.from('candidates').update({
        verification_badge: isVerified,
        trust_score: newScore
      }).eq('id', candId);

      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `Candidate Verification ${action.toUpperCase()}`,
        target_entity: 'candidate_verifications',
        target_id: verifId
      });

      toast("success", "Success", `Candidate ${action} successfully`);
      fetchVerifications();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompanyAction = async (verifId: string, compId: string, action: 'approved' | 'rejected' | 'pending') => {
    try {
      setActionLoading(verifId);
      
      const { error } = await supabase.from('company_verifications').update({
        status: action,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', verifId);

      if (error) throw error;

      await supabase.from('companies').update({
        verification_badge: action === 'approved'
      }).eq('id', compId);

      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `Company Verification ${action.toUpperCase()}`,
        target_entity: 'company_verifications',
        target_id: verifId
      });

      toast("success", "Success", `Company ${action} successfully`);
      fetchVerifications();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 size={14}/> Approved</span>;
      case 'rejected':
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
        <p className="text-gray-500 mt-1">Review official documents submitted by candidates and companies.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'candidates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <UserIcon size={18}/> Candidate Submissions
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'companies' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Building2 size={18}/> Company Submissions
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <ShieldCheck className="mx-auto text-gray-300 mb-4" size={48}/>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No verifications found</h3>
            <p className="text-gray-500 text-sm">All requests have been processed.</p>
          </div>
        ) : items.map(item => {
          const isCand = activeTab === 'candidates';
          const name = isCand ? `${item.candidates?.first_name} ${item.candidates?.last_name || ''}` : item.companies?.name;
          const photo = isCand ? item.candidates?.profile_photo_url : item.companies?.logo_url;
          const status = item.status || 'pending';
          const isLoading = actionLoading === item.id;

          return (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden ${isCand ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                    {photo ? <img src={photo} className="w-full h-full object-cover"/> : isCand ? <UserIcon size={24}/> : <Building2 size={24}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <p><strong>Sub ID:</strong> {item.id}</p>
                      <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    disabled={isLoading}
                    onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'approved') : handleCompanyAction(item.id, item.company_id, 'approved')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16}/> Approve
                  </button>
                  <button 
                    disabled={isLoading}
                    onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'rejected') : handleCompanyAction(item.id, item.company_id, 'rejected')}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={16}/> Reject
                  </button>
                  <button 
                    disabled={isLoading}
                    onClick={() => isCand ? handleCandidateAction(item.id, item.candidate_id, 'pending') : handleCompanyAction(item.id, item.company_id, 'pending')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <AlertCircle size={16}/> Reopen
                  </button>
                  {isLoading && <Loader2 className="animate-spin text-indigo-600" size={20}/>}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isCand ? (
                  <>
                    {item.aadhaar_number && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Aadhaar</div>
                        <div className="font-mono text-sm text-gray-900">{item.aadhaar_number}</div>
                      </div>
                    )}
                    {item.pan_number && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PAN</div>
                        <div className="font-mono text-sm text-gray-900">{item.pan_number}</div>
                      </div>
                    )}
                    {item.linkedin_url && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn</div>
                        <a href={item.linkedin_url} target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><LinkIcon size={14}/> View Profile</a>
                      </div>
                    )}
                    {item.github_url && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">GitHub</div>
                        <a href={item.github_url} target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><LinkIcon size={14}/> View Profile</a>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.gst_number && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">GST Number</div>
                        <div className="font-mono text-sm text-gray-900">{item.gst_number}</div>
                      </div>
                    )}
                    {item.gst_certificate_url && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">GST Document</div>
                        <a href={item.gst_certificate_url} target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><FileImage size={14}/> View Cert</a>
                      </div>
                    )}
                    {item.website_url && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Website</div>
                        <a href={item.website_url} target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><LinkIcon size={14}/> Visit Site</a>
                      </div>
                    )}
                  </>
                )}
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

print("Verification Center isolated correctly")
