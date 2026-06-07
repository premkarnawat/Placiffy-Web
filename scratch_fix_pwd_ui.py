# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# We know EXACTLY what the password block looks like right now:
old_password_jsx = """                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                      <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>"""

new_password_jsx = """                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>"""

if old_password_jsx in content:
    content = content.replace(old_password_jsx, new_password_jsx)
    with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED to find password block. Let's try finding just the input.")
    
    # Fallback just in case whitespace is slightly off
    import re
    pattern = r'<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1\.5">Password <span className="text-red-500">\*</span></label>\s*<input type="password" name="password" required value=\{formData\.password\} onChange=\{handleChange\} className="w-full px-4 py-2\.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />\s*</div>'
    
    match = re.search(pattern, content)
    if match:
        content = content[:match.start()] + new_password_jsx + content[match.end():]
        with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
            f.write(content)
        print("SUCCESS WITH REGEX")
    else:
        print("COMPLETELY FAILED")
