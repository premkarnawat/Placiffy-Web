"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ShieldCheck, Zap, Download, Award, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CandidatePassport() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [candidate, setCandidate] = useState<any>(null);

    useEffect(() => {
        if (params.id) fetchCandidate(params.id as string);
    }, [params.id]);

    const fetchCandidate = async (id: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('candidates')
                .select(`*`)
                .eq('id', id)
                .single();
                
            if (error) throw error;
            setCandidate(data);
        } catch (e: any) {
            toast("error", "Failed to load passport", e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/></div>;
    }

    if (!candidate) {
        return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Candidate Not Found</div>;
    }

    return (
        <div className="max-w-[800px] mx-auto p-4 sm:p-8 space-y-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={16}/> Back to Pool
            </button>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="bg-zinc-900 p-8 text-white flex justify-between items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-xs uppercase mb-6">
                            <ShieldCheck size={16}/> Placify Verified Passport
                        </div>
                        <h1 className="text-4xl font-black mb-2">{candidate.full_name || "Name Unavailable"}</h1>
                        <p className="text-zinc-400 font-medium text-lg">{candidate.headline}</p>
                    </div>
                    <div className="w-24 h-24 rounded-full border-4 border-zinc-800 bg-zinc-800 shrink-0 overflow-hidden relative z-10 flex items-center justify-center">
                        {candidate.profile_photo_url ? (
                            <img src={candidate.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-white">{(candidate.full_name || candidate.headline || 'C').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center">
                            <ShieldCheck className="text-blue-500 mb-2" size={32}/>
                            <div className="text-4xl font-black text-blue-900">{candidate.trust_score || 0}</div>
                            <div className="text-sm font-bold text-blue-600 uppercase mt-1">Trust Score</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                            <Zap className="text-emerald-500 mb-2" size={32}/>
                            <div className="text-4xl font-black text-emerald-900">{candidate.activity_score || 0}</div>
                            <div className="text-sm font-bold text-emerald-600 uppercase mt-1">Activity Score</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm border-b pb-2">Verification Checklist</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                <CheckCircle2 className="text-emerald-500" size={20}/> Identity Verified
                            </div>
                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                <CheckCircle2 className="text-emerald-500" size={20}/> Resume Parsed & Validated
                            </div>
                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                <CheckCircle2 className="text-emerald-500" size={20}/> Skills Extracted
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 font-medium mb-1">Generated ID</div>
                            <div className="font-mono font-bold text-gray-900">{candidate.id.split('-')[0]}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-gray-500 font-medium mb-1">Last Active</div>
                            <div className="font-bold text-gray-900">{new Date(candidate.last_active_at || new Date()).toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <Download size={20}/> Download PDF Passport
                    </button>
                </div>
            </div>
        </div>
    );
}
