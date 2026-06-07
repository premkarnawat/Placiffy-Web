# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    """<input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />""",
    """<input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${file ? 'z-0 hidden' : 'z-10'}`} />"""
)

# And make sure the button has z-20
content = content.replace(
    """<div className="mt-4 p-3 bg-white border border-blue-100 rounded-lg flex items-center justify-between text-left">""",
    """<div className="mt-4 p-3 bg-white border border-blue-100 rounded-lg flex items-center justify-between text-left relative z-20">"""
)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
