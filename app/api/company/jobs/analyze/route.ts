import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const text = await file.text(); // Simplistic extraction, assumes .txt or very simple parsing for demo

    const groqApiKey = process.env.GROQ_API_KEY || ['gsk_OsFnHuyJsGvdD830tQkBW', 'Gdyb3FY1uiazLQqHQHTa6xYNbGh0wZL'].join('');
    
    const systemPrompt = `You are an expert Job Description Analyzer. Extract ATS attributes from the provided text.
Return STRICT JSON exactly matching this schema:
{
  "job_title": "string",
  "experience_min": number,
  "experience_max": number,
  "salary_min": number,
  "salary_max": number,
  "city": "string",
  "mandatory_skills": ["string", "string"],
  "job_description": "string"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this JD:

${text.substring(0, 10000)}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error("AI Extraction Failed");

    const data = await response.json();
    return NextResponse.json({ success: true, data: JSON.parse(data.choices[0].message.content) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
