'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Users, Briefcase, MessageSquare, MapPin, 
  ChevronRight, Loader2, ArrowRight, Clock, Star
} from 'lucide-react';

export default function CompanySearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    jobs: [] as any[],
    candidates: [] as any[],
    messages: [] as any[]
  });

  useEffect(() => {
    if (user && query) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [user, query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const q = `%${query}%`;
      const { data: comp } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!comp) return;

      const [jobsRes, candsRes, msgsRes] = await Promise.all([
        supabase.from('jobs').select('*').eq('company_id', comp.id).ilike('job_title', q).limit(5),
        
        // Advanced Candidate search on profiles
        supabase.from('candidates').select(`
          *,
          candidate_profiles(experience, skills),
          passports(trust_score, verification_status)
        `).or(`first_name.ilike.${q},last_name.ilike.${q},location.ilike.${q},headline.ilike.${q}`).limit(10),

        // Message search
        supabase.from('messages').select(`
          *,
          sender:sender_id(id, full_name, candidates(first_name, last_name, profile_photo_url))
        `).or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`).ilike('message', q).limit(5)
      ]);

      setResults({
        jobs: jobsRes.data || [],
        candidates: candsRes.data || [],
        messages: msgsRes.data || []
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Search className="text-blue-600" /> Search Results
        </h1>
        <p className="text-gray-500 mt-2">Showing results for <span className="font-bold text-gray-900">"{query}"</span></p>
      </div>

      {!query ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Search the platform</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Type in the top bar to find candidates, pipelines, and messages instantly.</p>
        </div>
      ) : results.jobs.length === 0 && results.candidates.length === 0 && results.messages.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">We couldn't find anything matching your search. Try adjusting your keywords.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Candidates */}
          {results.candidates.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="text-blue-500"/> Candidates ({results.candidates.length})</h2>
                <button onClick={() => router.push('/company/candidates')} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View Pool <ArrowRight size={16}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.candidates.map(cand => (
                  <div key={cand.id} onClick={() => router.push(`/company/candidates/${cand.id}`)} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all flex gap-4 items-center">
                    {cand.profile_photo_url ? (
                      <img src={cand.profile_photo_url} className="w-12 h-12 rounded-full object-cover"/>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">{cand.first_name?.[0]}</div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-bold text-gray-900 truncate">{cand.first_name} {cand.last_name}</h3>
                      <p className="text-xs text-gray-500 truncate">{cand.headline || cand.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs */}
          {results.jobs.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="text-emerald-500"/> Jobs ({results.jobs.length})</h2>
                <button onClick={() => router.push('/company/workspace')} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View Workspace <ArrowRight size={16}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.jobs.map(job => (
                  <div key={job.id} onClick={() => router.push(`/company/jobs/${job.id}/applicants`)} className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{job.job_title}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <span className={`px-2 py-1 rounded-md bg-slate-50 border border-slate-100`}>{job.status}</span>
                      <span className="flex items-center gap-1"><MapPin size={12}/> {job.location || 'Remote'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {results.messages.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="text-purple-500"/> Messages ({results.messages.length})</h2>
                <button onClick={() => router.push('/company/messages')} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">Go to Inbox <ArrowRight size={16}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.messages.map(msg => {
                  const cand = msg.sender?.candidates?.[0];
                  const senderName = cand ? `${cand.first_name} ${cand.last_name || ''}` : msg.sender?.full_name || 'Candidate';
                  return (
                    <div key={msg.id} onClick={() => router.push(`/company/messages?cand=${msg.sender_id}`)} className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md cursor-pointer transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900 text-sm">{msg.sender_id === user?.id ? 'You' : senderName}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">{msg.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
