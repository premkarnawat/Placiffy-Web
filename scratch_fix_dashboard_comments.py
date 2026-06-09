# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the naked comments right after return (
import re
content = re.sub(r'\{\/\* Sidebar \*\/\}\s*', '', content)
content = re.sub(r'\{\/\* Main \*\/\}\s*', '', content)
content = re.sub(r'\{\/\* Top Bar \*\/\}\s*', '', content)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned up orphaned JSX comments")
