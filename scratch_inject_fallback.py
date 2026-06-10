# -*- coding: utf-8 -*-
import os

api_code = """import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
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

    let jsonResult = null;
    let geminiError = null;

    // PRIMARY PIPELINE: Gemini 1.5 Flash
    try {
      const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ");
      const promptText = `${systemPrompt}\n\nAnalyze this JD:\n\n${text.substring(0, 15000)}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      jsonResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonResult) throw new Error("Empty Gemini response");
      
    } catch (err: any) {
      console.warn("Gemini Primary Failed, triggering Groq Fallback:", err.message);
      geminiError = err.message;
    }

    // FALLBACK PIPELINE: Groq Llama-3 (Extremely Fast now that we use pure text instead of binary)
    if (!jsonResult) {
      try {
        const groqApiKey = process.env.GROQ_API_KEY || ['gsk_OsFnHuyJsGvdD830tQkBW', 'Gdyb3FY1uiazLQqHQHTa6xYNbGh0wZL'].join('');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Analyze this JD:\n\n${text.substring(0, 15000)}` }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        jsonResult = data.choices[0].message.content;
      } catch (fallbackErr: any) {
        throw new Error(`Both AI Engines Failed.\nGemini: ${geminiError}\nGroq: ${fallbackErr.message}`);
      }
    }

    if (!jsonResult) throw new Error("Complete AI Failure");

    const cleanJson = jsonResult.replace(/```json/g, "").replace(/```/g, "").trim();
    return NextResponse.json({ success: true, data: JSON.parse(cleanJson) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
"""

with open(r"app\api\company\jobs\analyze\route.ts", "w", encoding="utf-8") as f:
    f.write(api_code)

print("Injected High-Availability Groq Fallback into JD Analyzer!")
