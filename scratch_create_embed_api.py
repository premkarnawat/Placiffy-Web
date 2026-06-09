import os

os.makedirs(r"app\api\candidate\embed", exist_ok=True)

route_code = """import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to interact with OpenAI REST API natively
async function generateEmbedding(text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small'
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to generate embeddings from OpenAI");
  }

  const data = await response.json();
  return data.data[0].embedding;
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

    // 1. Generate the 1536-dimensional vector using text-embedding-3-small
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
"""

with open(r"app\api\candidate\embed\route.ts", "w", encoding="utf-8") as f:
    f.write(route_code)

print("Created native ATS PGVector Embedding API!")
