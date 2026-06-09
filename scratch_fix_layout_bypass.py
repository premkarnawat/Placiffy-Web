# -*- coding: utf-8 -*-
import os
import re

for layout_path in [r"app\company\layout.tsx", r"app\candidate\layout.tsx"]:
    if os.path.exists(layout_path):
        with open(layout_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        print(f"--- Fixing {layout_path} ---")
        
        # In useEffect, add a bypass for the register route
        # We can just check `pathname` from next/navigation!
        
        old_effect = r'  useEffect\(\(\) => \{\n    if \(\!isLoading\) \{\n      if \(\!user\) \{\n        router\.push\("/login"\);\n      \} else if \(user\.role === "(.*?)"\) \{\n        router\.push\("/(.*?)/dashboard"\);\n      \} else if \(user\.role === "(.*?)"\) \{\n        router\.push\("/(.*?)/dashboard"\);\n      \}\n    \}\n  \}, \[user, isLoading, router\]\);'
        
        # Actually it's easier to just do a string replace on the start of useEffect and the render block.
        # Let's write a targeted replacement for CompanyLayout and CandidateLayout
        
        if "pathname === '/company/register'" not in content and "pathname === '/candidate/register'" not in content:
            # Add early return for register pages
            early_return = """
  // Bypass auth guard for registration pages
  if (pathname === '/company/register' || pathname === '/candidate/register') {
    return <>{children}</>;
  }
"""
            # Insert this right before the useEffect
            content = content.replace("  useEffect(() => {", early_return + "\n  useEffect(() => {")
            
            with open(layout_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed {layout_path}")
        else:
            print(f"Already bypassed in {layout_path}")
