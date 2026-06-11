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
        const { job_id, limit = 50 } = body;

        if (!job_id) return NextResponse.json({ error: "Missing job_id" }, { status: 400 });

        const { data: job } = await supabase.from('jobs').select('mandatory_skills').eq('job_id', job_id).single();
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        const jobSkills = parseSkills(job.mandatory_skills).map((s: string) => s.toLowerCase());

        const { data: candidates } = await supabase.from('candidates').select('id, skills, is_verified');
        if (!candidates) return NextResponse.json({ status: "success", data: [] });

        const matches = candidates.map(c => {
            const candSkills = parseSkills(c.skills).map((s: string) => s.toLowerCase());
            
            if (jobSkills.length === 0) return { candidate_id: c.id, similarity: 0.5 };

            const matched = jobSkills.filter(s => candSkills.some(cs => cs.includes(s) || s.includes(cs)));
            const score = matched.length / jobSkills.length;
            
            return {
                candidate_id: c.id,
                similarity: c.is_verified ? score * 1.1 : score 
            };
        }).filter(m => m.similarity > 0);

        matches.sort((a, b) => b.similarity - a.similarity);

        return NextResponse.json({ status: "success", data: matches.slice(0, limit) });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
