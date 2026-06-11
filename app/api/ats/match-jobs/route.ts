import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const parseSkills = (skillsData: any): string[] => {
    if (!skillsData) return [];
    if (Array.isArray(skillsData)) return skillsData;
    if (typeof skillsData === 'string') {
        try { return JSON.parse(skillsData.replace(/'/g, '"')); }
        catch(e) { return skillsData.split(',').map(s => s.trim()).filter(s => s); }
    }
    return [];
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { candidate_id, limit = 50 } = body;

        if (!candidate_id) return NextResponse.json({ error: "Missing candidate_id" }, { status: 400 });

        const { data: cand } = await supabase.from('candidates').select('skills').eq('user_id', candidate_id).single();
        if (!cand) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });

        const candidateSkills = parseSkills(cand.skills).map((s: string) => s.toLowerCase());

        const { data: jobs } = await supabase.from('jobs').select('job_id, mandatory_skills, job_title, status').eq('status', 'active');
        if (!jobs) return NextResponse.json({ status: "success", matches: [] });

        const matches = jobs.map(job => {
            const jobSkills = parseSkills(job.mandatory_skills).map((s: string) => s.toLowerCase());
            
            if (jobSkills.length === 0) return { job_id: job.job_id, similarity: 0.5, matched_skills: [], missing_skills: [] };

            const matched = jobSkills.filter(s => candidateSkills.some(cs => cs.includes(s) || s.includes(cs)));
            const missing = jobSkills.filter(s => !candidateSkills.some(cs => cs.includes(s) || s.includes(cs)));
            
            const score = matched.length / jobSkills.length;
            
            return {
                job_id: job.job_id,
                similarity: score,
                matched_skills: matched,
                missing_skills: missing
            };
        }).filter(m => m.similarity >= 0.6);

        matches.sort((a, b) => b.similarity - a.similarity);

        return NextResponse.json({ status: "success", matches: matches.slice(0, limit) });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
