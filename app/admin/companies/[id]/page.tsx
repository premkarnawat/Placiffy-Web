"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, MapPin, Loader2, ArrowLeft, Mail, Globe, Users, FileText, CheckCircle2, AlertCircle, CreditCard, Calendar, MessageSquare, ShieldCheck, PowerOff, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function CompanyDetailsAdmin({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: adminUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: comp, error } = await supabase.from('companies').select('*').eq('id', params.id).single();
      if (error) throw error;
      
      const [jobsRes, verRes, subRes] = await Promise.all([
        supabase.from('jobs').select('*, applications(count)').eq('company_id', params.id),
        supabase.from('verifications').select('*').eq('user_id', comp.user_id).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('company_id', params.id).maybeSingle()
      ]);

      setData({
        company: comp,
        jobs: jobsRes.data || [],
        verification: verRes.data,
        subscription: subRes.data
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageCompany = async () => {
    if (!adminUser || !data?.company) return;
    try {
      setMsgLoading(true);
      const companyUserId = data.company.user_id;
      
      // Check if conversation already exists where BOTH admin and company are participants
      const { data: adminConvs } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', adminUser.id);
      
      let existingConvId = null;
      if (adminConvs && adminConvs.length > 0) {
        const convIds = adminConvs.map(c => c.conversation_id);
        const { data: sharedConvs } = await supabase.from('conversation_participants')
          .select('conversation_id')
          .in('conversation_id', convIds)
          .eq('user_id', companyUserId);
          
        if (sharedConvs && sharedConvs.length > 0) {
           existingConvId = sharedConvs[0].conversation_id;
        }
      }
      
      if (existingConvId) {
        router.push('/admin/messages');
        return;
      }
      
      const { data: newConv, error: convErr } = await supabase.from('conversations').insert({
        type: 'support',
        status: 'open'
      }).select().single();
      if (convErr) throw convErr;
      
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: adminUser.id, role: 'admin' },
        { conversation_id: newConv.id, user_id: companyUserId, role: 'company' }
      ]);
      
      router.push('/admin/messages');
    } catch (e) {
      console.error(e);
    } finally {
      setMsgLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>;
  if (!data || !data.company) return <div className="p-12 text-center text-slate-500 font-medium">Company not found.</div>;

  const { company, jobs, verification, subscription } = data;
  const isVerified = verification?.status === 'approved';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm shrink-0 flex items-center justify-center p-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="w-full h-full object-contain"/> : <Building2 size={40} className="text-slate-300"/>}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{company.name}</h1>
              {isVerified && <ShieldCheck size={24} className="text-emerald-500"/>}
            </div>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><MapPin size={16}/> {company.hq_location || 'Location Unknown'}</span>
              <span className="flex items-center gap-1"><Building2 size={16}/> {company.industry || 'Industry Unknown'}</span>
              <span className="flex items-center gap-1"><Users size={16}/> {company.size || 'Size Unknown'}</span>
            </p>
            {company.website && (
              <a href={company.website} target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2 w-max"><Globe size={14}/> {company.website}</a>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
           <button onClick={handleMessageCompany} disabled={msgLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
             {msgLoading ? <Loader2 size={18} className="animate-spin"/> : <MessageSquare size={18}/>} Message Enterprise
           </button>
           <div className="flex gap-2">
             <Link href="/admin/verification" className="flex-1 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 font-bold py-2 px-3 rounded-xl transition-colors text-center text-sm">
               Verify
             </Link>
             <button className="bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 font-bold py-2 px-3 rounded-xl transition-colors text-center text-sm" title="Suspend">
               <PowerOff size={16}/>
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-8">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Total Jobs Posted</p>
              <div className="text-4xl font-black text-slate-900">{jobs.length}</div>
            </div>
            <div className="w-px h-16 bg-gray-100"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Total Applications</p>
              <div className="text-4xl font-black text-blue-600">{jobs.reduce((acc: number, j: any) => acc + (j.applications?.[0]?.count || 0), 0)}</div>
            </div>
            <div className="w-px h-16 bg-gray-100"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Verification</p>
              <div className={`text-xl font-black ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isVerified ? 'VERIFIED' : 'PENDING'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase size={18} className="text-blue-500"/> Job Postings</h3>
              <Link href="/admin/jobs" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="p-0">
              {jobs.length === 0 ? <p className="p-6 text-center text-slate-500 text-sm">No jobs posted.</p> : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map((j: any) => (
                      <tr key={j.job_id} className="hover:bg-slate-50/50">
                        <td className="p-4 pl-6">
                           <Link href={`/admin/jobs/${j.job_id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 block">{j.job_title}</Link>
                           <p className="text-xs text-slate-500 mt-0.5">{j.location || j.city}</p>
                        </td>
                        <td className="p-4">
                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">{j.applications?.[0]?.count || 0} Apps</span>
                        </td>
                        <td className="p-4">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${j.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{j.status}</span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                           <Link href={`/admin/jobs/${j.job_id}`} className="text-xs font-bold text-blue-600 hover:underline">View Pipeline</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Mail size={18} className="text-slate-500"/> Primary Contact</h3>
            <div>
              <p className="font-bold text-slate-900 text-sm">Enterprise Contact</p>
              <p className="text-slate-600 text-sm">No Email Linked</p>
              {company.users?.phone && <p className="text-slate-600 text-sm">{company.users.phone}</p>}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><CreditCard size={20} className="text-purple-400"/> Subscription Plan</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Plan</p>
                   <p className="font-bold text-purple-400 uppercase tracking-wide">{subscription?.plan_tier || 'FREE'}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                   <p className="font-bold text-emerald-400 uppercase tracking-wide">{subscription?.status || 'ACTIVE'}</p>
                 </div>
              </div>
              <Link href="/admin/billing" className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-sm font-bold transition-colors">Manage Billing</Link>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Registration Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">GST Number</p>
                <p className="font-mono text-sm text-slate-700">{company.gst_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Joined Placify</p>
                <p className="text-sm font-medium text-slate-700">{new Date(company.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}