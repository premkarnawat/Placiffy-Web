# -*- coding: utf-8 -*-
import os

dir_path = r"app\api\ai\chat"
os.makedirs(dir_path, exist_ok=True)

content = """import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, candidateContext } = await req.json();

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const systemPrompt = `You are Placify AI, an expert career assistant and ATS optimization engine. 
Your goal is to help candidates improve their profile, answer questions about their trust score, and provide actionable advice.
Candidate Context:
${JSON.stringify(candidateContext, null, 2)}
Always be encouraging, concise, and highly actionable. Format your responses with clear spacing and bullet points where helpful.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Failed to communicate with AI Engine' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
"""

with open(os.path.join(dir_path, "route.ts"), "w", encoding="utf-8") as f:
    f.write(content)
print("AI Chat API route created!")
