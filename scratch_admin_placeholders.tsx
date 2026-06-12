"use client";
import React from 'react';
import { BookOpen, PieChart, Receipt, Search, Settings, Construction } from 'lucide-react';

const Placeholder = ({ title, desc, Icon }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
      <Icon size={40} />
    </div>
    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
    <p className="text-lg text-slate-500 max-w-lg font-medium">{desc}</p>
    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-6 mt-8 max-w-md w-full flex items-start gap-4">
      <Construction size={24} className="shrink-0 mt-0.5" />
      <div className="text-left text-sm font-medium">
        <p className="font-bold text-blue-900 mb-1">Module Scaffolding Complete</p>
        The isolated routing infrastructure for this module is verified. Data binding to Supabase tables will occur in a subsequent phase.
      </div>
    </div>
  </div>
);

export const Support = () => <Placeholder title="Support Ticket Center" desc="Manage help desk tickets from Candidates and Companies." Icon={BookOpen} />;
export const Analytics = () => <Placeholder title="Platform Analytics" desc="Deep-dive into platform growth, revenue, and matching algorithms." Icon={PieChart} />;
export const Billing = () => <Placeholder title="Billing & Subscriptions" desc="Monitor enterprise SaaS subscriptions and candidate upgrades." Icon={Receipt} />;
export const Audit = () => <Placeholder title="Security Audit Logs" desc="Track all changes, auth events, and data mutations securely." Icon={Search} />;
export const AdminSettings = () => <Placeholder title="Platform Settings" desc="Configure platform-wide variables, API keys, and email templates." Icon={Settings} />;
