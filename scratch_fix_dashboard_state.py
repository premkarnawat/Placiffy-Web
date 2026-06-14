with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Add atsScore to state
content = content.replace(
    "const [data, setData] = useState<any>(null);",
    "const [data, setData] = useState<any>(null);\n  const [atsScore, setAtsScore] = useState<number | null>(null);"
)

# 2. Add atsScore fetch to fetchData
old_fetch = """      setData({
        cand: candRes.data,
        appCount: appCountRes.count || 0,"""

new_fetch = """      try {
        if (user?.id) {
            const { data: c } = await supabase.from('candidates').select('id').eq('user_id', user.id).single();
            if (c?.id) {
                const atsRes = await fetch(`/api/candidate/resume-intelligence?candidate_id=${c.id}`);
                const atsData = await atsRes.json();
                if (atsData?.report?.ats_resume_score) {
                    setAtsScore(atsData.report.ats_resume_score);
                }
            }
        }
      } catch (e) {}

      setData({
        cand: candRes.data,
        appCount: appCountRes.count || 0,"""

content = content.replace(old_fetch, new_fetch)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Added atsScore and fetch logic to dashboard")
