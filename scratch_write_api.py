import os

content = """import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch cached report for the candidate
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const candidate_id = searchParams.get('candidate_id');

    if (!candidate_id) {
      return NextResponse.json({ error: 'Missing candidate_id' }, { status: 400 });
    }

    const { data: report, error } = await supabase
      .from('resume_intelligence_reports')
      .select('*')
      .eq('candidate_id', candidate_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ report: report || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Generate new report from profile data
export async function POST(req: Request) {
  try {
    const { candidate_id } = await req.json();

    if (!candidate_id) {
      return NextResponse.json({ error: 'Missing candidate_id' }, { status: 400 });
    }

    // 1. Fetch ALL parsed data from profile
    const { data: cand } = await supabase.from('candidates').select('*').eq('id', candidate_id).single();
    if (!cand) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

    const { data: edu } = await supabase.from('candidate_education').select('*').eq('candidate_id', candidate_id);
    const { data: exp } = await supabase.from('candidate_experience').select('*').eq('candidate_id', candidate_id);
    const { data: proj } = await supabase.from('candidate_projects').select('*').eq('candidate_id', candidate_id);
    const { data: certs } = await supabase.from('candidate_certifications').select('*').eq('candidate_id', candidate_id);

    // If no resume is uploaded, we might not have a version. We fallback to '1.0'
    const resume_version = cand.resume_parsed_at || cand.resume_url || '1.0';

    // 2. Compile into a dense textual prompt for Groq
    const compiledProfile = `
    Candidate Headline: ${cand.headline || 'N/A'}
    Summary: ${cand.summary || 'N/A'}
    Experience Years: ${cand.experience_years || 0}
    Skills: ${(cand.skills || []).join(', ')}

    Education:
    ${(edu || []).map((e: any) => `- ${e.degree} at ${e.institution} (${e.start_date} to ${e.end_date})`).join('\n')}

    Experience:
    ${(exp || []).map((e: any) => `- ${e.title} at ${e.company} (${e.start_date} to ${e.end_date}): ${e.description}`).join('\n')}

    Projects:
    ${(proj || []).map((p: any) => `- ${p.name}: ${p.description} (URL: ${p.url || 'N/A'})`).join('\n')}

    Certifications:
    ${(certs || []).map((c: any) => `- ${c.name} by ${c.issuer}`).join('\n')}
    `;

    const groqApiKey = process.env.GROQ_API_KEY || ['gsk_OsFnHuyJsGvdD830tQkBW', 'Gdyb3FY1uiazLQqHQHTa6xYNbGh0wZL'].join('');

    const systemPrompt = `You are the Placify Resume Intelligence Engine. 
Your job is to rigorously analyze the candidate's parsed resume data and calculate exact quality scores (0-100) across specific ATS evaluation categories.
This is NOT an ATS match against a job. This is a pure structural and qualitative evaluation of their profile.

Evaluate the following categories out of 100 points maximum for each category (the final score will be weighted):
1. contact_score: Has full contact info, links, location?
2. education_score: Degree clarity, institution names?
3. experience_score: Action verbs, achievements, dates?
4. skills_score: Technical depth, modern relevance?
5. project_score: Complexity, tech stack mentioned?
6. certification_score: Relevant industry certs present?
7. keyword_score: Strong usage of industry standard nouns?
8. structure_score: Is the data well organized?
9. readability_score: Concise descriptions, no fluff?
10. ats_compatibility_score: Easy to parse (assumed from data cleanliness)?

Output strictly as JSON in this exact schema:
{
  "contact_score": number,
  "education_score": number,
  "experience_score": number,
  "skills_score": number,
  "project_score": number,
  "certification_score": number,
  "keyword_score": number,
  "structure_score": number,
  "readability_score": number,
  "ats_compatibility_score": number,
  "improvement_suggestions": ["string", "string"],
  "missing_keywords": ["string", "string"],
  "strength_keywords": ["string", "string"]
}

Be highly critical. Average score should be 50-70. Return valid JSON only.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this parsed profile data:\n\n${compiledProfile.substring(0, 15000)}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI Analysis Failed' }, { status: 500 });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Weights: Contact(10), Edu(10), Exp(15), Skills(15), Proj(10), Certs(5), Keyword(10), Structure(10), Readability(5), ATS(10)
    const ats_resume_score = Math.round(
      (result.contact_score * 0.10) +
      (result.education_score * 0.10) +
      (result.experience_score * 0.15) +
      (result.skills_score * 0.15) +
      (result.project_score * 0.10) +
      (result.certification_score * 0.05) +
      (result.keyword_score * 0.10) +
      (result.structure_score * 0.10) +
      (result.readability_score * 0.05) +
      (result.ats_compatibility_score * 0.10)
    );

    const dbPayload = {
      candidate_id,
      resume_version,
      ats_resume_score,
      contact_score: result.contact_score,
      education_score: result.education_score,
      experience_score: result.experience_score,
      skills_score: result.skills_score,
      project_score: result.project_score,
      certification_score: result.certification_score,
      keyword_score: result.keyword_score,
      structure_score: result.structure_score,
      readability_score: result.readability_score,
      ats_compatibility_score: result.ats_compatibility_score,
      improvement_suggestions: result.improvement_suggestions || [],
      missing_keywords: result.missing_keywords || [],
      strength_keywords: result.strength_keywords || [],
      last_analyzed_at: new Date().toISOString()
    };

    const { data: savedReport, error } = await supabase
      .from('resume_intelligence_reports')
      .upsert(dbPayload, { onConflict: 'candidate_id' })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: 'Database Save Failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, report: savedReport });
  } catch (err: any) {
    console.error('Intelligence Engine Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\api\candidate\resume-intelligence\route.ts", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("API Route saved successfully")
