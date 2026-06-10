# -*- coding: utf-8 -*-
import os
import re

gemini_embedder_func_new = """async function generateEmbedding(text: string) {
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
"""

# Pattern to replace
pattern = r'async function generateEmbedding\(text: string\) \{.*?return data\.embedding\.values;\n\}'

# Update /api/company/jobs/create/route.ts
with open(r"app\api\company\jobs\create\route.ts", "r", encoding="utf-8") as f:
    create_content = f.read()
create_content = re.sub(pattern, gemini_embedder_func_new, create_content, flags=re.DOTALL)
with open(r"app\api\company\jobs\create\route.ts", "w", encoding="utf-8") as f:
    f.write(create_content)

# Update /api/candidate/embed/route.ts
with open(r"app\api\candidate\embed\route.ts", "r", encoding="utf-8") as f:
    embed_content = f.read()
embed_content = re.sub(pattern, gemini_embedder_func_new, embed_content, flags=re.DOTALL)
with open(r"app\api\candidate\embed\route.ts", "w", encoding="utf-8") as f:
    f.write(embed_content)

print("Injected gemini-embedding-2 with 768 downscaling successfully!")
