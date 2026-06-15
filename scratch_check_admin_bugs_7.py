path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx"
with open(path, "r", encoding="utf-8-sig") as f:
    content = f.read()
    import re
    matches = re.findall(r"supabase\.from\(['\"](.*?)['\"]\)", content)
    print("Tables inserted/selected by Candidate Portal:", set(matches))
