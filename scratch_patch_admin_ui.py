with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Fix status column issues missed by previous script
content = content.replace("c.verification_status", "c.status")
content = content.replace("=== 'Verified'", "=== 'approved'")

old_links = """                        {c.aadhaar_front_url && <a href={c.aadhaar_front_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Front</a>}
                        {c.aadhaar_back_url && <a href={c.aadhaar_back_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Back</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {!c.aadhaar_front_url && !c.linkedin_url && <span className="text-xs text-slate-400">No links provided</span>}"""

new_links = """                        {c.aadhaar_front_url && <a href={c.aadhaar_front_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Front</a>}
                        {c.aadhaar_back_url && <a href={c.aadhaar_back_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Aadhaar Back</a>}
                        {c.pan_number && <div className="text-xs text-slate-700 font-bold">PAN: {c.pan_number}</div>}
                        {c.pan_url && <a href={c.pan_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> PAN Card</a>}
                        {c.passport_url && <a href={c.passport_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Passport</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {c.github_url && <a href={c.github_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> GitHub</a>}
                        {c.portfolio_url && <a href={c.portfolio_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Portfolio</a>}
                        {c.other_links?.experience_letter && <a href={c.other_links.experience_letter} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Experience Letter</a>}
                        {c.other_links?.degree_certificate && <a href={c.other_links.degree_certificate} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Degree Certificate</a>}
                        {!c.aadhaar_front_url && !c.linkedin_url && !c.pan_number && !c.portfolio_url && !c.other_links?.experience_letter && <span className="text-xs text-slate-400">No documents uploaded</span>}"""

content = content.replace(old_links, new_links)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched admin verification UI")
