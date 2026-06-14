'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Users, MessageSquare, TrendingUp, CheckCircle, 
  Clock, AlertCircle, FileText, ChevronRight, Activity, Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

export default function CompanyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();

      const channel = supabase.channel(`company_dash_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchDashboardData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: comp } = await supabase.from('companies').select('*').eq('user_id', user?.id).single();
      if (!comp) return;

      const [jobsRes, appsRes, poolRes, msgsRes] = await Promise.all([
        supabase.from('jobs').select('id, status, job_title').eq('company_id', comp.id),
        supabase.from('applications').select('id, status, applied_at, job_id, jobs!inner(company_id)').eq('jobs.company_id', comp.id),
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('is_read', false)
      ]);

      const jobs = jobsRes.data || [];
      const apps = appsRes.data || [];
      
      const activeJobs = jobs.filter(j => j.status === 'Open' || j.status === 'Published').length;
      const closedJobs = jobs.filter(j => j.status === 'Closed').length;

      const pipelineCounts = {
        applied: apps.filter(a => a.status === 'applied').length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interviewing: apps.filter(a => a.status === 'interviewing').length,
        offered: apps.filter(a => a.status === 'offered').length,
        joined: apps.filter(a => a.status === 'joined').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      };

      // Trend Logic
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap: any = {};
      apps.forEach(a => {
         const date = new Date(a.applied_at);
         const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
         trendMap[key] = (trendMap[key] || 0) + 1;
      });
      const trendData = Object.keys(trendMap).slice(-6).map(k => ({ name: k, applications: trendMap[k] }));

      // Pipeline Pie Data
      const pieData = [
        { name: 'Applied', value: pipelineCounts.applied, color: '#3b82f6' },
        { name: 'Shortlisted', value: pipelineCounts.shortlisted, color: '#eab308' },
        { name: 'Interviewing', value: pipelineCounts.interviewing, color: '#a855f7' },
        { name: 'Offered', value: pipelineCounts.offered, color: '#22c55e' },
        { name: 'Rejected', value: pipelineCounts.rejected, color: '#ef4444' }
      ].filter(d => d.value > 0);

      // Job Performance Data
      const jobPerfMap: any = {};
      apps.forEach(a => {
        const title = jobs.find(j => j.id === a.job_id)?.job_title || 'Unknown Job';
        const label = title.length > 15 ? title.substring(0, 15) + '...' : title;
        jobPerfMap[label] = (jobPerfMap[label] || 0) + 1;
      });
      const jobPerfData = Object.keys(jobPerfMap).sort((a,b) => jobPerfMap[b] - jobPerfMap[a]).slice(0, 5).map(k => ({ name: k, apps: jobPerfMap[k] }));

      setData({
        comp,
        stats: {
          activeJobs,
          closedJobs,
          totalApps: apps.length,
          poolSize: poolRes.count || 0,
          msgs: msgsRes.count || 0,
          ...pipelineCounts
        },
        trendData,
        pieData,
        jobPerfData
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-slate-900">Dashboard Unavailable</h2>
      <p className="text-slate-500 mt-2 max-w-md">Please complete your company registration to view analytics.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {data.comp.name}</h1>
          <p className="text-gray-500 mt-1">Here is your Company Hiring Operations overview.</p>
        </div>
        <button onClick={()=>router.push('/company/jobs/create')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors">
          Post New Job
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
           <Briefcase className="absolute -right-4 -bottom-4 text-white opacity-10" size={100}/>
           <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Active Jobs</div>
           <div className="text-4xl font-black">{data.stats.activeJobs}</div>
           <button onClick={()=>router.push('/company/workspace')} className="text-xs text-blue-300 hover:text-white font-bold mt-4 flex items-center gap-1">
             Manage Pipeline <ChevronRight size={14}/>
           </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Applications</div>
           <div className="text-3xl font-black text-gray-900">{data.stats.totalApps}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-1">Interviews</div>
           <div className="text-3xl font-black text-purple-900">{data.stats.interviewing}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-1">Offers Sent</div>
           <div className="text-3xl font-black text-emerald-900">{data.stats.offered}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Candidate Pool</div>
           <div className="text-3xl font-black text-slate-900">{data.stats.poolSize}</div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> Applications Received (6 Mo)</h3>
          <div className="h-64">
            {data.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-gray-400">No recent applications data.</div>}
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity size={18} className="text-indigo-500"/> Hiring Funnel</h3>
          <div className="h-64">
            {data.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}}/>
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-gray-400">No funnel data available.</div>}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase size={18} className="text-amber-500"/> Job Performance (Top 5)</h3>
          <div className="h-64">
            {data.jobPerfData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobPerfData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false}/>
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 'bold'}} width={100}/>
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                  <Bar dataKey="apps" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-gray-400">No job performance data.</div>}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><MessageSquare size={18} className="text-purple-500"/> Action Items</h3>
          <div className="flex-1 space-y-3">
            {data.stats.msgs > 0 && (
               <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                 <div>
                   <h4 className="font-bold text-purple-900 text-sm">Unread Messages</h4>
                   <p className="text-xs text-purple-700">You have {data.stats.msgs} unread candidate messages.</p>
                 </div>
                 <button onClick={()=>router.push('/company/messages')} className="bg-white text-purple-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-purple-200">View Inbox</button>
               </div>
            )}
            {data.stats.activeJobs === 0 && (
               <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                 <div>
                   <h4 className="font-bold text-amber-900 text-sm">No Active Jobs</h4>
                   <p className="text-xs text-amber-700">Post a job to start receiving candidates.</p>
                 </div>
                 <button onClick={()=>router.push('/company/jobs/create')} className="bg-white text-amber-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-200">Post Job</button>
               </div>
            )}
            {data.stats.activeJobs > 0 && data.stats.msgs === 0 && (
               <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 h-full text-center">
                 <CheckCircle size={32} className="text-emerald-400 mb-3"/>
                 <h4 className="font-bold text-slate-800">All Caught Up!</h4>
                 <p className="text-xs text-slate-500 max-w-xs mt-1">Your pipelines are active and there are no pending urgent items to review.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
