content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Filter, Loader2, CheckCircle2, 
  XCircle, Clock, ShieldCheck, Mail, MapPin, Briefcase 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user && jobId) {
      fetchApplicants();

      const channel = supabase.channel(`job_apps_${jobId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `job_id=eq.${jobId}` }, () => fetchApplicants())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user, jobId]);

  const fetchApplicants = async () => {
    try {
      const { data: jobData } = await supabase.from('jobs').select('*').eq('id', jobId).single();
      setJob(jobData);

      // STRICT QUERY: ONLY fetch from applications table.
      // Do NOT fetch from candidate_pool or ats_matches directly to avoid leaking non-applicants.
      const { data: apps, error } = await supabase.from('applications')
        .select(`
          id, status, applied_at, candidate_id, match_score, match_reasons,
          candidates:candidate_id (
            id, first_name, last_name, headline, location, profile_photo_url,
            passports(trust_score, verification_status),
            resume_intelligence_reports(ats_resume_score)
          )
        `)
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(apps || []);
    } catch (e: any) {
      toast({ title: "Error fetching applicants", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: string, newStatus: string, candidateId: string) => {
    try {
      await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
      
      // Notify candidate
      await supabase.from('notifications').insert([{
        user_id: candidateId,
        type: 'application',
        title: 'Application Update',
        message: `Your application for ${job?.job_title} is now: ${newStatus}`,
        link: '/candidate/applications'
      }]);

      toast({ title: "Status Updated", description: `Candidate marked as ${newStatus}` });
    } catch (e: any) {
      toast({ title: "Update Failed", description: e.message, variant: "destructive" });
    }
  };

  const filteredApps = applications.filter(a => {
    const cand = a.candidates;
    if (!cand) return false;
    const name = `${cand.first_name || ''} ${cand.last_name || ''}`.toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/company/workspace')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline: {job?.job_title}</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <MapPin size={14}/> {job?.location} • <Briefcase size={14}/> {job?.employment_type}
            </p>
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-bold ${statusFilter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>All ({applications.length})</button>
          <button onClick={() => setStatusFilter('applied')} className={`px-4 py-2 rounded-lg text-sm font-bold ${statusFilter === 'applied' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>New</button>
          <button onClick={() => setStatusFilter('shortlisted')} className={`px-4 py-2 rounded-lg text-sm font-bold ${statusFilter === 'shortlisted' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Shortlisted</button>
        </div>
      </div>

      {/* Applicant Grid */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No applicants found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">This pipeline stage is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const cand = app.candidates;
            if (!cand) return null;
            const passport = cand.passports?.[0];
            const intel = cand.resume_intelligence_reports?.[0];

            return (
              <div key={app.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    {cand.profile_photo_url ? (
                      <img src={cand.profile_photo_url} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                        {cand.first_name?.[0]}{cand.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{cand.first_name} {cand.last_name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Clock size={12}/> Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {passport?.verification_status === 'Verified' && (
                    <ShieldCheck size={20} className="text-emerald-500" />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">{cand.headline || 'No headline provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ATS Score</div>
                    <div className="text-lg font-black text-blue-600">{app.match_score || intel?.ats_resume_score || 'N/A'}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Trust Score</div>
                    <div className="text-lg font-black text-amber-500">{passport?.trust_score || '0'}/100</div>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex gap-2">
                    <select 
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value, cand.id)}
                      className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    >
                      <option value="applied">New Applicant</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offered">Offered</option>
                      <option value="joined">Joined</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => router.push(`/company/candidates/${cand.id}`)}
                      className="flex-1 bg-white border border-blue-200 text-blue-600 font-bold py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => router.push(`/company/messages?cand=${cand.id}`)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Mail size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\jobs\[id]\applicants\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated company applicants page")
