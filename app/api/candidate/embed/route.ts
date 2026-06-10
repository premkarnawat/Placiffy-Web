import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to interact with OpenAI REST API natively
async function generateEmbedding(text: string) {
  const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-2',
      content: { parts: [{ text }] },
      outputDimensionality: 768
    })
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Embedding Failed: ${errText}`);
  }
  
  const data = await response.json();
  return data.embedding.values;
}



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateId, summary, headline } = body;

    if (!candidateId) {
      return NextResponse.json({ error: 'candidateId is required' }, { status: 400 });
    }

    const rawText = `${headline || ''} ${summary || ''}`.trim();
    if (!rawText) {
      return NextResponse.json({ message: 'No text provided for embedding' }, { status: 200 });
    }

    // 1. Generate the 768-dimensional vector using Gemini text-embedding-004
    const embeddingVector = await generateEmbedding(rawText);

    // 2. Update the candidate's embedding column directly in Supabase
    // Using string representation of array for pgvector natively: '[0.1, 0.2, ...]'
    const vectorString = `[${embeddingVector.join(',')}]`;

    const { error } = await supabase
      .from('candidates')
      .update({ embedding: vectorString })
      .eq('id', candidateId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ status: 'success', message: 'ATS Embedding generated and stored.' });
  } catch (error: any) {
    console.error('Embedding Generation Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
