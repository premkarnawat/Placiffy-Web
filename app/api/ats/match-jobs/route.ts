import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { candidate_id } = await req.json();
    if (!candidate_id) return NextResponse.json({ error: 'candidate_id is required' }, { status: 400 });

    const { data: cand, error: candError } = await supabase.from('candidates').select('*').eq('user_id', candidate_id).single();
    if (candError || !cand) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const { data: jobs, error: jobsError } = await supabase.from('jobs').select('*, companies(name, logo_url)').eq('status', 'active');
    if (jobsError) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    let parsedSkills: string[] = [];
    if (cand.skills) {
        if (Array.isArray(cand.skills)) parsedSkills = cand.skills;
        else if (typeof cand.skills === 'string') {
            try { parsedSkills = JSON.parse(cand.skills.replace(/'/g, '"')); }
            catch(e) { parsedSkills = cand.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s); }
        }
    }
    const candSkillsLower = parsedSkills.map((s: string) => s.toLowerCase());

    const results = (jobs || []).map(job => {
      let skillMatch = 0;
      let matchedSkills: string[] = [];
      let missingSkills: string[] = [];
      
      let mandatory: string[] = [];
      if (job.required_skills) {
          if (Array.isArray(job.required_skills)) mandatory = job.required_skills;
          else if (typeof job.required_skills === 'string') mandatory = job.required_skills.split(',').map((s: string) => s.trim());
      } else if (job.mandatory_skills) {
          if (Array.isArray(job.mandatory_skills)) mandatory = job.mandatory_skills;
          else if (typeof job.mandatory_skills === 'string') mandatory = job.mandatory_skills.split(',').map((s: string) => s.trim());
      }

      if (mandatory.length > 0) {
        let matchCount = 0;
        mandatory.forEach((skill: string) => {
          const hasSkill = candSkillsLower.some((s: string) => s.includes(skill.toLowerCase()));
          if (hasSkill) { 
            matchCount++; 
            matchedSkills.push(skill); 
          } else {
            missingSkills.push(skill);
          }
        });
        skillMatch = (matchCount / mandatory.length) * 40;
      } else {
        skillMatch = 40; 
      }

      let expMatch = 0;
      const candExp = cand.experience_years || 0;
      if (candExp >= (job.experience_min || 0) && (!job.experience_max || candExp <= job.experience_max)) {
        expMatch = 20;
      } else if (candExp >= (job.experience_min || 0) - 1) {
        expMatch = 10; 
      }

      let locMatch = 0;
      if (job.work_mode?.toLowerCase() === 'remote') {
        locMatch = 10;
      } else if (cand.location?.toLowerCase().includes((job.location || '').toLowerCase())) {
        locMatch = 10;
      } else {
        locMatch = 5; 
      }

      const totalAtsScore = Math.round(skillMatch + expMatch + 10 + locMatch + 10 + 5);

      return {
        job_id: job.job_id,
        id: job.job_id,
        title: job.job_title,
        company_id: job.companies?.name || job.company_id,
        location: job.location,
        employment_type: job.employment_type,
        salary_range: (job.salary_min && job.salary_max) ? `$${job.salary_min} - $${job.salary_max}` : 'Competitive',
        similarity: (totalAtsScore / 100),
        matched_skills: matchedSkills,
        missing_skills: missingSkills
      };
    }).sort((a, b) => b.similarity - a.similarity).slice(0, 20);

    return NextResponse.json({ success: true, matches: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
