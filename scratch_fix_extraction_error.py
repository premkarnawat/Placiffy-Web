# -*- coding: utf-8 -*-
with open(r"app\api\company\jobs\analyze\route.ts", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update response.ok error handling
content = content.replace('if (!response.ok) throw new Error("AI Extraction Failed");', 'if (!response.ok) { const errBody = await response.text(); throw new Error(`AI Extraction Failed: ${errBody}`); }')

# Update JSON parsing to strip markdown
content = content.replace('return NextResponse.json({ success: true, data: JSON.parse(jsonResult) });', 'return NextResponse.json({ success: true, data: JSON.parse(jsonResult.replace(/```json/g, "").replace(/```/g, "").trim()) });')

with open(r"app\api\company\jobs\analyze\route.ts", "w", encoding="utf-8") as f:
    f.write(content)

with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    front_content = f.read()

front_content = front_content.replace('if (!res.ok) throw new Error("Failed to extract data");', 'if (!res.ok) { const errText = await res.text(); throw new Error(errText); }')

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(front_content)

print("Injected advanced error propagation and JSON markdown stripping!")
