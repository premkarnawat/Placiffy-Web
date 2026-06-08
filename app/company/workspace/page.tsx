"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from "framer-motion";
import { User, Zap, Loader2, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type PipelineStage = 'Sourcing' | 'Interview' | 'Offer' | 'Joined';
const STAGES: PipelineStage[] = ['Sourcing', 'Interview', 'Offer', 'Joined'];

export default function CandidatePipeline() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const { data: cu } = await supabase.from('company_users').select('company_id').eq('user_id', user?.id).single();
      if (!cu) return;

      const { data: jobsData } = await supabase.from('jobs').select('id, title').eq('company_id', cu.company_id);
      setJobs(jobsData || []);
      
      if (jobsData && jobsData.length > 0) {
        setActiveJob(jobsData[0].id);
        fetchPipeline(jobsData[0].id);
        
        // Setup real-time listener for this job's pipeline
        const channel = supabase.channel(`pipeline_${jobsData[0].id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'candidate_shortlists', filter: `job_id=eq.${jobsData[0].id}` }, () => {
             fetchPipeline(jobsData[0].id);
          }).subscribe();
          
        return () => { supabase.removeChannel(channel); }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchPipeline = async (jobId: string) => {
    try {
      // Fetch shortlists joined with candidate details
      // Since candidates table has user_id, we might need a direct query. For now, fetch shortlists then fetch candidates.
      const { data: shortlists } = await supabase.from('candidate_shortlists').select('*').eq('job_id', jobId);
      if (!shortlists) return setCandidates([]);

      // For a real app, you'd do a joined query. Here we fetch the candidates separately if needed.
      const candIds = shortlists.map((s: any) => s.candidate_id);
      const { data: cands } = await supabase.from('candidates').select('*').in('id', candIds);
      
      const enriched = shortlists.map((s: any) => ({
        ...s,
        candidate: cands?.find((c: any) => c.id === s.candidate_id) || { headline: 'Unknown Candidate', skills: [] }
      }));
      
      setCandidates(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (shortlistId: string, newStage: PipelineStage) => {
    try {
      setCandidates((prev: any) => prev.map((c: any) => c.id === shortlistId ? { ...c, status: newStage } : c));
      await supabase.from('candidate_shortlists').update({ status: newStage }).eq('id', shortlistId);
      toast("success", "Pipeline Updated", `Candidate moved to ${newStage}`);
    } catch (e: any) {
      toast("error", "Update Failed", e.message);
      if (activeJob) fetchPipeline(activeJob); // Revert
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-8 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Pipeline</h1>
          <p className="text-gray-500 mt-1">Manage sourcing, interviews, and offers.</p>
        </div>
        
        {jobs.length > 0 && (
          <select 
            value={activeJob || ''} 
            onChange={(e) => {
              setActiveJob(e.target.value);
              setLoading(true);
              fetchPipeline(e.target.value);
            }} 
            className="bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:ring-blue-500"
          >
            {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        )}
      </div>

      {!activeJob ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Jobs</h3>
          <p className="text-gray-500 max-w-md mx-auto">You need to create a job workspace first before managing candidates.</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {STAGES.map((stage: string) => {
            const stageCandidates = candidates.filter((c: any) => c.status === stage).sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0));
            
            return (
              <div key={stage} className="flex-none w-[350px] snap-center bg-slate-50/50 border border-slate-100 rounded-3xl p-4 flex flex-col h-[calc(100vh-250px)]">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {stage} 
                    <span className="bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-full text-slate-500">{stageCandidates.length}</span>
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                  <AnimatePresence>
                    {stageCandidates.map((cand: any) => (
                      <motion.div 
                        key={cand.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-600"/>
                          </div>
                          {cand.ai_match_score && (
                            <div className="bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                              <Zap size={14} className="text-indigo-600 fill-indigo-600" />
                              <span className="text-xs font-bold text-indigo-700">{Math.round(cand.ai_match_score)}% Match</span>
                            </div>
                          )}
                        </div>
                        
                        <h4 className="font-bold text-gray-900 truncate">{cand.candidate.headline || 'Candidate'}</h4>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(cand.candidate.skills || []).slice(0, 3).map((skill: string) => (
                            <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-100">{skill}</span>
                          ))}
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="View Passport">
                            <ExternalLink size={18}/>
                          </button>
                          
                          {stage !== 'Joined' && (
                            <button 
                              onClick={() => updateStage(cand.id, STAGES[STAGES.indexOf(stage) + 1])}
                              className="text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                            >
                              Move <ArrowRight size={14}/>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {stageCandidates.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-sm text-gray-400 font-medium">No candidates in {stage}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
