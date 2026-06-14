with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Inject activity and verification right after Current Designation block
old_designation = """              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current Designation</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Verified Experience</p>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-2">{data.current_job_role}</div>
              </div>
            </div>"""

new_designation = """              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current Designation</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Verified Experience</p>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-2">{data.current_job_role}</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Verification</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Identity Status</p>
                </div>
                <div className={`text-lg font-bold mt-2 ${data.verification_status === 'Verified' ? 'text-green-400' : 'text-amber-400'}`}>{data.verification_status || 'Pending'}</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Activity Score</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Platform Engagement</p>
                </div>
                <div className="text-lg font-bold text-cyan-400 mt-2">{data.activity_score || 0}/10</div>
              </div>
            </div>"""

# Inject Education and Project Summary after Professional Summary
old_summary = """            {/* Professional Summary */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Professional Summary</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.summary || "No summary provided."}
                </p>
              </div>
            </div>

          </div>"""

new_summary = """            {/* Professional Summary */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Professional Summary</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.summary || "No summary provided."}
                </p>
              </div>
            </div>

            {data.education_summary && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Education & Degrees</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.education_summary}
                </p>
              </div>
            </div>
            )}

            {data.project_summary && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Projects & Portfolio</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.project_summary}
                </p>
              </div>
            </div>
            )}

            {data.certification_summary && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Certifications</h3>
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.certification_summary}
                </p>
              </div>
            </div>
            )}

          </div>"""

content = content.replace(old_designation, new_designation)
content = content.replace(old_summary, new_summary)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated passport UI component")
