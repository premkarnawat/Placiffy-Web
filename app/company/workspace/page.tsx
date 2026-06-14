'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Plus, MapPin, Clock, Search, Loader2, 
  Users, ChevronRight, CheckCircle2, XCircle, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function WorkspacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchData();

      const jobChannel = supabase.channel(`company_jobs_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchData())
        .subscribe();

      return () => { supabase.removeChannel(jobChannel); };
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: comp } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!comp) return;

      const [jRes, aRes] = await Promise.all([
        supabase.from('jobs').select('*').eq('company_id', comp.id).order('created_at', { ascending: false }),
        supabase.from('applications').select('id, job_id, status').eq('jobs.company_id', comp.id) // Wait, applications table might not have jobs.company_id join natively in simple select if not configured. 
      ]);
      
      const { data: appData } = await supabase.from('applications').select('id, job_id, status, jobs!inner(company_id)').eq('jobs.company_id', comp.id);

      setJobs(jRes.data || []);
      setApplications(appData || []);
    } catch (e: any) {
      toast("error", "Error fetching workspace", e.message);
    } finally {
      setLoading(false);
    }
  };

  const getJobMetrics = (jobId: string) => {
    const jobApps = applications.filter(a => a.job_id === jobId);
    return {
      total: jobApps.length,
      shortlisted: jobApps.filter(a => a.status === 'shortlisted').length,
      interviewing: jobApps.filter(a => a.status === 'interviewing').length,
      offered: jobApps.filter(a => a.status === 'offered').length,
      joined: jobApps.filter(a => a.status === 'joined').length,
      rejected: jobApps.filter(a => a.status === 'rejected').length
    };
  };

  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || j.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'published': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'closed': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-300';
      default: return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Briefcase className="text-blue-600" /> Job Workspace
          </h1>
          <p className="text-gray-500 mt-1">Manage your job postings and candidate pipelines.</p>
        </div>
        <button 
          onClick={() => router.push('/company/jobs/create')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-gray-400" size={20}/>
          <input 
            type="text" 
            placeholder="Search jobs by title or location..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="py-3 px-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white font-medium text-gray-700 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't posted any jobs matching this criteria yet.</p>
          <button onClick={() => router.push('/company/jobs/create')} className="text-blue-600 font-bold hover:underline">Post a Job now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map(job => {
            const metrics = getJobMetrics(job.id);
            return (
              <div key={job.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  
                  {/* Job Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(job.status)}`}>
                        {job.status || 'Draft'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> Created {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 
                      onClick={() => router.push(`/company/jobs/${job.id}/applicants`)}
                      className="text-2xl font-bold text-gray-900 cursor-pointer group-hover:text-blue-600 transition-colors"
                    >
                      {job.job_title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><MapPin size={16} className="text-slate-400"/> {job.location || 'Remote'}</div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Briefcase size={16} className="text-slate-400"/> {job.employment_type || 'Full Time'}</div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={16} className="text-slate-400"/> {job.experience || 'Entry Level'}</div>
                    </div>
                  </div>

                  {/* Pipeline Pipeline */}
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Candidate Pipeline</div>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="space-y-1">
                        <div className="text-xl font-black text-blue-600">{metrics.total}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Applied</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black text-amber-500">{metrics.shortlisted}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Shortlisted</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black text-purple-600">{metrics.interviewing}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Interview</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black text-emerald-500">{metrics.offered}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Offered</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black text-emerald-700">{metrics.joined}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Joined</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => router.push(`/company/jobs/${job.id}/applicants`)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      View Pipeline <ChevronRight size={18}/>
                    </button>
                    <button 
                      onClick={() => router.push(`/company/jobs/${job.id}/edit`)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Edit Job Details
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
