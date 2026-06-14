'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, MapPin, Briefcase, Star, Clock, 
  ShieldCheck, AlertCircle, Loader2, Users, ChevronDown 
} from 'lucide-react';

export default function CandidatePoolPage() {
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filter States
  const [filterRole, setFilterRole] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Extracted unique filter options
  const [options, setOptions] = useState({
    roles: [] as string[],
    locations: [] as string[],
    skills: [] as string[],
    experience: ['0-2 years', '3-5 years', '5-8 years', '8+ years']
  });

  useEffect(() => {
    fetchCandidates();

    // Realtime Postgres Synchronization
    const channel = supabase.channel('public_candidates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchCandidates())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidate_profiles' }, () => fetchCandidates())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase.from('candidates').select(`*, resume_intelligence_reports(ats_resume_score)`).order('created_at', { ascending: false });

      if (error) throw error;
      
      const cands = data || [];
      setCandidates(cands);

      // Extract unique values for dynamic dropdowns
      const roles = new Set<string>();
      const locs = new Set<string>();
      const skills = new Set<string>();

      cands.forEach((c: any) => {
        if (c.headline) roles.add(c.headline);
        if (c.location) locs.add(c.location);
        const candSkills = c.skills;
        if (Array.isArray(candSkills)) {
          candSkills.forEach(s => skills.add(s));
        }
      });

      setOptions({
        roles: Array.from(roles).filter(Boolean).sort(),
        locations: Array.from(locs).filter(Boolean).sort(),
        skills: Array.from(skills).filter(Boolean).sort(),
        experience: ['0-2 years', '3-5 years', '5-8 years', '8+ years']
      });

    } catch (e: any) {
      console.error("Error fetching candidates:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    // Text Search
    const nameMatch = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Dropdown Filters
    const roleMatch = !filterRole || c.headline === filterRole;
    const locMatch = !filterLocation || c.location === filterLocation;
    const expMatch = !filterExp || c.experience_years === filterExp;
    const skillMatch = !filterSkill || c.skills?.includes(filterSkill);
    
    // Status Filter
    let statusMatch = true;
    if (filterStatus === 'verified') statusMatch = c.verification_badge === true;
    if (filterStatus === 'top_ats') statusMatch = (c.trust_score || 0) >= 80;
    
    return nameMatch && roleMatch && locMatch && expMatch && skillMatch && statusMatch;
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

        {/* Top Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
          <input 
            type="text" 
            placeholder="Quick search by candidate name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
          />
        </div>

        {/* Advanced Filters Bar */}
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mr-2">
            <Filter size={16}/> Filters:
          </div>
          
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option value="">All Roles</option>
            {options.roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option value="">All Skills</option>
            {options.skills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filterExp} onChange={e => setFilterExp(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option value="">All Experience</option>
            {options.experience.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option value="">All Locations</option>
            {options.locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-blue-200 text-blue-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">Any Status</option>
            <option value="verified">Verified Passports</option>
            <option value="top_ats">Top ATS Scores (80%+)</option>
          </select>

          {(filterRole || filterExp || filterLocation || filterSkill || filterStatus) && (
            <button 
              onClick={() => {
                setFilterRole(''); setFilterExp(''); setFilterLocation(''); setFilterSkill(''); setFilterStatus('');
              }}
              className="text-xs font-bold text-red-500 hover:text-red-600 px-3 flex items-center"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search criteria or clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(cand => {
            const passport = cand;
            const intel = cand;
            const profile = cand;

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
                  {cand.verification_badge === true && (
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
                    <div className="text-xl font-black text-blue-600">{cand.resume_intelligence_reports?.[0]?.ats_resume_score || cand.resume_intelligence_reports?.ats_resume_score || 'N/A'}<span className="text-xs text-blue-400 font-bold ml-0.5">%</span></div>
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
