with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_comp_links = """                        {c.registration_document_url && <a href={c.registration_document_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Reg. Document</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {!c.registration_document_url && <span className="text-xs text-slate-400">No docs provided</span>}"""

new_comp_links = """                        {c.incorporation_certificate_url && <a href={c.incorporation_certificate_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Incorporation Cert</a>}
                        {c.gst_certificate_url && <a href={c.gst_certificate_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> GST Certificate</a>}
                        {c.pan_url && <a href={c.pan_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> PAN Card</a>}
                        {c.linkedin_url && <a href={c.linkedin_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> LinkedIn</a>}
                        {c.website_url && <a href={c.website_url} target="_blank" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"><ExternalLink size={12}/> Website</a>}
                        {!c.incorporation_certificate_url && !c.gst_certificate_url && !c.pan_url && <span className="text-xs text-slate-400">No docs provided</span>}"""

content = content.replace(old_comp_links, new_comp_links)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched admin company UI")
