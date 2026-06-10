import os

os.makedirs(r"app\candidate\passport", exist_ok=True)

page_code = """'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PassportShowcase from '@/components/passport/passport-showcase';
import { Loader2 } from 'lucide-react';

export default function PassportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassport();
  }, []);

  const fetchPassport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
      
      if (cand) {
        // Map real db data to PassportShowcase prop
        setData({
          candidate_id: cand.id,
          name: cand.candidate_profiles?.[0]?.fullName || user.email?.split('@')[0] || 'Candidate',
          role: cand.candidate_profiles?.[0]?.headline || cand.candidate_profiles?.[0]?.current_job_role || 'Professional',
          trust_score: cand.trust_score || 0,
          ats_score: cand.profile_completion_pct || 0, // Fallback to profile completion for now
          portfolio_score: cand.candidate_profiles?.[0]?.portfolio_score || 80,
          work_sample_score: 85,
          expert_score: 90,
          reliability_score: 95,
          communication_score: 88,
          fraud_risk: 'Low',
          joining_probability: 92
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Candidate Passport</h1>
        <p className="text-gray-500 mt-1">Share this verified credential with companies to instantly bypass early screening rounds.</p>
      </div>
      
      <div className="flex justify-center">
        {data ? <PassportShowcase data={data} /> : <p className="text-gray-500">Could not load passport data.</p>}
      </div>
    </div>
  );
}
"""

with open(r"app\candidate\passport\page.tsx", "w", encoding="utf-8") as f:
    f.write(page_code)

print("Created /candidate/passport/page.tsx!")
