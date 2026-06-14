with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "} from 'lucide-react';",
    ", Sparkles } from 'lucide-react';"
)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Added Sparkles to showcase")
