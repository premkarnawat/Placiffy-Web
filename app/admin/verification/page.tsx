"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Building2, User as UserIcon, CheckCircle2, XCircle, Clock, FileText, ExternalLink, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AdminVerification() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'candidates'|'companies'>('candidates');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, [activeTab]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      if (activeTab === 'candidates') {
        const { data } = await supabase.from('candidate_verifications').select('*, candidates(full_name, user_id, verification_badge)').order('created_at', { ascending: false });
        setCandidates(data || []);
      } else {
        const { data } = await supabase.from('company_verifications').select('*, companies(name, user_id, verification_badge)').order('created_at', { ascending: false });
        setCompanies(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, type: 'candidates'|'companies', action: 'approved'|'rejected'|'Requires Documents', coreId: string) => {
    try {
      setActionLoading(id);
      const table = type === 'candidates' ? 'candidate_verifications' : 'company_verifications';
      const coreTable = type === 'candidates' ? 'candidates' : 'companies';
      
      // 1. Update verification status
      await supabase.from(table).update({
        verification_status: action,
        verified_by: user?.id,
        verified_at: new Date().toISOString()
      }).eq('id', id);

      // 2. Update core table badge if approved
      if (action === 'approved') {
        await supabase.from(coreTable).update({
          verification_badge: true
        }).eq('id', coreId);
      } else if (action === 'rejected') {
        await supabase.from(coreTable).update({
          verification_badge: false
        }).eq('id', coreId);
      }

      fetchVerifications();
    } catch (e) {
      console.error(e);
      alert('Failed to update verification status. Check database constraints.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
      case 'Verified':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Verified</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">Rejected</span>;
      case 'Requires Documents':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">Docs Required</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Shield className="text-blue-600"/> Verification Center</h1>
          <p className="text-slate-500 mt-2">Approve credentials and business registrations to maintain platform trust.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex gap-2">
        <button 
          onClick={() => setActiveTab('candidates')}
          className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'candidates' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UserIcon size={18}/> Candidate Verifications
        </button>
        <button 
          onClick={() => setActiveTab('companies')}
          className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'companies' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Building2 size={18}/> Business Verifications
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32}/></div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === 'candidates' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documents</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No verifications found.</td></tr>
                ) : candidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900">{c.candidates?.full_name || 'Unknown Candidate'}</div>
                      <div className="text-xs text-slate-500">{c.aadhaar_number ? `Aadhaar: ${c.aadhaar_number}` : 'No Aadhaar provided'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {c.aadhaar_front_url && <a href={c.aadhaar_front_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Front</a>}
                        {c.aadhaar_back_url && <a href={c.aadhaar_back_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Back</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {!c.aadhaar_front_url && !c.linkedin_url && <span className="text-xs text-slate-400">No links provided</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">{c.created_at ? c.created_at.split('T')[0] : 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(c.verification_status)}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <button disabled={actionLoading === c.id || c.verification_status === 'approved' || c.verification_status === 'Verified'} onClick={() => handleAction(c.id, 'candidates', 'approved', c.candidate_id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50">
                          {actionLoading === c.id ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>}
                        </button>
                        <button disabled={actionLoading === c.id || c.verification_status === 'rejected'} onClick={() => handleAction(c.id, 'candidates', 'rejected', c.candidate_id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50">
                          {actionLoading === c.id ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={16}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'companies' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registration</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No verifications found.</td></tr>
                ) : companies.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900">{c.companies?.name || 'Unknown Company'}</div>
                      <div className="text-xs text-slate-500">GST: {c.gst_number || 'N/A'} • PAN: {c.pan_number || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {c.registration_document_url && <a href={c.registration_document_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Reg. Document</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {!c.registration_document_url && <span className="text-xs text-slate-400">No docs provided</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">{c.created_at ? c.created_at.split('T')[0] : 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(c.verification_status)}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <button disabled={actionLoading === c.id || c.verification_status === 'approved' || c.verification_status === 'Verified'} onClick={() => handleAction(c.id, 'companies', 'approved', c.company_id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50">
                          {actionLoading === c.id ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>}
                        </button>
                        <button disabled={actionLoading === c.id || c.verification_status === 'rejected'} onClick={() => handleAction(c.id, 'companies', 'rejected', c.company_id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50">
                          {actionLoading === c.id ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={16}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}