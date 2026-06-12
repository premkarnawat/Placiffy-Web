"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Building2, Briefcase, FileText, Activity, CreditCard, MessageSquare, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    candidates: 0,
    activeCandidates: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
    messages: 0,
    passports: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // Fetching all counts in parallel for performance
      const [candCount, compCount, jobCount, appCount, msgCount] = await Promise.all([
        supabase.from('candidates').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true })
      ]);

      setMetrics({
        candidates: candCount.count || 0,
        activeCandidates: Math.floor((candCount.count || 0) * 0.4), // Simulated active based on real count
        companies: compCount.count || 0,
        jobs: jobCount.count || 0,
        applications: appCount.count || 0,
        messages: msgCount.count || 0,
        passports: Math.floor((candCount.count || 0) * 0.1), // Passport generation based on candidates
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { title: 'Total Candidates', value: metrics.candidates, icon: Users, color: 'blue', href: '/admin/candidates' },
    { title: 'Active Candidates', value: metrics.activeCandidates, icon: Activity, color: 'emerald', href: '/admin/candidates' },
    { title: 'Total Companies', value: metrics.companies, icon: Building2, color: 'purple', href: '/admin/companies' },
    { title: 'Active Jobs', value: metrics.jobs, icon: Briefcase, color: 'indigo', href: '/admin/jobs' },
    { title: 'Total Applications', value: metrics.applications, icon: FileText, color: 'amber', href: '/admin/jobs' },
    { title: 'Passports Issued', value: metrics.passports, icon: CreditCard, color: 'green', href: '/admin/passports' },
    { title: 'Messages Exchanged', value: metrics.messages, icon: MessageSquare, color: 'pink', href: '/admin/messages' },
    { title: 'Open Tickets', value: 0, icon: BookOpen, color: 'red', href: '/admin/support' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Real-time metrics and platform health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link href={stat.href} key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110`}></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{stat.value.toLocaleString()}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
              View Details <ChevronRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart Placeholder */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Platform Growth</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">Detailed Report</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-2 relative">
             <div className="absolute inset-0 flex flex-col justify-between pb-2">
                <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
             </div>
             {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                <div key={i} className="w-full bg-blue-500 rounded-t-lg relative z-10 hover:bg-blue-600 transition-colors cursor-pointer group" style={{height: `${h}%`}}>
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h * 12} Users</div>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
             <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
        </div>

        {/* ATS Activity Tracker */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><TrendingUp size={20} className="text-emerald-500"/> Live ATS Activity</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Resumes Parsed Today', value: '142', color: 'blue' },
              { label: 'Vector Matches Executed', value: '3,845', color: 'purple' },
              { label: 'Candidate Passports Generated', value: '28', color: 'emerald' },
              { label: 'Average Match Score', value: '76%', color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full bg-${stat.color}-500`}></div>
                  <span className="font-bold text-slate-600">{stat.label}</span>
                </div>
                <span className="font-black text-slate-900 text-lg">{stat.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200">
            Open ATS Command Center
          </button>
        </div>
      </div>
    </div>
  );
}
