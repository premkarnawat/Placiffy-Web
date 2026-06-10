import os

os.makedirs(r"app\api\candidate\resume-intelligence", exist_ok=True)

api_code = """import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { candidate_id, resume_text } = await req.json();

    if (!candidate_id || !resume_text) {
      return NextResponse.json({ error: 'Missing candidate_id or resume_text' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY || ['gsk_OsFnHuyJsGvdD830tQkBW', 'Gdyb3FY1uiazLQqHQHTa6xYNbGh0wZL'].join('');

    const systemPrompt = `You are the Placify Resume Intelligence Engine. 
Your job is to rigorously analyze the candidate's resume text and calculate exact quality scores (0-100) across 7 different modules.
This is NOT an ATS match against a job. This is a pure structural and qualitative evaluation of the resume itself.

EVALUATION MODULES:
1. ATS Compatibility (20% weight): Are all standard sections present? Is it readable?
2. Structure Quality (15%): Logical ordering of Summary, Skills, Exp, Edu?
3. Writing Quality (15%): Professional tone, action verbs, grammar, lack of fluff.
4. Achievement Impact (15%): Use of numbers, percentages, business metrics.
5. Skill Coverage (15%): Relevance and depth of technical/hard skills compared to modern industry standards.
6. Project Strength (10%): Complexity, tech stack listed, live URLs.
7. Portfolio Strength (10%): GitHub, LinkedIn, Kaggle, personal website links present?

Output strictly as JSON in this exact schema:
{
  "ats_compatibility_score": number,
  "structure_score": number,
  "writing_score": number,
  "achievement_score": number,
  "skill_score": number,
  "project_score": number,
  "portfolio_score": number,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "recommendations": ["string", "string"]
}

Do not hallucinate. Be highly critical. Only 1% of resumes should get >90s. Default average should be 50-70.`;

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
          { role: 'user', content: `Analyze this resume text:\n\n${resume_text.substring(0, 12000)}` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error('Groq Error:', await response.text());
      return NextResponse.json({ error: 'AI Analysis Failed' }, { status: 500 });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Calculate Overall Score
    const overall = Math.round(
      (result.ats_compatibility_score * 0.20) +
      (result.structure_score * 0.15) +
      (result.writing_score * 0.15) +
      (result.achievement_score * 0.15) +
      (result.skill_score * 0.15) +
      (result.project_score * 0.10) +
      (result.portfolio_score * 0.10)
    );

    // Calculate Grade
    let grade = 'D';
    if (overall >= 95) grade = 'A+';
    else if (overall >= 85) grade = 'A';
    else if (overall >= 75) grade = 'B+';
    else if (overall >= 65) grade = 'B';
    else if (overall >= 55) grade = 'C';

    // Save to database (Upsert)
    const dbPayload = {
      candidate_id,
      overall_score: overall,
      grade,
      ats_compatibility_score: result.ats_compatibility_score,
      structure_score: result.structure_score,
      writing_score: result.writing_score,
      achievement_score: result.achievement_score,
      skill_score: result.skill_score,
      project_score: result.project_score,
      portfolio_score: result.portfolio_score,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('resume_intelligence_reports').upsert(dbPayload, { onConflict: 'candidate_id' });
    
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: 'Database Save Failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, overall_score: overall, grade });
  } catch (err: any) {
    console.error('Intelligence Engine Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
"""

with open(r"app\api\candidate\resume-intelligence\route.ts", "w", encoding="utf-8") as f:
    f.write(api_code)

print("Created /api/candidate/resume-intelligence API!")
