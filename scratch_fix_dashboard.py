with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

bad_block = """        {/* Removing duplicate verification banner */}
          <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-white opacity-10" />
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3"><Lock className="text-blue-400" /> Unlock Premium Status</h2>
          <p className="text-blue-100 mb-6">You are currently unverified. Complete the Verification Journey to get your Candidate Passport and double your ATS ranking.</p>
          <button onClick={() => router.push('/candidate/verification')} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2">
            Start Verification <ChevronRight size={18} />
          </button>
        </div>"""

content = content.replace(bad_block, "        {/* Removed duplicate verification banner */}")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed Dashboard Syntax")
