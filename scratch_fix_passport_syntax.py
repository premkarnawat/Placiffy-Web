with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# The issue is that python's \n inside the f-string/multiline string was evaluated, or it became a literal newline.
# Let's replace the literal newlines inside the join.
# Wait, I'll just rewrite those 3 lines explicitly.

import re

# Find the lines and fix them
content = re.sub(r"\.join\('\n'\)", r".join('\\n')", content)
content = re.sub(r"\.join\('\r\n'\)", r".join('\\n')", content)
# Also try catching literal newline inside single quotes
content = re.sub(r"\.join\('\s+'\)", r".join('\\n')", content)

# To be absolutely sure, I'll just replace the entire block manually.
old_block = """        const eduSummary = edu.data?.map(e => `• ${e.degree} at ${e.institution} (${e.start_date || 'N/A'} - ${e.end_date || 'Present'})`).join("""
new_block = """        const eduSummary = edu.data?.map(e => `• ${e.degree} at ${e.institution} (${e.start_date || 'N/A'} - ${e.end_date || 'Present'})`).join('\\n') || null;
        const projSummary = proj.data?.map(p => `• ${p.name}: ${p.description || 'No description'}`).join('\\n') || null;
        const certSummary = cert.data?.map(c => `• ${c.name} by ${c.issuer}`).join('\\n') || null;"""

# Instead of regex which can be flaky with newlines, let's just find the start of the block and replace it
lines = content.split('\n')
new_lines = []
skip = False
for line in lines:
    if "const eduSummary = edu.data?.map" in line:
        new_lines.append("""        const eduSummary = edu.data?.map(e => `• ${e.degree} at ${e.institution} (${e.start_date || 'N/A'} - ${e.end_date || 'Present'})`).join('\\n') || null;""")
        new_lines.append("""        const projSummary = proj.data?.map(p => `• ${p.name}: ${p.description || 'No description'}`).join('\\n') || null;""")
        new_lines.append("""        const certSummary = cert.data?.map(c => `• ${c.name} by ${c.issuer}`).join('\\n') || null;""")
        skip = True
    elif skip and "const isRecentlyActive" in line:
        skip = False
        new_lines.append(line)
    elif not skip:
        new_lines.append(line)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\passport\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write('\n'.join(new_lines))
print("Fixed syntax error")
