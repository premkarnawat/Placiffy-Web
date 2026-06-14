with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace("'+{identityPoints} Points'", "`+${identityPoints} Points`")
content = content.replace("+{identityPoints} Points", "+{identityPoints} Points") # This one inside <div>+{identityPoints} Points</div> is fine since it's just text, wait.
# Actually inside div: <div>+{identityPoints} Points</div> evaluates identityPoints. It's perfectly valid JSX.
# But let's change it to + {identityPoints} Points just in case it caused issues

content = content.replace("<div>+{identityPoints} Points</div>", "<div>+ {identityPoints} Points</div>")

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\trust-score\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed trust score syntax")
