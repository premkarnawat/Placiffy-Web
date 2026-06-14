content = """'use client';
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
        const [intel, edu, proj, cert, verif] = await Promise.all([
           supabase.from('resume_intelligence_reports').select('ats_resume_score').eq('candidate_id', cand.id).single(),
           supabase.from('candidate_education').select('*').eq('candidate_id', cand.id).order('end_date', { ascending: false }),
           supabase.from('candidate_projects').select('*').eq('candidate_id', cand.id),
           supabase.from('candidate_certifications').select('*').eq('candidate_id', cand.id),
           supabase.from('candidate_verifications').select('status').eq('candidate_id', cand.id).single()
        ]);

        const profile = cand.candidate_profiles?.[0] || {};
        
        let parsedSkills = [];
        try {
          if (typeof cand.skills === 'string') {
            parsedSkills = JSON.parse(cand.skills.replace(/'/g, '"'));
          } else if (Array.isArray(cand.skills)) {
            parsedSkills = cand.skills;
          }
        } catch(e) {}
        
        if (parsedSkills.length === 0) parsedSkills = null;

        const eduSummary = edu.data?.map(e => `- ${e.degree} at ${e.institution} (${e.start_date || 'N/A'} - ${e.end_date || 'Present'})`).join('\\n') || null;
        const projSummary = proj.data?.map(p => `- ${p.name}: ${p.description || 'No description'}`).join('\\n') || null;
        const certSummary = cert.data?.map(c => `- ${c.name} by ${c.issuer}`).join('\\n') || null;

        const isRecentlyActive = cand.last_active_at ? (new Date().getTime() - new Date(cand.last_active_at).getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
        const activityScore = isRecentlyActive ? 10 : 5;

        setData({
          candidate_id: cand.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate',
          role: cand.headline || profile.current_job_role || 'Professional',
          trust_score: cand.trust_score || 0,
          ats_score: cand.profile_completion_pct || 0,
          resume_intel_score: intel.data?.ats_resume_score || null,
          profile_photo_url: cand.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          skills: parsedSkills,
          experience_years: cand.experience_years || 0,
          summary: cand.summary || "No professional summary provided.",
          location: cand.location || profile.city || 'Remote',
          current_job_role: profile.current_job_role || 'Seeking Opportunities',
          
          activity_score: activityScore,
          verification_status: cand.verification_badge ? 'Verified' : (verif.data?.status || 'Pending'),
          education_summary: eduSummary,
          project_summary: projSummary,
          certification_summary: certSummary,
        });

        // Auto-sync passport table
        const { data: existingPassport } = await supabase.from('passports').select('id').eq('candidate_id', cand.id).maybeSingle();
        if (existingPassport) {
           await supabase.from('passports').update({
             trust_score: cand.trust_score || 0,
             verification_status: cand.verification_badge ? 'Verified' : (verif.data?.status || 'Pending'),
             last_generated_at: new Date().toISOString()
           }).eq('id', existingPassport.id);
        } else {
           await supabase.from('passports').insert({
             candidate_id: cand.id,
             trust_score: cand.trust_score || 0,
             verification_status: cand.verification_badge ? 'Verified' : (verif.data?.status || 'Pending'),
             last_generated_at: new Date().toISOString()
           });
        }
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
with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Rewrote passport page to fix mangled file")
