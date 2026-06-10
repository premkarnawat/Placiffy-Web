# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update error handling to explicitly show missing API keys or other issues
error_patch = """
      if (!res.ok) {
        let errStr = 'Failed to parse resume data';
        try {
          const errBody = await res.json();
          if (errBody.error) errStr = errBody.error;
        } catch(e) {}
        throw new Error(errStr);
      }
"""

content = re.sub(r'      if \(!res\.ok\) throw new Error\(\'Failed to parse resume data\'\);', error_patch, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched frontend to display exact API error messages instead of generic fail!")
