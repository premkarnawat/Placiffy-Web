content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BarChart as BarChartIcon, TrendingUp, Users, Building2, 
  FileText, Download, Loader2, Calendar 
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // days
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();

    const channel = supabase.channel('admin_analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchAnalytics())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeRange);
      const cutoffIso = cutoffDate.toISOString();

      const [candsRes, compsRes, appsRes] = await Promise.all([
        supabase.from('candidates').select('created_at').gte('created_at', cutoffIso),
        supabase.from('companies').select('created_at').gte('created_at', cutoffIso),
        supabase.from('applications').select('applied_at, status').gte('applied_at', cutoffIso)
      ]);

      const cands = candsRes.data || [];
      const comps = compsRes.data || [];
      const apps = appsRes.data || [];

      // Generate time series
      const series = [];
      const now = new Date();
      for (let i = timeRange - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const displayLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        series.push({
          date: displayLabel,
          Candidates: cands.filter(c => (c.created_at || '').startsWith(dateStr)).length,
          Companies: comps.filter(c => (c.created_at || '').startsWith(dateStr)).length,
          Applications: apps.filter(a => (a.applied_at || '').startsWith(dateStr)).length,
        });
      }

      const totalApplied = apps.length;
      const totalShortlisted = apps.filter(a => a.status === 'shortlisted').length;
      const totalInterviewing = apps.filter(a => a.status === 'interviewing').length;
      const totalOffered = apps.filter(a => a.status === 'offered').length;
      const totalJoined = apps.filter(a => a.status === 'joined').length;

      setData({
        series,
        totals: {
          candidates: cands.length,
          companies: comps.length,
          applications: totalApplied
        },
        funnelData: [
          { name: 'Applied', value: totalApplied },
          { name: 'Shortlisted', value: totalShortlisted },
          { name: 'Interviewing', value: totalInterviewing },
          { name: 'Offered', value: totalOffered },
          { name: 'Joined', value: totalJoined }
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChartIcon className="text-indigo-600" /> Analytics Center
          </h1>
          <p className="text-gray-500 mt-1">Deep dive into platform growth and conversion rates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
            {[7, 30, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${timeRange === days ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {days}D
              </button>
            ))}
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 hover:bg-slate-50">
            <Download size={16}/> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users size={20}/></div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">New Candidates</h3>
          </div>
          <div className="text-4xl font-black text-gray-900">{data?.totals.candidates.toLocaleString()}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Over the last {timeRange} days</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Building2 size={20}/></div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">New Companies</h3>
          </div>
          <div className="text-4xl font-black text-gray-900">{data?.totals.companies.toLocaleString()}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Over the last {timeRange} days</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FileText size={20}/></div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Applications Sent</h3>
          </div>
          <div className="text-4xl font-black text-gray-900">{data?.totals.applications.toLocaleString()}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Over the last {timeRange} days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Registration Growth</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.series}>
                <defs>
                  <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="Candidates" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCand)" strokeWidth={3} />
                <Area type="monotone" dataKey="Companies" stroke="#a855f7" fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Volume Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><FileText className="text-emerald-600"/> Application Volume</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.series}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Applications" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\analytics\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Analytics Center rebuilt")
