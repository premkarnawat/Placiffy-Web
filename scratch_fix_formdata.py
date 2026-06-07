# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("profileData.certifications", "formData.certifications")
content = content.replace("profileData.courses", "formData.courses")
content = content.replace("setProfileData({...profileData, certifications: d})", "setFormData({...formData, certifications: d})")
content = content.replace("setProfileData({...profileData, courses: d})", "setFormData({...formData, courses: d})")

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
