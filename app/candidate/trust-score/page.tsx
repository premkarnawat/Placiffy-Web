'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Shield, Briefcase, Zap, AlertTriangle, Info, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function TrustScorePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('trust_score, ats_score, reliability_score, fraud_score, verification_status').eq('user_id', user?.id).single();
      
      // Fetch historical changes (mocking if empty since table might be empty)
      const { data: hist } = await supabase.from('trust_score_history').select('*').eq('candidate_id', user?.id).order('created_at', { ascending: false }).limit(5);

      setData({
        scores: {
          trust: cand?.trust_score || 45,
          ats: cand?.ats_score || 0,
          reliability: cand?.reliability_score || 100,
          fraud: cand?.fraud_score || 0,
          portfolio: 60, // Default mock base until portfolio engine executes
          workSample: 0,
          communication: 85
        },
        status: cand?.verification_status || 'unverified',
        history: hist && hist.length > 0 ? hist : [
          { id: '1', event: 'Initial Profile Creation', impact: '+45', created_at: new Date().toISOString() }
        ]
      });
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching Trust Score', 'Could not load your scores.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const { scores, status, history } = data;
  const isVerified = status === 'verified';

  // SVG Animated Progress Bar Component
  const ProgressBar = ({ label, value, color, max = 100 }: { label: string, value: number, color: string, max?: number }) => (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-2 font-medium">
        <span className="text-gray-700">{label}</span>
        <span className={color.replace('bg-', 'text-')}>{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color} transition-all duration-1500 ease-out`} style={{ width: `${(value / max) * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="text-indigo-600" size={32}/> Trust & Authority Index
          </h1>
          <p className="text-gray-500 mt-1">Your comprehensive ranking engine powering recruiter visibility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Score Radial Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-gray-900 mb-8 self-start w-full">Final Trust Score</h2>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke={scores.trust > 80 ? "#10B981" : scores.trust > 50 ? "#F59E0B" : "#EF4444"} 
                strokeWidth="8" 
                strokeDasharray={`${(scores.trust / 100) * 282.7} 282.7`} 
                strokeLinecap="round" 
                className="transition-all duration-2000 ease-out drop-shadow-md" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-gray-900">{scores.trust}</span>
              <span className={`text-sm font-bold mt-1 ${isVerified ? 'text-green-500' : 'text-gray-400'}`}>{isVerified ? 'RA+ STATUS' : 'PENDING'}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl w-full border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">Your profile is currently in the top <strong className="text-indigo-600">34%</strong> of applicants.</p>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-gray-400"/> Score Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <div>
              <ProgressBar label="Avg. ATS Vector Match" value={scores.ats} color="bg-blue-500" />
              <ProgressBar label="Portfolio Strength" value={scores.portfolio} color="bg-indigo-500" />
              <ProgressBar label="Work Sample Integrity" value={scores.workSample} color="bg-purple-500" />
            </div>
            <div>
              <ProgressBar label="Communication Rating" value={scores.communication} color="bg-cyan-500" />
              <ProgressBar label="Reliability Index" value={scores.reliability} color="bg-green-500" />
              <ProgressBar label="Fraud Risk (Lower is better)" value={scores.fraud} color="bg-red-500" max={100} />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Improvement Suggestions</h3>
            <div className="space-y-3">
              {scores.workSample === 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                  <AlertTriangle size={18} className="shrink-0" />
                  <p className="text-sm font-medium">Complete a Work Sample Test to boost your score by +20 points.</p>
                </div>
              )}
              {!isVerified && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-800 border border-blue-100">
                  <Info size={18} className="shrink-0" />
                  <p className="text-sm font-medium">Trigger Expert Verification to achieve RA+ Status and maximum visibility.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Timeline */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase size={20} className="text-gray-400"/> Historical Changes</h2>
        
        <div className="space-y-4">
          {history.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.impact.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {item.impact.startsWith('+') ? <TrendingUp size={18}/> : <AlertTriangle size={18}/>}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.event}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className={`font-extrabold text-lg ${item.impact.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
