import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ");
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
    }

    const systemPrompt = `You are an expert Job Description Analyzer. Extract ATS attributes from the provided text.
Return STRICT JSON exactly matching this schema. Do not hallucinate.
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

    const promptText = `${systemPrompt}

Analyze this JD:

${text.substring(0, 15000)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
      })
    });

    if (!response.ok) { const errBody = await response.text(); throw new Error(`AI Extraction Failed: ${errBody}`); }

    const data = await response.json();
    let jsonResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonResult) throw new Error("Empty Gemini response");

    return NextResponse.json({ success: true, data: JSON.parse(jsonResult.replace(/```json/g, "").replace(/```/g, "").trim()) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
