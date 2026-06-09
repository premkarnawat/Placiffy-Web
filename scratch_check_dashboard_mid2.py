# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

print("--- TEXT AROUND 3818 ---")
print(content[3700:4100])
