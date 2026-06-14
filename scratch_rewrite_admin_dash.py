content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, Building2, Briefcase, FileText, Activity, 
  MessageSquare, ChevronRight, TrendingUp, ShieldCheck, HelpCircle 
} from 'lucide-react';
import Link from 'next/link';
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();

    // Realtime Enforcement
    const channel = supabase.channel('admin_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'passports' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        candCount, compCount, jobCount, appRes, msgCount, 
        ticketRes, passportRes
      ] = await Promise.all([
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('verification_status'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
        supabase.from('applications').select('status, applied_at'),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('support_tickets').select('status, created_at'),
        supabase.from('passports').select('verification_status, created_at')
      ]);

      const apps = appRes.data || [];
      const tickets = ticketRes.data || [];
      const passports = passportRes.data || [];
      const comps = compCount.data || [];

      // Funnel Calculation
      const funnel = {
        applied: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interviewing: apps.filter(a => a.status === 'interviewing').length,
        offered: apps.filter(a => a.status === 'offered').length,
        joined: apps.filter(a => a.status === 'joined').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
      };

      // Verifications
      const pendingCands = passports.filter(p => p.verification_status === 'Pending').length;
      const verifiedCands = passports.filter(p => p.verification_status === 'Verified').length;
      const pendingComps = comps.filter(c => c.verification_status === 'Pending').length;
      const verifiedComps = comps.filter(c => c.verification_status === 'Verified').length;

      // Tickets
      const openTickets = tickets.filter(t => t.status === 'Open').length;

      // Mocking past 7 days trend for apps based on actual data
      const now = new Date();
      const trendData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const dayApps = apps.filter(a => (a.applied_at || '').startsWith(dateStr)).length;
        const dayPassports = passports.filter(p => (p.created_at || '').startsWith(dateStr)).length;
        
        trendData.push({
          name: d.toLocaleDateString(undefined, { weekday: 'short' }),
          Applications: dayApps,
          Passports: dayPassports
        });
      }

      setData({
        counts: {
          candidates: candCount.count || 0,
          companies: comps.length,
          jobs: jobCount.count || 0,
          messages: msgCount.count || 0,
          passports: passports.length,
          tickets: tickets.length
        },
        funnel,
        verifications: {
          pendingCands, verifiedCands, pendingComps, verifiedComps
        },
        openTickets,
        trendData
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-500 mt-1">Realtime analytics and system metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
          <Activity size={16} className="animate-pulse" /> Live Sync Active
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Candidates', value: data.counts.candidates, icon: Users, color: 'blue', link: '/admin/candidates' },
          { label: 'Total Companies', value: data.counts.companies, icon: Building2, color: 'purple', link: '/admin/companies' },
          { label: 'Active Jobs', value: data.counts.jobs, icon: Briefcase, color: 'emerald', link: '/admin/jobs' },
          { label: 'Total Applications', value: data.funnel.applied, icon: FileText, color: 'amber', link: '/admin/analytics' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.link} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-gray-500 transition-colors" size={20}/>
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verification Status */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-indigo-600"/> Verification Queue</h2>
          
          <div className="space-y-4 flex-1">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">Candidates</span>
                <Link href="/admin/verification" className="text-xs font-bold text-indigo-600 hover:underline">Review</Link>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600 font-bold">{data.verifications.pendingCands} Pending</span>
                <span className="text-emerald-600 font-bold">{data.verifications.verifiedCands} Verified</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">Companies</span>
                <Link href="/admin/verification" className="text-xs font-bold text-indigo-600 hover:underline">Review</Link>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600 font-bold">{data.verifications.pendingComps} Pending</span>
                <span className="text-emerald-600 font-bold">{data.verifications.verifiedComps} Verified</span>
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 border border-red-100 mt-auto">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-900 flex items-center gap-2"><HelpCircle size={16}/> Open Tickets</span>
                <span className="text-xl font-black text-red-600">{data.openTickets}</span>
              </div>
              <Link href="/admin/support" className="text-xs font-bold text-red-600 hover:underline mt-1 block">Go to Support Center</Link>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="text-blue-600"/> 7-Day Platform Activity</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="Applications" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Passports" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Funnel */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Global Hiring Funnel</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {[
              { label: 'Applied', count: data.funnel.applied, color: 'bg-blue-500' },
              { label: 'Shortlisted', count: data.funnel.shortlisted, color: 'bg-indigo-500' },
              { label: 'Interviewing', count: data.funnel.interviewing, color: 'bg-purple-500' },
              { label: 'Offered', count: data.funnel.offered, color: 'bg-emerald-500' },
              { label: 'Joined', count: data.funnel.joined, color: 'bg-teal-600' },
            ].map((stage, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${stage.color}`}></div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stage.label}</div>
                <div className="text-2xl font-black text-gray-900">{stage.count}</div>
                <div className="text-[10px] font-bold text-gray-400 mt-2">
                  {data.funnel.applied > 0 ? Math.round((stage.count / data.funnel.applied) * 100) : 0}% of Total
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Dashboard Analytics rebuilt")
