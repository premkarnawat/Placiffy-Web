'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Loader2, User, Briefcase, GraduationCap, FolderGit2, MapPin, ExternalLink, Calendar, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidatePassport() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPassport();
  }, [user]);

  const fetchPassport = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      if (!cand) return;
      const [edu, exp, proj, certs, links] = await Promise.all([
        supabase.from('candidate_education').select('*').eq('candidate_id', cand.id),
        supabase.from('candidate_experience').select('*').eq('candidate_id', cand.id).order('start_date', { ascending: false }),
        supabase.from('candidate_projects').select('*').eq('candidate_id', cand.id),
        supabase.from('candidate_certifications').select('*').eq('candidate_id', cand.id),
        supabase.from('candidate_links').select('*').eq('candidate_id', cand.id),
      ]);
      setData({ cand, edu: edu.data, exp: exp.data, proj: proj.data, certs: certs.data, links: links.data });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!data) return <div className="text-center mt-20 text-gray-500">No profile found. Please complete your profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden shrink-0 bg-blue-100">
              {data.cand.profile_photo_url ? <img src={data.cand.profile_photo_url} alt="Profile" className="w-full h-full object-cover" /> : <User size={64} className="w-full h-full p-4 text-blue-400" />}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user?.user_metadata?.full_name || 'Candidate Name'}</h1>
              <p className="text-xl text-blue-100 font-medium mb-4">{data.cand.headline || 'Professional Headline'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                {data.cand.location && <div className="flex items-center gap-1.5"><MapPin size={16} /> {data.cand.location}</div>}
                <div className="flex items-center gap-1.5"><Mail size={16} /> {user?.email}</div>
                {data.cand.experience_years > 0 && <div className="flex items-center gap-1.5"><Briefcase size={16} /> {data.cand.experience_years} Years Exp</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          {data.cand.summary && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="text-blue-600" /> About Me</h2>
              <p className="text-gray-600 leading-relaxed">{data.cand.summary}</p>
            </section>
          )}

          {data.exp?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase className="text-blue-600" /> Experience</h2>
              <div className="space-y-6 border-l-2 border-gray-100 pl-6 ml-3 relative">
                {data.exp.map((ex: any) => (
                  <div key={ex.id} className="relative">
                    <span className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></span>
                    <h3 className="text-lg font-bold text-gray-900">{ex.title}</h3>
                    <div className="text-gray-500 font-medium mb-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span>{ex.company_name}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {ex.start_date} - {ex.is_current ? 'Present' : ex.end_date}</span>
                    </div>
                    {ex.description && <p className="text-gray-600 text-sm mt-2">{ex.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.edu?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><GraduationCap className="text-blue-600" /> Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.edu.map((ed: any) => (
                  <div key={ed.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-900">{ed.degree}</h3>
                    <p className="text-gray-600 font-medium">{ed.institution}</p>
                    <p className="text-sm text-gray-500 mt-2">{ed.start_date} - {ed.end_date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.proj?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FolderGit2 className="text-blue-600" /> Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.proj.map((pr: any) => (
                  <div key={pr.id} className="border border-gray-200 p-6 rounded-2xl hover:border-blue-500 transition-colors">
                    <h3 className="font-bold text-lg mb-2 flex items-center justify-between">
                      {pr.name}
                      {pr.url && <a href={pr.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800"><ExternalLink size={18} /></a>}
                    </h3>
                    <p className="text-gray-600 text-sm">{pr.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.links?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ExternalLink className="text-blue-600" /> Links</h2>
              <div className="flex flex-wrap gap-4">
                {data.links.map((lk: any) => (
                  <a key={lk.id} href={lk.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
                    {lk.platform}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}