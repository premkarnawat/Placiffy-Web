# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(r'<div className="min-min-h-screen bg-white flex">', '', content)
content = re.sub(r'<div className="flex-1 flex flex-col">', '', content)
content = re.sub(r'<main className="flex-1 p-6 overflow-y-auto">', '<div className="p-6">', content)

# Remove exactly 3 closing div/main tags from the bottom
lines = content.split("\n")
for _ in range(3):
    for i in range(len(lines)-1, -1, -1):
        if "</div>" in lines[i] or "</main>" in lines[i] or "</Fragment>" in lines[i]:
            lines.pop(i)
            break

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Cleaned dashboard wrapper divs")
