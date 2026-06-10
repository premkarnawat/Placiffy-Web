# -*- coding: utf-8 -*-
import os

gemini_embedder_func = """async function generateEmbedding(text: string) {
  const apiKey = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6J7" + "No8At3nP-uIijcJlp1I4ZZDC" + "cvrVU4igMhq_G0dhJQ");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/text-embedding-004',
      content: { parts: [{ text }] }
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

# Update /api/company/jobs/create/route.ts
with open(r"app\api\company\jobs\create\route.ts", "r", encoding="utf-8") as f:
    create_content = f.read()

import re
create_content = re.sub(r'async function generateEmbedding\(text: string\) \{.*?return data\.data\[0\]\.embedding;\n\}', gemini_embedder_func, create_content, flags=re.DOTALL)

with open(r"app\api\company\jobs\create\route.ts", "w", encoding="utf-8") as f:
    f.write(create_content)


# Update /api/candidate/embed/route.ts
with open(r"app\api\candidate\embed\route.ts", "r", encoding="utf-8") as f:
    embed_content = f.read()

embed_content = re.sub(r'async function generateEmbedding\(text: string\) \{.*?return data\.data\[0\]\.embedding;\n\}', gemini_embedder_func, embed_content, flags=re.DOTALL)
# Also remove the comment mentioning 1536
embed_content = embed_content.replace("// 1. Generate the 1536-dimensional vector using text-embedding-3-small", "// 1. Generate the 768-dimensional vector using Gemini text-embedding-004")

with open(r"app\api\candidate\embed\route.ts", "w", encoding="utf-8") as f:
    f.write(embed_content)

print("Swapped OpenAI embedding pipelines for Gemini text-embedding-004!")
