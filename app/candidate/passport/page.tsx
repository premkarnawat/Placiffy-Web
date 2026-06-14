'use client';
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
        const { data: intel } = await supabase.from('resume_intelligence_reports').select('ats_resume_score').eq('candidate_id', cand.id).single();



        // Map real db data to PassportShowcase prop
        const profile = cand.candidate_profiles?.[0] || {};
        
        // Parse skills robustly since they might be stored as a postgres array string "['Python', 'C++']"
        let parsedSkills = [];
        try {
          if (typeof cand.skills === 'string') {
            parsedSkills = JSON.parse(cand.skills.replace(/'/g, '"'));
          } else if (Array.isArray(cand.skills)) {
            parsedSkills = cand.skills;
          }
        } catch(e) {}
        
        if (parsedSkills.length === 0) parsedSkills = null;

        setData({
          candidate_id: cand.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate',
          role: cand.headline || profile.current_job_role || 'Professional',
          trust_score: cand.trust_score || 0,
          ats_score: cand.profile_completion_pct || 0,
          resume_intel_score: intel?.ats_resume_score || null,
          profile_photo_url: cand.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          skills: parsedSkills, // Will fall back to empty array in UI if null
          experience_years: cand.experience_years || 0,
          summary: cand.summary || "No professional summary provided.",
          location: cand.location || profile.city || 'Remote',
          current_job_role: profile.current_job_role || 'Seeking Opportunities'
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
