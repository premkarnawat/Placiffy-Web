with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "} from 'lucide-react';",
    ", Sparkles\n} from 'lucide-react';"
)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Added Sparkles to layout.tsx")
