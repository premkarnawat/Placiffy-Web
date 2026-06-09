import os
import re

md_path = r"C:\Users\premk\.gemini\antigravity\brain\e1f762ea-b8fc-44de-bb22-2468c5ba5e19\candidate_portal_phase4.md"

if not os.path.exists(md_path):
    print("Markdown file not found.")
else:
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We will search for code blocks. 
    # Usually the subagent writes the filename right above the code block or inside it.
    # We will print the filenames or the first few lines to understand the structure.
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if "```" in line or ".tsx" in line:
            print(f"L{i}: {line.strip()[:100]}")
