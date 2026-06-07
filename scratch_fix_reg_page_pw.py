# -*- coding: utf-8 -*-
import re

with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    # Find Password block
    if '<label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>' in line:
        new_lines.append(line)
        new_lines.append('                      <div className="relative">\n')
        new_lines.append('                        <input type={showPassword ? \'text\' : \'password\'} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />\n')
        new_lines.append('                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">\n')
        new_lines.append('                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}\n')
        new_lines.append('                        </button>\n')
        new_lines.append('                      </div>\n')
        new_lines.append('                    </div>\n')
        new_lines.append('                    <div>\n')
        new_lines.append('                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>\n')
        new_lines.append('                      <div className="relative">\n')
        new_lines.append('                        <input type={showConfirmPassword ? \'text\' : \'password\'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />\n')
        new_lines.append('                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">\n')
        new_lines.append('                          {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}\n')
        new_lines.append('                        </button>\n')
        new_lines.append('                      </div>\n')
        skip = True
        continue
    
    if skip:
        # Skip until the next <div>
        if '                    <div>' in line and 'Location' in lines[i+1]:
            skip = False
        else:
            continue
            
    new_lines.append(line)

content = "".join(new_lines)

# Fix lucide imports
if "Eye," not in content:
    content = content.replace(
        "import { Check, Upload, FileText, Loader2, ArrowRight } from 'lucide-react';",
        "import { Check, Upload, FileText, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';"
    )

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
