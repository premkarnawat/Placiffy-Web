"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { BarChart2, Download, TrendingUp, Users, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CompanyAnalytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ total_jobs: 0, total_candidates: 0, total_hires: 0, conversion_rate: "0%" });
  const [funnel, setFunnel] = useState({ sourcing: 0, interview: 0, offer: 0, joined: 0 });

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const { data: cu } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!cu) return;
      
      const { count: jobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', cu.id);
      const { count: cands } = await supabase.from('candidate_shortlists').select('*', { count: 'exact', head: true }).eq('company_id', cu.id);
      
      const { count: ints } = await supabase.from('candidate_shortlists').select('*', { count: 'exact', head: true }).eq('company_id', cu.id).eq('status', 'Interview');
      const { count: offs } = await supabase.from('candidate_shortlists').select('*', { count: 'exact', head: true }).eq('company_id', cu.id).eq('status', 'Offer');
      const { count: joins } = await supabase.from('candidate_shortlists').select('*', { count: 'exact', head: true }).eq('company_id', cu.id).eq('status', 'Joined');
      
      setMetrics({
          total_jobs: jobs || 0,
          total_candidates: cands || 0,
          total_hires: joins || 0,
          conversion_rate: cands ? `${Math.round(((joins || 0) / cands) * 100)}%` : "0%"
      });
      
      setFunnel({
          sourcing: cands || 0,
          interview: ints || 0,
          offer: offs || 0,
          joined: joins || 0
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
      toast("success", "Export Started", "Your analytics PDF is being generated and will download shortly.");
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart2 className="text-blue-600" size={32}/> Hiring Analytics
          </h1>
          <p className="text-gray-500 mt-1">Real-time data straight from your pipeline.</p>
        </div>
        <button onClick={handleExport} className="px-5 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Download size={18}/> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><BarChart2 size={20}/></div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Jobs</p>
              <h3 className="text-3xl font-black text-gray-900">{metrics.total_jobs}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><Users size={20}/></div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Candidates</p>
              <h3 className="text-3xl font-black text-gray-900">{metrics.total_candidates}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><TrendingUp size={20}/></div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-black text-gray-900">{metrics.conversion_rate}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><CheckCircle2 size={20}/></div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Hires</p>
              <h3 className="text-3xl font-black text-gray-900">{metrics.total_hires}</h3>
          </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Hiring Funnel (All Jobs)</h2>
          <div className="space-y-6">
              <div>
                  <div className="flex justify-between text-sm font-bold mb-2"><span>Sourcing & ATS Matched</span> <span>{funnel.sourcing}</span></div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: funnel.sourcing > 0 ? '100%' : '0%' }}></div></div>
              </div>
              <div>
                  <div className="flex justify-between text-sm font-bold mb-2"><span>Interview Stage</span> <span>{funnel.interview}</span></div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: funnel.sourcing > 0 ? `${(funnel.interview / funnel.sourcing) * 100}%` : '0%' }}></div></div>
              </div>
              <div>
                  <div className="flex justify-between text-sm font-bold mb-2"><span>Offer Stage</span> <span>{funnel.offer}</span></div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: funnel.sourcing > 0 ? `${(funnel.offer / funnel.sourcing) * 100}%` : '0%' }}></div></div>
              </div>
              <div>
                  <div className="flex justify-between text-sm font-bold mb-2"><span>Joined</span> <span>{funnel.joined}</span></div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: funnel.sourcing > 0 ? `${(funnel.joined / funnel.sourcing) * 100}%` : '0%' }}></div></div>
              </div>
          </div>
      </div>
    </div>
  );
}
