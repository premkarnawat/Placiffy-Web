import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx"
content = """"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter, Loader2, Building2, User } from 'lucide-react';
import { calculateCandidateScores } from '@/lib/scoring';
import Link from 'next/link';

export default function VerificationAdmin() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      // verifications table uses user_id. We fetch it, then join to find if it's candidate or company
      const { data, error } = await supabase.from('verifications').select('*, users(email, role)').order('created_at', { ascending: false });
      if (error) throw error;
      
      const enriched = await Promise.all((data || []).map(async (v) => {
         if (v.type === 'candidate') {
            const { data: cand } = await supabase.from('candidates').select('id, full_name, trust_score').eq('user_id', v.user_id).maybeSingle();
            return { ...v, entity: cand, entity_name: cand?.full_name || 'Unknown Candidate', entity_id: cand?.id };
         } else {
            const { data: comp } = await supabase.from('companies').select('id, name').eq('user_id', v.user_id).maybeSingle();
            return { ...v, entity: comp, entity_name: comp?.name || 'Unknown Company', entity_id: comp?.id };
         }
      }));
      setVerifications(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, newStatus: string, userId: string, type: string, entityId: string) => {
    try {
      await supabase.from('verifications').update({ status: newStatus, verified_at: newStatus === 'approved' ? new Date().toISOString() : null }).eq('id', id);
      
      if (newStatus === 'approved' && type === 'candidate' && entityId) {
         // Auto score and check passport
         await calculateCandidateScores(entityId);
      }
      
      fetchVerifications();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = verifications.filter(v => 
    v.status === activeTab && 
    ((v.entity_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (v.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verification Queue</h1>
          <p className="text-slate-500 font-medium">Review and approve pending candidate and company verifications.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-max">
            {['pending', 'approved', 'rejected'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search entity or email..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Entity</th>
                <th className="p-4">Type</th>
                <th className="p-4">Document</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center">
                   <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3"><ShieldCheck size={32}/></div>
                   <p className="text-slate-500 font-medium">No {activeTab} verifications found.</p>
                </td></tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <Link href={v.type === 'candidate' ? `/admin/candidates/${v.entity_id}` : `/admin/companies/${v.entity_id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                          {v.entity_name}
                        </Link>
                        <span className="text-xs text-slate-500">{v.users?.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${v.type === 'company' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                         {v.type === 'company' ? <Building2 size={12}/> : <User size={12}/>}
                         {v.type}
                       </span>
                    </td>
                    <td className="p-4">
                       {v.document_url ? (
                          <a href={v.document_url} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">View Document</a>
                       ) : (
                          <span className="text-xs text-slate-400">No Document</span>
                       )}
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-700">
                       {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2 flex justify-end">
                       {activeTab === 'pending' && (
                         <>
                           <button onClick={() => handleAction(v.id, 'approved', v.user_id, v.type, v.entity_id)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 rounded-xl transition-colors" title="Approve">
                             <CheckCircle2 size={18}/>
                           </button>
                           <button onClick={() => handleAction(v.id, 'rejected', v.user_id, v.type, v.entity_id)} className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-xl transition-colors" title="Reject">
                             <XCircle size={18}/>
                           </button>
                           <button className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors text-xs font-bold">Req Docs</button>
                         </>
                       )}
                       {activeTab === 'approved' && (
                          <button onClick={() => handleAction(v.id, 'pending', v.user_id, v.type, v.entity_id)} className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors text-xs font-bold flex items-center gap-1">
                            <Clock size={14}/> Re-eval
                          </button>
                       )}
                       {activeTab === 'rejected' && (
                          <button onClick={() => handleAction(v.id, 'pending', v.user_id, v.type, v.entity_id)} className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors text-xs font-bold flex items-center gap-1">
                            <Clock size={14}/> Re-eval
                          </button>
                       )}
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
