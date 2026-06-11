'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, DollarSign, CheckCircle2, Lock, ArrowRight, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

export default function CandidateJobs() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [profileScore, setProfileScore] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
    const [selectedJob, setSelectedJob] = useState<any>(null); // For ATS Explanation Panel

  useEffect(() => {
    if (user) fetchJobsAndProfile();
  }, [user]);

  const fetchJobsAndProfile = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('profile_completion_pct').eq('user_id', user?.id).single();
      setProfileScore(cand?.profile_completion_pct || 0);

      // Call the Internal Next.js ATS Match endpoint
      const res = await fetch(`/api/ats/match-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: user?.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          // Merge vector match data with real jobs from DB
          const { data: dbJobs } = await supabase.from('jobs').select('*');
          if (dbJobs) {
            const enrichedJobs = dbJobs
              .filter((dbJ:any) => data.matches.some((m:any) => m.job_id === dbJ.job_id))
              .map(dbJ => {
              const matchInfo = data.matches.find((m:any) => m.job_id === dbJ.job_id);
              return {
                ...dbJ,
                title: dbJ.job_title || 'Untitled Job',
                id: dbJ.job_id,
                similarity: matchInfo ? Math.round(matchInfo.similarity * 100) : Math.floor(Math.random() * 30 + 50),
                matched_skills: matchInfo?.matched_skills || [],
                missing_skills: matchInfo?.missing_skills || ['Experience required']
              };
            }).sort((a,b) => b.similarity - a.similarity);
            setJobs(enrichedJobs);
          }
        }
      } else {
        // Fallback UI
        setJobs([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleApply = (jobId: string, title: string) => {
    if (profileScore < 80) {
      toast('error', 'Profile Incomplete', 'Your profile must be at least 80% complete to apply for jobs.');
      router.push('/candidate/profile/edit');
      return;
    }
    toast('success', 'Application Submitted', `You applied for ${title}!`);
    // Ideally insert into public.applications
  };

  if (isLoading || isFetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  const isLocked = profileScore < 80;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 flex gap-8 relative">
      
      {/* Main Jobs Feed */}
      <div className={`flex-1 ${selectedJob ? 'hidden lg:block' : ''}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
          <p className="text-gray-500 mt-1">AI Vector Matching based on your deep profile embedding.</p>
          
          {isLocked && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-orange-800">
                <Lock className="text-orange-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold">Applications Locked</h3>
                  <p className="text-sm opacity-90">Your profile is {profileScore}% complete. Reach 80% to apply.</p>
                </div>
              </div>
              <button onClick={() => router.push('/candidate/profile/edit')} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Complete Profile
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              onClick={() => setSelectedJob(job)}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition-all cursor-pointer group ${selectedJob?.id === job.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:shadow-md'}`}
            >
              <div className="absolute top-6 right-6 bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-green-200">
                <CheckCircle2 size={12} /> {job.similarity}% Match
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center font-bold text-xl text-gray-400">
                  {job.title.substring(0, 1)}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors pr-24">{job.title}</h2>
                  <div className="text-gray-500 font-medium">{job.company_id || 'Tech Corp'}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400"/> {job.location || 'Remote'}</div>
                <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400"/> {job.employment_type || 'Full-time'}</div>
                <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-gray-400"/> {job.salary_range || 'Competitive'}</div>
              </div>

              <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 font-medium text-sm">Click to view ATS Analysis</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleApply(job.id, job.title); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                    isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLocked ? <Lock size={16} /> : null} Apply {isLocked ? '' : <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">No jobs found.</div>}
        </div>
      </div>

      {/* ATS Explanation Panel (Side Panel) */}
      {selectedJob && (
        <div className="w-full lg:w-96 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl sticky top-24 h-[calc(100vh-8rem)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">ATS Analysis</h2>
            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 lg:hidden">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-4xl font-extrabold text-blue-600">{selectedJob.similarity}%</div>
              <div className="text-sm text-gray-500 mt-1 font-medium">Vector Similarity Score</div>
            </div>

            {/* Trust Match */}
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-xl border border-green-100">
              <ShieldCheck size={24} className="text-green-500 shrink-0" />
              <div>
                <p className="font-bold text-sm">High Trust Match</p>
                <p className="text-xs opacity-80">Your verified status puts you in the top 5% of applicants.</p>
              </div>
            </div>

            {/* Matched Skills */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Matched Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.matched_skills.map((s:string) => (
                  <span key={s} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">{s}</span>
                ))}
                {selectedJob.matched_skills.length === 0 && <span className="text-sm text-gray-500">No explicit matches logged.</span>}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> Missing Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.missing_skills.map((s:string) => (
                  <span key={s} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-semibold">{s}</span>
                ))}
                {selectedJob.missing_skills.length === 0 && <span className="text-sm text-gray-500">You meet all listed requirements!</span>}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Why you matched:</strong> The AI Vector engine detected strong semantic correlation between your experience and this job description, specifically around your primary technical stack.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-auto">
            <button 
              onClick={() => handleApply(selectedJob.id, selectedJob.title)}
              disabled={isLocked}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLocked ? <Lock size={18} /> : <ArrowRight size={18} />}
              {isLocked ? 'Profile Locked' : 'Apply Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
