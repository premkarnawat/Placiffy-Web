"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Shield, Clock, ChevronRight, Award, FileText, Calendar, Building, MapPin, Briefcase, Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

export default function CandidateDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, jobsRes] = await Promise.all([
          fetch(`${API_URL}/api/candidates/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/candidates/matched-jobs`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (dashRes.ok) setData(await dashRes.json());
        if (jobsRes.ok) setJobs(await jobsRes.json());
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const profilePct = data?.profile_completion || 20;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Welcome Back, {user?.name?.split(' ')[0] || 'Candidate'}</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Your technical profile is performing well. We've identified {jobs.length || 0} new roles that match your skill set and career trajectory.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
              <Shield size={14} /> {data?.verification_status || 'Verified Professional'}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
              <Clock size={14} /> Last active: {data?.last_active || 'Just now'}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-5 min-w-[280px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <path strokeDasharray={`${profilePct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1A56DB" strokeWidth="4" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <span className="absolute text-sm font-bold text-blue-700">{profilePct}%</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Profile Completion</h3>
            <p className="text-xs text-gray-500 mt-1">Increase to 80% to unlock apps.</p>
            <a href="/candidate/profile" className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 mt-2">
              Update Now <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Award size={20} /></div>
            <span className="text-xs font-medium text-gray-500">Top 5%</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">ATS Match Score</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-blue-700">{data?.ats_score || 0}%</h2>
            <span className="text-xs font-medium text-green-600">+2.4%</span>
          </div>
          <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${data?.ats_score || 0}%` }}></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Shield size={20} /></div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">PREMIUM</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Trust Score</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-bold text-gray-900">{data?.trust_score || 0}</h2>
            <span className="text-sm text-gray-500 font-medium">/10</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">High institutional reliability</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText size={20} /></div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Applied Jobs</p>
          <h2 className="text-4xl font-bold text-gray-900">{data?.applied_jobs || 0}</h2>
          <div className="flex gap-1 mt-4">
            <div className="h-1 bg-purple-200 rounded flex-1"></div>
            <div className="h-1 bg-purple-200 rounded flex-1"></div>
            <div className="h-1 bg-purple-600 rounded flex-1"></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Calendar size={20} /></div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Interviews</p>
          <h2 className="text-4xl font-bold text-gray-900">{String(data?.interviews || 0).padStart(2, '0')}</h2>
          <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> 2 pending scheduling
          </p>
        </motion.div>
      </div>

      {/* Matched Jobs */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Jobs Matched For You</h2>
            <p className="text-sm text-gray-500 mt-1">Powered by our 'Identity Intelligence' matching engine.</p>
          </div>
          <a href="/candidate/jobs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View All Matches <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.length > 0 ? jobs.map((job: any, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} 
              className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow ${i===1 ? 'border-blue-500 ring-1 ring-blue-500 border-l-4' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {job.companies?.logo_url ? <img src={job.companies.logo_url} alt="" /> : <Building size={20} className="text-gray-400" />}
                </div>
                <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100 text-center leading-tight">
                  {job.match_percentage || 90}%<br/><span className="text-[10px] font-medium text-blue-600">Match</span>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 text-base mb-1">{job.title}</h3>
              <p className="text-sm text-gray-600 font-medium mb-4">{job.companies?.name || 'Company Name'}</p>
              
              <div className="space-y-2 mb-5 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={14} className="text-gray-400" /> {job.location || 'Remote'}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Briefcase size={14} className="text-gray-400" /> ${job.salary_min/1000}k - ${job.salary_max/1000}k
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(job.required_skills || []).slice(0, 3).map((skill: string, j: number) => (
                  <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md">{skill}</span>
                ))}
              </div>
              
              <div className="mt-auto">
                <button 
                  disabled={profilePct < 80}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${profilePct >= 80 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Apply Now
                </button>
                {profilePct < 80 && <p className="text-center text-[10px] text-red-500 font-medium mt-2">Complete 80% of your profile to unlock applications</p>}
              </div>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
              <p className="text-gray-500">No jobs matched yet. Complete your profile to get matches.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insight */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-blue-600 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider mb-2">
            <Sparkles size={16} /> PLACIFY AI INSIGHT
          </div>
          <p className="text-gray-700 text-sm leading-relaxed max-w-3xl">
            Based on your recent certification in "Distributed Architecture", you are now in the top 2% of candidates for 14 active "Principal Engineer" roles in our network. Update your Passport to verify this skill.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-2.5 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
          Verify New Skill
        </button>
      </motion.div>

    </div>
  );
}
