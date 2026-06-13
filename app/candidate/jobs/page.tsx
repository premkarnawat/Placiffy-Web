"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Briefcase, MapPin, DollarSign, Building2, Search, Filter, BookmarkPlus, Clock, Zap, ArrowRight, Lock, FileText, CheckCircle2, Loader2, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CandidateJobs() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [profileScore, setProfileScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [candidateId, setCandidateId] = useState<string | null>(null);

  // Application Modal State
  const [applyingJob, setApplyingJob] = useState<{ id: string, title: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
    interested: 'yes',
    relocate: 'Depends on Location',
    current_location: '',
    expected_salary: '',
    current_salary: '',
    notice_period: '30 Days',
    other_offer: 'no',
    offer_company: '',
    offer_ctc: '',
    joining_date: '',
    why_interested: '',
    comfortable_requirements: 'yes',
    interview_available: 'yes'
  });

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchCandidateProfile();
    }
  }, [user]);

  const fetchCandidateProfile = async () => {
    const { data } = await supabase.from('candidates').select('id, profile_score').eq('user_id', user?.id).single();
    if (data) {
      setCandidateId(data.id);
      setProfileScore(data.profile_score || 0);
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('jobs').select('*, companies(name, logo_url)').eq('status', 'open').order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = (jobId: string, title: string) => {
    if (profileScore < 80) {
      toast('error', 'Profile Incomplete', 'Your profile must be at least 80% complete to apply for jobs.');
      router.push('/candidate/profile');
      return;
    }
    setApplyingJob({ id: jobId, title });
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !applyingJob) return;
    try {
      setSubmitting(true);
      
      // Try to create application first
      const { data: appData, error: appErr } = await supabase.from('applications').insert({
        candidate_id: candidateId,
        job_id: applyingJob.id,
        status: 'applied'
      }).select().single();
      
      let appId = null;
      if (!appErr && appData) appId = appData.id;

      // Insert Screening Answers
      const { error: screenErr } = await supabase.from('application_screening_answers').insert({
        candidate_id: candidateId,
        job_id: applyingJob.id,
        application_id: appId,
        interested: answers.interested === 'yes',
        relocate: answers.relocate,
        current_location: answers.current_location,
        expected_salary: answers.expected_salary ? parseFloat(answers.expected_salary) : null,
        current_salary: answers.current_salary ? parseFloat(answers.current_salary) : null,
        notice_period: answers.notice_period,
        other_offer: answers.other_offer === 'yes',
        offer_company: answers.offer_company,
        offer_ctc: answers.offer_ctc ? parseFloat(answers.offer_ctc) : null,
        joining_date: answers.joining_date || null,
        why_interested: answers.why_interested,
        comfortable_requirements: answers.comfortable_requirements === 'yes',
        interview_available: answers.interview_available === 'yes'
      });
      
      if (screenErr) throw screenErr;

      toast('success', 'Application Submitted', `You successfully applied for ${applyingJob.title}!`);
      setApplyingJob(null);
    } catch (error) {
      console.error(error);
      toast('error', 'Submission Failed', 'Could not submit application. Ensure database schema is updated.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  const isLocked = profileScore < 80;
  const filteredJobs = jobs.filter(j => j.job_title.toLowerCase().includes(search.toLowerCase()) || j.companies?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Application Screening</h3>
                <p className="text-sm text-slate-500">Applying for: <span className="font-bold text-blue-600">{applyingJob.title}</span></p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form id="apply-form" onSubmit={submitApplication} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Are you interested in this role? <span className="text-red-500">*</span></label>
                     <select value={answers.interested} onChange={e => setAnswers({...answers, interested: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Are you willing to relocate? <span className="text-red-500">*</span></label>
                     <select value={answers.relocate} onChange={e => setAnswers({...answers, relocate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="Yes">Yes</option>
                       <option value="No">No</option>
                       <option value="Depends on Location">Depends on Location</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Current Location <span className="text-red-500">*</span></label>
                     <input required type="text" value={answers.current_location} onChange={e => setAnswers({...answers, current_location: e.target.value})} placeholder="City, State" className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Notice Period <span className="text-red-500">*</span></label>
                     <select value={answers.notice_period} onChange={e => setAnswers({...answers, notice_period: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="Immediate">Immediate</option>
                       <option value="15 Days">15 Days</option>
                       <option value="30 Days">30 Days</option>
                       <option value="60 Days">60 Days</option>
                       <option value="90 Days">90 Days</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Current Salary (LPA)</label>
                     <input type="number" step="0.1" value={answers.current_salary} onChange={e => setAnswers({...answers, current_salary: e.target.value})} placeholder="e.g. 12.5" className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Expected Salary (LPA) <span className="text-red-500">*</span></label>
                     <input required type="number" step="0.1" value={answers.expected_salary} onChange={e => setAnswers({...answers, expected_salary: e.target.value})} placeholder="e.g. 18.0" className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Do you currently hold another offer? <span className="text-red-500">*</span></label>
                     <select value={answers.other_offer} onChange={e => setAnswers({...answers, other_offer: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                     </select>
                   </div>
                   
                   {answers.other_offer === 'yes' && (
                     <>
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Offer Company</label>
                         <input type="text" value={answers.offer_company} onChange={e => setAnswers({...answers, offer_company: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Offer CTC (LPA)</label>
                         <input type="number" step="0.1" value={answers.offer_ctc} onChange={e => setAnswers({...answers, offer_ctc: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Joining Date</label>
                         <input type="date" value={answers.joining_date} onChange={e => setAnswers({...answers, joining_date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                       </div>
                     </>
                   )}
                   
                   <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Why are you interested in this role? <span className="text-red-500">*</span></label>
                     <textarea required rows={3} value={answers.why_interested} onChange={e => setAnswers({...answers, why_interested: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"></textarea>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Are you comfortable with the job requirements? <span className="text-red-500">*</span></label>
                     <select value={answers.comfortable_requirements} onChange={e => setAnswers({...answers, comfortable_requirements: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Available for interviews in next 7 days? <span className="text-red-500">*</span></label>
                     <select value={answers.interview_available} onChange={e => setAnswers({...answers, interview_available: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                     </select>
                   </div>
                </div>

              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setApplyingJob(null)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-gray-200 rounded-xl transition-colors text-sm">Cancel</button>
              <button type="submit" form="apply-form" disabled={submitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-colors flex items-center gap-2 text-sm">
                {submitting && <Loader2 size={16} className="animate-spin"/>} Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Board</h1>
          <p className="text-slate-500 mt-1">Discover your next career opportunity.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by job title, company, or keywords..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2 w-full md:w-auto justify-center">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.job_id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-center p-2 shrink-0">
                {job.companies?.logo_url ? <img src={job.companies.logo_url} alt="" className="w-full h-full object-contain"/> : <Building2 className="text-slate-400" size={24}/>}
              </div>
              <button className="text-gray-400 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-full">
                <BookmarkPlus size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <Link href={`/candidate/jobs/${job.job_id}`} className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.job_title}
              </Link>
              <p className="text-sm text-slate-600 font-medium mt-1">{job.companies?.name || 'Unknown Company'}</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-slate-500">
                <MapPin size={16} className="mr-2 text-slate-400 shrink-0" /> 
                <span className="truncate">{job.location || job.city || 'Remote'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <DollarSign size={16} className="mr-2 text-emerald-500 shrink-0" /> 
                <span className="font-medium text-slate-700">{job.salary_currency || 'INR'} {job.salary_min} - {job.salary_max} LPA</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Briefcase size={16} className="mr-2 text-blue-500 shrink-0" /> 
                <span>{job.experience_min}-{job.experience_max} Years</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.employment_type || 'Full Time'}</span>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.work_mode || 'Hybrid'}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock size={12}/> {new Date(job.created_at).toLocaleDateString()}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleApplyClick(job.job_id, job.job_title); }}
                className={`px-4 py-2 font-bold rounded-xl text-sm transition-all flex items-center gap-2 ${
                  isLocked 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {isLocked ? <Lock size={16} /> : null} Apply {isLocked ? '' : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200 border-dashed">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}