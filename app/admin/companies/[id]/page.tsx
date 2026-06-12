"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, MapPin, Globe, Mail, Briefcase, FileText, CheckCircle2, TriangleAlert, ShieldCheck } from 'lucide-react';

export default function CompanyProfileAdmin({ params }: { params: { id: string } }) {
  const [comp, setComp] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const { data } = await supabase.from('companies').select('*, users!user_id(email)').eq('id', params.id).single();
      setComp(data);
      
      if (data) {
        const { data: jobData } = await supabase.from('jobs').select('*').eq('company_id', data.id);
        setJobs(jobData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Enterprise Data...</div>;
  if (!comp) return <div className="p-8 text-center text-red-500 font-bold">Company not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-[100px] -z-10"></div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold text-4xl">
             {comp.logo_url ? <img alt="" src={comp.logo_url} className="w-full h-full object-cover"/> : <Building2 size={48}/>}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{comp.name || 'Unknown Company'}</h1>
                <p className="text-lg font-medium text-slate-600 mt-1">{comp.industry || 'No Industry Provided'}</p>
                <div className="flex items-center gap-4 mt-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {comp.hq_location || 'N/A'}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400"/> {comp.size || 'N/A'}</span>
                  <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400"/> {comp.users?.email || 'N/A'}</span>
                  {comp.website && <span className="flex items-center gap-1.5 text-blue-500"><Globe size={16}/> <a href={comp.website} target="_blank">Website</a></span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"><CheckCircle2 size={16}/> Verified</button>
                <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"><Mail size={16}/> Message</button>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
                <p className="text-2xl font-black text-slate-900 flex items-center gap-2"><Briefcase className="text-blue-500"/> {jobs.length}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GST Number</p>
                <p className="text-lg font-bold text-slate-900 mt-1 font-mono">{comp.gst_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription</p>
                <p className="text-lg font-bold text-emerald-600 mt-1 flex items-center gap-1"><ShieldCheck size={18}/> Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Briefcase className="text-blue-500"/> Posted Jobs</h3>
        {jobs.length === 0 ? (
           <p className="text-slate-500 font-medium">No jobs posted yet.</p>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {jobs.map(j => (
               <div key={j.job_id} className="p-4 rounded-2xl border border-gray-100 bg-slate-50 hover:border-blue-200 transition-colors cursor-pointer group">
                 <div className="flex justify-between items-start">
                   <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{j.title}</h4>
                   <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">{j.status || 'Active'}</span>
                 </div>
                 <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-3">
                   <span className="flex items-center gap-1"><MapPin size={12}/> {j.location}</span>
                   <span className="flex items-center gap-1"><Briefcase size={12}/> {j.employment_type}</span>
                 </p>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
