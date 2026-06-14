content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Activity, ShieldCheck, Zap, Briefcase, MessageSquare, 
  TrendingUp, ChevronRight, Lock, Sparkles, Bell, Clock, 
  CheckCircle2, XCircle, Award 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();

      const channel = supabase.channel(`dash_realtime_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchDashboardData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user?.id).single();
      if (!cand) return;

      const [appsRes, msgsRes, notifsRes, intelRes, passRes] = await Promise.all([
        supabase.from('applications').select('status, applied_at, ats_score').eq('candidate_id', cand.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('is_read', false),
        supabase.from('resume_intelligence_reports').select('ats_resume_score').eq('candidate_id', cand.id).single(),
        supabase.from('passports').select('verification_status').eq('candidate_id', cand.id).maybeSingle()
      ]);

      const apps = appsRes.data || [];
      const appCount = apps.length;
      const shortlistCount = apps.filter(a => a.status === 'shortlisted').length;
      const interviewCount = apps.filter(a => a.status === 'interviewing').length;
      const offerCount = apps.filter(a => ['offered', 'joined'].includes(a.status)).length;
      const rejectedCount = apps.filter(a => a.status === 'rejected').length;

      // Status Pie Chart Data
      const pieData = [
        { name: 'Applied', value: apps.filter(a => a.status === 'applied').length, color: '#3b82f6' },
        { name: 'Shortlisted', value: shortlistCount, color: '#eab308' },
        { name: 'Interviewing', value: interviewCount, color: '#a855f7' },
        { name: 'Offered', value: offerCount, color: '#22c55e' },
        { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
      ].filter(d => d.value > 0);

      // App Trend Data (Last 6 Months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap: any = {};
      apps.forEach(a => {
         const date = new Date(a.applied_at);
         const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
         trendMap[key] = (trendMap[key] || 0) + 1;
      });
      const trendData = Object.keys(trendMap).slice(-6).map(k => ({ name: k, applications: trendMap[k] }));

      // Activity Score
      const isRecentlyActive = cand.last_active_at ? (new Date().getTime() - new Date(cand.last_active_at).getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
      const activityScore = isRecentlyActive ? 10 : 5;

      // Generate Dynamic Suggestions
      const dynamicInsights = [];
      const profilePct = cand.profile_completion_pct || 0;
      if (profilePct < 100) {
         dynamicInsights.push({ title: 'Complete your profile', desc: 'Your profile is missing key details. A 100% profile doubles your ATS ranking.', action: 'Edit Profile', link: '/candidate/profile/edit', color: 'blue' });
      }
      if (!cand.verification_badge) {
         dynamicInsights.push({ title: 'Verify Identity', desc: 'You are currently unverified. Verifying your Govt ID unlocks the Trust Passport.', action: 'Start Verification', link: '/candidate/verification', color: 'amber' });
      }
      if (!cand.candidate_profiles?.[0]?.github_url) {
         dynamicInsights.push({ title: 'Add GitHub/Portfolio', desc: 'Linking external portfolios boosts your Trust Score by +5 points.', action: 'Add Link', link: '/candidate/profile/edit', color: 'purple' });
      }
      if (intelRes.data?.ats_resume_score && intelRes.data.ats_resume_score < 75) {
         dynamicInsights.push({ title: 'Improve Resume ATS', desc: `Your resume score is ${intelRes.data.ats_resume_score}%. Fix missing keywords to rank higher.`, action: 'View Report', link: '/candidate/resume-intelligence', color: 'red' });
      }
      if (interviewCount > 0) {
         dynamicInsights.push({ title: 'Interviews Scheduled', desc: `You have ${interviewCount} active interview tracks. Stay prepared!`, action: 'View Applications', link: '/candidate/applications', color: 'green' });
      }

      setData({
        cand,
        stats: {
           appCount, shortlistCount, interviewCount, offerCount,
           msgCount: msgsRes.count || 0,
           notifCount: notifsRes.count || 0,
           activityScore,
           atsScore: intelRes.data?.ats_resume_score || 0,
           trustScore: cand.trust_score || 0,
           profilePct,
           verificationStatus: cand.verification_badge ? 'Verified' : (passRes.data?.verification_status || 'Unverified')
        },
        pieData,
        trendData,
        insights: dynamicInsights
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <span className="ml-3 text-slate-500 font-bold tracking-widest uppercase">Initializing Dashboard</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {data.cand?.first_name || data.cand?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}</h1>
          <p className="text-gray-500 mt-1">Here is your Candidate Operating System real-time overview.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={()=>router.push('/candidate/notifications')} className="relative p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50">
             <Bell size={20} className="text-slate-600"/>
             {data.stats.notifCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
           </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
           <ShieldCheck className="absolute -right-6 -bottom-6 text-white opacity-10" size={100}/>
           <div>
             <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Trust Score</div>
             <div className="text-4xl font-black">{data.stats.trustScore}</div>
           </div>
           <div className="mt-4 flex items-center gap-2">
             <span className={`px-2 py-1 rounded text-xs font-bold ${data.stats.verificationStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
               {data.stats.verificationStatus}
             </span>
             <button onClick={()=>router.push('/candidate/trust-score')} className="text-xs text-blue-300 hover:text-white font-bold ml-auto flex items-center">
               View <ChevronRight size={14}/>
             </button>
           </div>
        </div>

        <div className="col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-blue-200 transition-colors" onClick={()=>router.push('/candidate/resume-intelligence')}>
           <div>
             <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Zap size={14} className="text-amber-500"/> ATS Intel</div>
             <div className="text-4xl font-black text-slate-900">{data.stats.atsScore}%</div>
           </div>
           <div className="mt-4 flex items-center justify-between">
             <div className="w-full bg-slate-100 h-1.5 rounded-full mr-4">
               <div className="bg-blue-600 h-1.5 rounded-full" style={{width: `${data.stats.atsScore}%`}}></div>
             </div>
             <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500"/>
           </div>
        </div>

        <div className="col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-colors" onClick={()=>router.push('/candidate/applications')}>
           <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Briefcase size={24}/></div>
           <div>
             <div className="text-3xl font-black text-slate-900">{data.stats.appCount}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applications</div>
           </div>
        </div>

        <div className="col-span-1 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50" onClick={()=>router.push('/candidate/messages')}>
           <MessageSquare size={20} className="text-purple-500 mb-2"/>
           <div className="text-2xl font-black text-slate-900">{data.stats.msgCount}</div>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inbox</div>
        </div>

        <div className="col-span-1 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
           <Activity size={20} className="text-cyan-500 mb-2"/>
           <div className="text-2xl font-black text-slate-900">{data.stats.activityScore}/10</div>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activity</div>
        </div>
      </div>

      {/* Analytics & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-slate-900 mb-6">Application Analytics</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="h-64">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Applications Over Time</h3>
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
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">Not enough data to map trends.</div>
               )}
             </div>
             
             <div className="h-64">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Pipeline Conversion</h3>
               {data.pieData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={data.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                       {data.pieData.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                     <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold', color: '#64748b'}}/>
                   </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">No pipeline data available.</div>
               )}
             </div>
           </div>
        </div>

        {/* Dynamic Action Items */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Sparkles size={20} className="text-amber-500"/> Action Items</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{data.insights.length} Pending</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.insights.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-100">
                <CheckCircle2 size={40} className="text-emerald-400 mb-3" />
                <h3 className="text-slate-800 font-bold mb-1">All Caught Up!</h3>
                <p className="text-slate-500 text-sm">Your profile and verification status are fully optimized for ATS matching.</p>
              </div>
            ) : (
              data.insights.map((insight: any, idx: number) => (
                <div key={idx} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-${insight.color}-300 transition-colors`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${insight.color}-400`}></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{insight.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                  <button onClick={()=>router.push(insight.link)} className={`self-start text-xs font-bold px-4 py-2 rounded-lg bg-${insight.color}-50 text-${insight.color}-700 hover:bg-${insight.color}-100 transition-colors`}>
                    {insight.action}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
"""
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Rewrote candidate dashboard")
