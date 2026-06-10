# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find the parse-resume call
patch = """
      const parseRes = await fetch('/api/candidate/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText })
      });
      
      const parsedData = await parseRes.json();
      
      // Fire Resume Intelligence Engine Asynchronously (Fire and Forget)
      fetch('/api/candidate/resume-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: cand.id, resume_text: extractedText })
      }).catch(err => console.error("Intelligence Engine Background Error:", err));
"""

content = re.sub(r'      const parseRes = await fetch\(\'/api/candidate/parse-resume\', \{\n        method: \'POST\',\n        headers: \{ \'Content-Type\': \'application/json\' \},\n        body: JSON\.stringify\(\{ text: extractedText \}\)\n      \}\);\n      \n      const parsedData = await parseRes\.json\(\);', patch, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Asynchronous Intelligence Engine trigger into the Resume Uploader!")
