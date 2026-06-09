# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We know the dashboard starts the interesting content at: <div className="flex items-start justify-between mb-6">
# And the whole return block is at the bottom.
match = re.search(r'(<div className="flex items-start justify-between mb-6">.*)', content, re.DOTALL)
if match:
    inner = match.group(1)
    # The inner currently ends with:
    #         </main>
    #       </div>
    #     </div>
    #   );
    # }
    # We will strip the last 5 closing tags/lines.
    inner_lines = inner.split("\n")
    # find where </main> is
    for i in range(len(inner_lines)-1, -1, -1):
        if "</main>" in inner_lines[i]:
            inner_lines = inner_lines[:i]
            break
            
    clean_inner = "\n".join(inner_lines)
    
    new_return = "  return (\n    <div className=\"p-6\">\n      " + clean_inner + "\n    </div>\n  );\n}"
    
    # Replace everything from `return (` onwards with new_return
    final_content = re.sub(r'return\s*\(\s*<div className="min-min-h-screen.*', new_return, content, flags=re.DOTALL)
    
    with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
        f.write(final_content)
    print("Fixed dashboard layout!")
else:
    print("Could not find content block")
