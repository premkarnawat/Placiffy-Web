"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { GlassCard } from '../glass-card';
import { Shield, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/analytics')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(() => {
        // Fallback static data if backend is offline in browser preview
        setData({
          pipeline_stages: [
            { name: "Applied", count: 48 },
            { name: "Matched", count: 32 },
            { name: "Interested", count: 21 },
            { name: "Verification", count: 16 },
            { name: "Verified", count: 12 }
          ],
          score_distribution: [
            { score: "50-60", candidates: 2 },
            { score: "60-70", candidates: 5 },
            { score: "70-80", candidates: 14 },
            { score: "80-90", candidates: 19 },
            { score: "90-100", candidates: 8 }
          ],
          reliability_speed_mins: [
            { month: "Jan", mins: 25 },
            { month: "Feb", mins: 19 },
            { month: "Mar", mins: 15 },
            { month: "Apr", mins: 12 },
            { month: "May", mins: 10 }
          ],
          fraud_risk_shares: [
            { name: "Low Risk", value: 94 },
            { name: "Medium Risk", value: 5 },
            { name: "High Risk", value: 1 }
          ]
        });
      });
  }, []);

  if (!data) return <div className="text-center py-12 text-slate-500 text-xs">Loading analytics data...</div>;

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Pipeline Conversion */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Hiring Pipeline Funnel</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Applicant stages count breakdown</p>
            </div>
            <span className="p-2 bg-orange-500/10 text-orange-450 border border-orange-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pipeline_stages}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Reliability Speeds */}
        <GlassCard glow>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Average Candidate Response Speeds</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Average time in minutes to accept/respond</p>
            </div>
            <span className="p-2 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.reliability_speed_mins}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="mins" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 3: Score Distribution */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Trust Score Distribution</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Spread of trust scores across talent networks</p>
            </div>
            <span className="p-2 bg-violet-500/10 text-violet-440 border border-violet-500/20 rounded-lg">
              <Shield className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.score_distribution}>
                <XAxis dataKey="score" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="candidates" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 4: Fraud Risks Shares */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Verified Fraud Assessment Levels</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Fraud check pass rates distribution</p>
            </div>
            <span className="p-2 bg-rose-500/10 text-rose-450 border border-rose-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.fraud_risk_shares}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.fraud_risk_shares.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
