with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Add to Props
content = content.replace(
    "ats_score: number;",
    "ats_score: number;\n  resume_intel_score?: number | null;"
)

# Inject badge
old_badge = """        <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={16} />"""

new_badge = """        <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-100">
          <div className="flex gap-4">
            {data.resume_intel_score && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Sparkles className="text-indigo-500" size={14} />
                <span className="text-xs font-bold text-indigo-700">ATS Resume Score: {data.resume_intel_score}/100</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={16} />"""

content = content.replace(old_badge, new_badge)

if "Sparkles" not in content:
    content = content.replace(
        "import { CheckCircle, ShieldCheck, MapPin, Briefcase, GraduationCap, Copy, ExternalLink, QrCode } from 'lucide-react';",
        "import { CheckCircle, ShieldCheck, MapPin, Briefcase, GraduationCap, Copy, ExternalLink, QrCode, Sparkles } from 'lucide-react';"
    )

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched passport showcase")
