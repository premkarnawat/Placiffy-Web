"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getBackendToken } from '@/lib/backend-auth';
import { User, MapPin, Zap, Star, Search, Filter, Loader2, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";

export default function CandidatePool() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    skills: "",
    location: "",
    minExperience: "",
  });

  const parseSkills = (skillsData: any): string[] => {
      if (!skillsData) return [];
      if (Array.isArray(skillsData)) return skillsData;
      if (typeof skillsData === 'string') {
          try { return JSON.parse(skillsData.replace(/'/g, '"')); }
          catch(e) { return skillsData.split(',').map(s => s.trim()).filter(s => s); }
      }
      return [];
  };



  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchCandidates();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data: cu } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!cu) return;
      
      const { data: jobsData } = await supabase.from('jobs').select('job_id, job_title').eq('company_id', cu.id).eq('status', 'active');
      setJobs(jobsData || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let query = supabase.from('candidates').select('id, user_id, headline, location, skills, experience_years');
      
      if (filters.search) query = query.ilike('headline', `%${filters.search}%`);
      if (filters.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters.minExperience) query = query.gte('experience_years', parseInt(filters.minExperience));
      
      const { data } = await query.limit(50);
      
      let filteredData = data || [];
      if (filters.skills) {
          const requiredSkills = filters.skills.toLowerCase().split(',').map((s: string) => s.trim());
          filteredData = filteredData.filter((c: any) => {
              const candSkills = parseSkills(c.skills).map((s: string) => s.toLowerCase());
              return requiredSkills.every((rs: string) => candSkills.some((cs: string) => cs.includes(rs)));
          });
      }

      setCandidates(filteredData);
    } catch (e: any) {
      toast("error", "Failed to load candidates", e.message);
    } finally {
      setLoading(false);
    }
  };

  const runAtsMatch = async (jobId: string) => {
      if (!jobId) {
          setActiveJob(null);
          fetchCandidates(); 
          return;
      }
      
      setActiveJob(jobId);
      setMatching(true);
      toast("info", "ATS Engine Running", "Calculating pgvector semantic match scores...");
      
      try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      const token = await getBackendToken({ id: session.user.id, email: session.user.email || '', role: 'company' });
          
          const res = await fetch(`/api/ats/match`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ job_id: jobId, threshold: 0.2, limit: 50 })
          });
          
          if (!res.ok) throw new Error("ATS Matching failed");
          const json = await res.json();
          
          if (json.data && json.data.length > 0) {
              const matchedIds = json.data.map((m: any) => m.candidate_id);
              const { data: matchedCands } = await supabase.from('candidates').select('id, user_id, headline, location, skills, experience_years, trust_score, is_verified, passports(id)').in('id', matchedIds);
              
              if (matchedCands) {
                  const scoredCands = matchedCands.map((c: any) => {
                      const matchInfo = json.data.find((m: any) => m.candidate_id === c.id);
                      return { ...c, ats_score: Math.round(matchInfo.similarity * 100) };
                  });
                  scoredCands.sort((a, b) => b.ats_score - a.ats_score);
                  setCandidates(scoredCands);
                  toast("success", "ATS Match Complete", `Found ${scoredCands.length} highly matched candidates.`);
              }
          } else {
              setCandidates([]);
              toast("info", "No Matches", "No candidates strongly match this job description.");
          }
      } catch (err: any) {
          toast("error", "ATS Error", err.message);
      } finally {
          setMatching(false);
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Pool</h1>
          <p className="text-gray-500 mt-1">Search, filter, and run semantic ATS matching to find top talent.</p>
        </div>
        
        {jobs.length > 0 && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-blue-600 ml-2" />
                <select 
                    className="bg-transparent border-0 font-bold text-blue-900 focus:ring-0 text-sm py-1 cursor-pointer"
                    value={activeJob || ""}
                    onChange={(e) => runAtsMatch(e.target.value)}
                >
                    <option value="">Standard Search</option>
                    {jobs.map((j: any) => (
                        <option key={j.job_id} value={j.job_id}>Auto-Match: {j.job_title}</option>
                    ))}
                </select>
            </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords / Headline</label>
            <input type="text" value={filters.search} onChange={(e: any) => setFilters({...filters, search: e.target.value})} placeholder="React Developer..." className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Skills (comma separated)</label>
            <input type="text" value={filters.skills} onChange={(e: any) => setFilters({...filters, skills: e.target.value})} placeholder="Python, AWS..." className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" />
          </div>
          <div className="w-full lg:w-48">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
            <input type="text" value={filters.location} onChange={(e: any) => setFilters({...filters, location: e.target.value})} placeholder="Bangalore" className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" />
          </div>
          <div className="w-full lg:w-32">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Exp (Yrs)</label>
            <input type="number" value={filters.minExperience} onChange={(e: any) => setFilters({...filters, minExperience: e.target.value})} placeholder="3" className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" />
          </div>
          <button onClick={fetchCandidates} className="w-full lg:w-auto px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Filter size={16}/> Filter
          </button>
      </div>

      {loading || matching ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
              <p className="font-semibold">{matching ? "AI is analyzing thousands of candidates..." : "Loading candidates..."}</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-2xl">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-bold">No candidates found.</p>
                      <p className="text-sm">Try adjusting your filters or running a semantic ATS match.</p>
                  </div>
              ) : (
                  candidates.map((c: any) => (
                      <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                          {c.ats_score && (
                              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                  <Star size={12} fill="currentColor"/> {c.ats_score}% MATCH
                              </div>
                          )}
                          
                          <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                  <User size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-gray-900 line-clamp-1">{c.headline || "Candidate Profile"}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                      <MapPin size={14}/> {c.location || "Remote"}
                                      <span className="w-1 h-1 bg-gray-300 rounded-full"/>
                                      {c.experience_years || 0} Yrs
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mb-6">
                              {parseSkills(c.skills).slice(0, 4).map((skill: string, i: number) => (
                                  <span key={i} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase tracking-wider">{skill}</span>
                              ))}
                              {parseSkills(c.skills).length > 4 && <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded-md">+{parseSkills(c.skills).length - 4}</span>}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mb-4">
                              <div className="flex flex-col gap-1 text-xs font-bold">
                                  <div className="flex items-center gap-1.5">
                                      <ShieldCheck size={16} className={c.is_verified ? "text-blue-500" : "text-gray-400"} />
                                      <span className={c.is_verified ? "text-blue-700" : "text-gray-500"}>Trust Score: {c.trust_score || 0}</span>
                                  </div>
                                  <div className="text-gray-400 font-medium">Availability: {c.availability || 'Immediate'}</div>
                                  <div className="text-gray-400 font-medium">Notice Period: {c.notice_period || 'None'}</div>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/candidates/${c.id}`}} className="px-3 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">View Profile</button>
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/candidates/${c.id}/passport`}} className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">View Passport</button>
                              <button className="px-3 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Save</button>
                              <button className="px-3 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Shortlist</button>
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/messages?candidate=${c.id}`}} className="px-3 py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors">Message</button>
                              <button className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">Interview</button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}
    </div>
  );
}
