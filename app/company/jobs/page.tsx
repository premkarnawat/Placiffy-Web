"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { motion } from "framer-motion";
import { Plus, Search, Users, MapPin, Briefcase, Zap, Loader2, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/toast";

export default function JobWorkspaces() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourcingJobId, setSourcingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data: cu } = await supabase.from('company_users').select('company_id').eq('user_id', user?.id).single();
      if (!cu) return;

      const { data } = await supabase.from('jobs').select('*').eq('company_id', cu.company_id).order('created_at', { ascending: false });
      setJobs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAIMatch = async (jobId: string) => {
    setSourcingJobId(jobId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/ats/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: jobId, match_count: 20 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to run AI Matcher");
      
      if (data.sourced_count === 0) {
        toast("info", "No New Matches", "No new candidates passed the 30% similarity threshold.");
      } else {
        toast("success", "AI Sourcing Complete", `Sourced ${data.sourced_count} highly compatible candidates into your pipeline!`);
        router.push("/company/candidates");
      }
    } catch (e: any) {
      toast("error", "Sourcing Failed", e.message);
    } finally {
      setSourcingJobId(null);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Workspaces</h1>
          <p className="text-gray-500 mt-1">Manage active roles and launch AI sourcing pipelines.</p>
        </div>
        <button onClick={() => router.push('/company/jobs/create')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <Plus size={20} /> Create Workspace
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Workspaces</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first job workspace to automatically start sourcing verified candidates using our AI pgvector engine.</p>
          <button onClick={() => router.push('/company/jobs/create')} className="text-blue-600 font-bold hover:underline">Create a Workspace →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:border-blue-100 hover:shadow-md transition-all group">
              <div className="p-6 border-b border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                    <p className="text-sm font-medium text-blue-600 mt-1">{job.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {job.priority} Priority
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin size={16}/> {job.location} ({job.work_model})</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16}/> {job.employment_type}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-gray-900">{job.open_positions}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Openings</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-blue-600">--</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">In Pipeline</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handleAIMatch(job.id)}
                    disabled={sourcingJobId === job.id}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-70"
                  >
                    {sourcingJobId === job.id ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="text-yellow-300 fill-yellow-300"/>}
                    {sourcingJobId === job.id ? 'Sourcing...' : 'AI Match'}
                  </button>
                  <button onClick={() => router.push('/company/candidates')} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-gray-200 bg-white shadow-sm">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
