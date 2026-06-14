"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Briefcase, Star, Zap, ShieldCheck, Mail, Phone, ExternalLink, Calendar, Loader2 , Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CandidateProfile() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [candidate, setCandidate] = useState<any>(null);
  const [intel, setIntel] = useState<any>(null);

    useEffect(() => {
        if (params.id) fetchCandidate(params.id as string);
    }, [params.id]);

    const fetchCandidate = async (id: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('candidates')
                .select(`
                    *,
                    candidate_experience(*),
                    candidate_education(*)
                `)
                .eq('id', id)
                .single();
                
            if (error) throw error;
            setCandidate(data);
        } catch (e: any) {
            toast("error", "Failed to load profile", e.message);
        } finally {
            setLoading(false);
        }
    };

    const parseSkills = (skillsData: any): string[] => {
        if (!skillsData) return [];
        if (Array.isArray(skillsData)) return skillsData;
        if (typeof skillsData === 'string') {
            try { return JSON.parse(skillsData.replace(/'/g, '"')); }
            catch(e) { return skillsData.split(',').map(s => s.trim()).filter(s => s); }
        }
        return [];
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/></div>;
    }

    if (!candidate) {
        return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Candidate Not Found</div>;
    }

    return (
        <div className="max-w-[1000px] mx-auto p-4 sm:p-8 space-y-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={16}/> Back to Pool
            </button>
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {candidate.profile_photo_url ? (
                            <img src={candidate.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-black text-blue-600">{(candidate.full_name || candidate.headline || 'C').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-gray-900">{candidate.full_name || "Candidate Name Unavailable"}</h1>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                                <ShieldCheck size={14}/> Verified Profile
                            </span>
                        </div>
                        <h2 className="text-xl font-medium text-gray-600 mb-4">{candidate.headline}</h2>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-500">
                            <div className="flex items-center gap-1.5"><MapPin size={16}/> {candidate.location || "Remote"}</div>
                            <div className="flex items-center gap-1.5"><Briefcase size={16}/> {candidate.experience_years} Years Experience</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50">
                            <div className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1"><ShieldCheck size={14}/> Trust Score</div>
                            <div className="text-3xl font-black text-blue-900">{candidate.trust_score || 0}<span className="text-sm font-medium text-blue-600/50">/100</span></div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50">
                            <div className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1"><Zap size={14}/> Activity Score</div>
                            <div className="text-3xl font-black text-emerald-900">{candidate.activity_score || 0}<span className="text-sm font-medium text-emerald-600/50">/100</span></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="text-blue-500" fill="currentColor"/> About
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{candidate.summary || "No summary provided."}</p>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-500"/> Experience
                        </h3>
                        {candidate.candidate_experience && candidate.candidate_experience.length > 0 ? (
                            <div className="space-y-6">
                                {candidate.candidate_experience.map((exp: any) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100 pb-6 last:pb-0 last:border-transparent">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500"></div>
                                        <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                                        <div className="text-gray-500 font-semibold mb-2">{exp.company_name}</div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No experience data available.</p>
                        )}
                    </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-8">
                    {intel?.ats_resume_score && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <Sparkles className="text-indigo-500 mb-2" size={32}/>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">ATS Resume Intelligence</h3>
                            <div className="text-4xl font-black text-slate-900 mb-2">{intel.ats_resume_score}<span className="text-xl text-slate-400">/100</span></div>
                            <div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                {intel.ats_resume_score >= 80 ? 'Strong Profile' : intel.ats_resume_score >= 60 ? 'Good Profile' : 'Needs Improvement'}
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {parseSkills(candidate.skills).map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border border-gray-100">{skill}</span>
                            ))}
                        </div>
                    </div>
                    
                    {candidate.resume_url && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 mb-4">Resume</h3>
                            <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                                <ExternalLink size={18}/> View Full Resume
                            </a>
                        </div>
                    )}
                    
                    <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl">
                        <h3 className="text-lg font-black mb-6">Actions</h3>
                        <div className="space-y-3">
                            <button onClick={() => router.push(`/company/messages?candidate=${candidate.user_id}`)} className="w-full py-3 bg-white text-zinc-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">Message Candidate</button>
                            <button className="w-full py-3 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Shortlist</button>
                            <button className="w-full py-3 border border-zinc-700 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors">Schedule Interview</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
