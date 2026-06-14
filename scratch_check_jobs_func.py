with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()
    
# Let's search for the fetchCandidateProfile function
start_idx = content.find("const fetchCandidateProfile = async () => {")
print(content[start_idx:start_idx+500])
