import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages, candidateContext, userId } = await req.json();

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
    const replyText = data.choices[0].message.content;

    // Log to Supabase for conversation history (memory)
    if (userId) {
      const lastUserMsg = messages[messages.length - 1];
      await supabase.from('ai_chat_history').insert([
        { user_id: userId, role: 'user', content: lastUserMsg.content },
        { user_id: userId, role: 'assistant', content: replyText }
      ]);
    }

    return NextResponse.json({ reply: replyText });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
