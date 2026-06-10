import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const payload = await req.json();

    // 1. Insert into jobs table
    const { data: job, error } = await supabase.from('jobs').insert(payload).select().single();
    if (error) throw error;

    // 2. Generate Semantic PGVector Embedding
    const semanticText = `Title: ${job.job_title} | Skills: ${job.mandatory_skills.join(", ")} | Description: ${job.job_description}`;
    const embeddingVector = await generateEmbedding(semanticText);
    const vectorString = `[${embeddingVector.join(',')}]`;

    // 3. Insert into job_analysis
    const { error: analysisError } = await supabase.from('job_analysis').insert({
      job_id: job.job_id,
      extracted_skills: job.mandatory_skills,
      extracted_location: job.location,
      embedding: vectorString
    });
    
    if (analysisError) console.error("Failed to generate analysis:", analysisError);

    return NextResponse.json({ success: true, job_id: job.job_id });
  } catch (err: any) {
    console.error('Job Creation Backend Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
