# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    lines = f.read().split("\n")

# Replace line 90 (0-indexed, so lines[90]) which has "</a>" with "</div>" since line 83 was changed to a <div>
# Let's just manually fix line 90.
if lines[90].strip() == "</a>":
    lines[90] = lines[90].replace("</a>", "</div>")

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Fixed the second unclosed tag!")
