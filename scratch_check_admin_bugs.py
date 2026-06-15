import os
import re

# 1. Check Admin Sidebar
sidebar_path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\admin\Sidebar.tsx"
if os.path.exists(sidebar_path):
    with open(sidebar_path, "r", encoding="utf-8-sig") as f:
        print("Sidebar includes Notifications?", "notifications" in f.read().lower())
else:
    print("Sidebar component not found at typical path.")

# 2. Check Candidate Verification Submission
candidate_verif_path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\(portal)\candidate\verification\page.tsx"
if os.path.exists(candidate_verif_path):
    with open(candidate_verif_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
        print("Candidate Verification Table used:")
        matches = re.findall(r"supabase\.from\(['\"](.*?)['\"]\)", content)
        print(set(matches))
else:
    print("Candidate Verification page not found.")

# 3. Check Candidate Profile View
cand_profile_path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"
if os.path.exists(cand_profile_path):
    with open(cand_profile_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
        print("\nCandidate Profile View logic:")
        # Look for the fetchData block
        import textwrap
        block = re.search(r"const fetchData.*?}", content, re.DOTALL)
        if block:
            print(textwrap.shorten(block.group(0), width=300))
        else:
            print("fetchData not found")
else:
    print("Candidate Profile View not found.")

