# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "<PersonalForm data={profileData.personal} onChange={(d: any) => setProfileData({...profileData, personal: d})} />",
    "<PersonalForm data={profileData.personal} onChange={(d: any) => setProfileData({...profileData, personal: d})} userId={user?.id} />"
)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
