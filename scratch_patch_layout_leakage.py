# -*- coding: utf-8 -*-
import os
import re

def patch_layout_leakage(path):
    if not os.path.exists(path):
        return False
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # The layout usually has: return ( <div className="min-h-screen..."> ... )
    # We will inject a condition right before the main return
    
    clean_layout_check = """
  // Clean layout for Registration pages
  if (pathname.endsWith('/register')) {
    return (
      <div className="min-h-screen bg-white font-sans">
        {children}
      </div>
    );
  }

  return (
"""

    content = content.replace("  return (\n    <div className=\"min-h-screen", clean_layout_check + "    <div className=\"min-h-screen")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return True

patch_layout_leakage(r"app\candidate\layout.tsx")
patch_layout_leakage(r"app\company\layout.tsx")

print("Patched layouts to hide dashboard UI during registration!")
