'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, DollarSign, Clock, CheckCircle2, Lock, ArrowRight, Loader2, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CandidateJobs() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [profileScore, setProfileScore] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchJobsAndProfile();
    }
  }, [user]);

  const calculateCompletion = (candidate: any, userData: any) => {
    let score = 0;
    if (userData?.name && candidate?.phone) score += 10;
    if (candidate?.industry) score += 10;
    if (candidate?.skills && candidate.skills.length > 5) score += 10;
    if (candidate?.linkedin_url) score += 10;
    if (candidate?.current_role) score += 10;
    if (candidate?.experience_years) score += 10;
    if (candidate?.location) score += 10;
    // Add additional logic for education, experience etc when those tables are fully populated
    // For now, if they have basic details + parsed resume, give them 85%
    if (candidate?.headline && candidate?.skills) score += 30;
    return Math.min(score + 10, 100); // 10 base points
  };

  const fetchJobsAndProfile = async () => {
    try {
      // 1. Fetch Profile to get Score
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { data: usr } = await supabase.from('users').select('*').eq('id', user?.id).single();
      
      const score = calculateCompletion(cand, usr);
      setProfileScore(score);

      // 2. Fetch Jobs (Mocking fetching from public.jobs if it exists, else hardcoded for UI)
      // Since we don't know the jobs schema yet, we'll mock some rich job data
      const mockJobs = [
        { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Remote', salary: '$140k - $180k', type: 'Full-time', posted: '2 days ago', match: 94 },
        { id: '2', title: 'Product Designer (UI/UX)', company: 'Airbnb', location: 'San Francisco, CA', salary: '$120k - $160k', type: 'Full-time', posted: '5 hours ago', match: 88 },
        { id: '3', title: 'Data Scientist', company: 'Netflix', location: 'Remote', salary: '$150k - $200k', type: 'Full-time', posted: '1 day ago', match: 82 },
        { id: '4', title: 'Backend Developer (Python)', company: 'Stripe', location: 'New York, NY', salary: '$130k - $170k', type: 'Full-time', posted: '3 days ago', match: 75 },
      ];
      setJobs(mockJobs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleApply = (jobTitle: string) => {
    if (profileScore < 80) {
      toast('error', 'Profile Incomplete', 'Your profile must be at least 80% complete to apply for jobs.');
      router.push('/candidate/profile/edit');
      return;
    }
    toast('success', 'Application Submitted', `You have successfully applied for ${jobTitle}!`);
  };

  if (isLoading || isFetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  const isLocked = profileScore < 80;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header & Guard Warning */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
        <p className="text-gray-500 mt-1">Based on your industry, skills, and preferences.</p>
        
        {isLocked && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-orange-800">
              <Lock className="text-orange-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold">Applications Locked</h3>
                <p className="text-sm opacity-90">Your profile is only {profileScore}% complete. You need 80% to apply for jobs.</p>
              </div>
            </div>
            <button onClick={() => router.push('/candidate/profile/edit')} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Complete Profile
            </button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by job title, company, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase())).map((job) => (
          <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            
            {/* Match Badge */}
            <div className="absolute top-6 right-6 bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-green-200">
              <CheckCircle2 size={12} /> {job.match}% Match
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center font-bold text-xl text-gray-400">
                {job.company.substring(0, 1)}
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                <div className="text-gray-500 font-medium">{job.company}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400"/> {job.location}</div>
              <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400"/> {job.type}</div>
              <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-gray-400"/> {job.salary}</div>
              <div className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> {job.posted}</div>
            </div>

            <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
              <button className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">
                View Details
              </button>
              
              <button 
                onClick={() => handleApply(job.title)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                  isLocked 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLocked ? <Lock size={16} /> : null}
                Apply Now {isLocked ? '' : <ArrowRight size={16} />}
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
