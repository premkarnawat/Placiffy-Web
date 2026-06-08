'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Briefcase, Search, Calendar, MapPin, Building, CheckCircle2, Clock, ChevronRight, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statussetStatusFilter] = useState('All');

  const STAGES = ['Applied', 'Under Review', 'Verification', 'Interview Scheduled', 'Interview Completed', 'Offer Released', 'Offer Accepted', 'Joined', 'Rejected'];

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data: apps } = await supabase.from('applications').select('*, jobs(*, companies(*))').eq('candidate_id', user?.id).order('created_at', { ascending: false });
      
      // If table is empty, mock one application for UI testing based on user requirement to "Use real data" (but if none exists, we show an empty state, wait, user said "Use real data. No placeholders." So I will strictly show empty state if no real data).
      setApplications(apps || []);
      setFiltered(apps || []);
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching applications', 'Could not load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = applications;
    if (searchQuery) {
      result = result.filter(a => 
        a.jobs?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.jobs?.companies?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      result = result.filter(a => a.status === statusFilter.toLowerCase());
    }
    setFiltered(result);
  }, [searchQuery, statusapplications]);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'rejected': return 'bg-red-50 text-red-600 border-red-200';
      case 'offer released':
      case 'offer accepted':
      case 'joined': return 'bg-green-50 text-green-700 border-green-200';
      case 'interview scheduled':
      case 'interview completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under review':
      case 'verification': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      case 'offer released':
      case 'offer accepted':
      case 'joined': return <CheckCircle2 size={16} className="text-green-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Briefcase className="text-blue-600" size={32}/> Application Tracking
          </h1>
          <p className="text-gray-500 mt-1">Monitor the status of your submitted applications.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" placeholder="Search by job title or company..." 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setStatusFilter('All')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>All</button>
          <button onClick={() => setStatusFilter('Under Review')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'Under Review' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Under Review</button>
          <button onClick={() => setStatusFilter('Interview Scheduled')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Interviewing</button>
          <button onClick={() => setStatusFilter('Offer Released')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'Offer Released' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Offers</button>
          <button onClick={() => setStatusFilter('Rejected')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Rejected</button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
            <p className="text-gray-500 mt-1">You haven't submitted any applications matching this filter yet.</p>
          </div>
        ) : (
          filtered.map(app => {
            const job = app.jobs || {};
            const comp = job.companies || {};
            const status = app.status || 'applied';
            const curStageIdx = STAGES.findIndex(s => s.toLowerCase() === status.toLowerCase());
            
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Job Details */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-16 rounded-xl border border-gray-100 flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
                      {comp.logo_url ? <img src={comp.logo_url} alt="Logo" className="w-full h-full object-cover"/> : <Building className="text-gray-400" size={24}/>}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title || 'Unknown Role'}</h2>
                      <p className="text-blue-600 font-medium mb-2">{comp.name || 'Unknown Company'}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><MapPin size={16}/> {job.location || 'Remote'}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={16}/> Applied on {new Date(app.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Box */}
                  <div className="md:w-64 flex flex-col justify-center">
                    <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">Current Stage</p>
                        <p className="font-bold">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline UI */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.max(0, (curStageIdx / (STAGES.length - 1)) * 100)}%` }}></div>
                    
                    {STAGES.filter((_, i) => i % 2 === 0).map((stage, idx, arr) => {
                      const isActive = STAGES.findIndex(s => s.toLowerCase() === stage.toLowerCase()) <= curStageIdx;
                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 bg-white transition-colors duration-500 ${isActive ? 'border-blue-500 bg-blue-500 ring-4 ring-blue-100' : 'border-gray-300'}`}></div>
                          <p className={`absolute top-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>{stage}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
