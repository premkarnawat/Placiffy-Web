# -*- coding: utf-8 -*-
with open(r"app\candidate\jobs\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("@/hooks/use-toast", "@/components/ui/toast")

with open(r"app\candidate\jobs\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed use-toast import in jobs page!")
