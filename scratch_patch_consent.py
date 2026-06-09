# -*- coding: utf-8 -*-
with open(r"app\candidate\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add consent to state
content = content.replace("experience_years: ''", "experience_years: '', consent: false")

# Add consent UI before submit button
consent_ui = """
            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 mt-6 mb-4">
              <input 
                type="checkbox" 
                id="consent"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                className="mt-1 w-4 h-4 text-[#0052CC] border-gray-300 rounded focus:ring-[#0052CC]"
              />
              <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                I consent to Placify parsing my resume using AI and storing my extracted professional data (including skills, education, and experience) to match me with verified companies. I agree to the <a href="#" className="text-[#0052CC] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0052CC] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button"""

content = content.replace("<button", consent_ui, 1)

with open(r"app\candidate\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added Consent Checkbox to Candidate Registration!")
