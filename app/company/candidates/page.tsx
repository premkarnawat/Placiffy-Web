'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, MapPin, Briefcase, Star, Clock, 
  ShieldCheck, AlertCircle, Loader2, Users, ChevronDown 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CandidatePoolPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase.from('candidates').select(`
        *,
        candidate_profiles(experience, skills),
        passports(trust_score, verification_status),
        resume_intelligence_reports(ats_resume_score)
      `).order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (e: any) {
      toast("error" if "destructive" in m.group(0) else "success", "Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const nameMatch = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = c.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const skillMatch = c.candidate_profiles?.[0]?.skills?.some((s:string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const searchPass = nameMatch || locationMatch || skillMatch;
    
    if (filterType === 'verified') return searchPass && c.passports?.[0]?.verification_status === 'Verified';
    if (filterType === 'available') return searchPass && c.availability_status === 'Available';
    if (filterType === 'top_ats') return searchPass && (c.resume_intelligence_reports?.[0]?.ats_resume_score || 0) >= 80;
    
    return searchPass;
  });

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-blue-600" /> Candidate Pool
          </h1>
          <p className="text-gray-500 mt-1">Discover, filter, and connect with eligible candidates across the platform.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search candidates by name, location, or skills..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Candidates</option>
              <option value="verified">Verified Passports</option>
              <option value="available">Currently Available</option>
              <option value="top_ats">Top ATS Scores (80%+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(cand => {
            const passport = cand.passports?.[0];
            const intel = cand.resume_intelligence_reports?.[0];
            const profile = cand.candidate_profiles?.[0];

            return (
              <div key={cand.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    {cand.profile_photo_url ? (
                      <img src={cand.profile_photo_url} alt="Photo" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border-2 border-white shadow-sm">
                        {cand.first_name?.[0]}{cand.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {cand.first_name} {cand.last_name}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12}/> {cand.location || 'Location Not Set'}
                      </p>
                    </div>
                  </div>
                  {passport?.verification_status === 'Verified' && (
                    <div className="bg-emerald-50 p-1.5 rounded-full" title="Verified Passport">
                      <ShieldCheck size={18} className="text-emerald-500" />
                    </div>
                  )}
                </div>

                <div className="mb-5 h-10">
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">{cand.headline || 'Looking for opportunities'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ATS Intel</div>
                    <div className="text-xl font-black text-blue-600">{intel?.ats_resume_score || 'N/A'}<span className="text-xs text-blue-400 font-bold ml-0.5">%</span></div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trust Score</div>
                    <div className="text-xl font-black text-amber-500">{passport?.trust_score || '0'}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {profile?.skills?.slice(0, 3).map((s:string, i:number) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">
                      {s}
                    </span>
                  ))}
                  {profile?.skills?.length > 3 && (
                    <span className="bg-gray-50 text-gray-400 text-xs font-bold px-2.5 py-1 rounded-md">
                      +{profile.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => router.push(`/company/candidates/${cand.id}`)}
                    className="flex-1 bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-bold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => router.push(`/company/messages?cand=${cand.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
