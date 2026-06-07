# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(r"<PersonalForm\s+data=\{profileData\.personal\}\s+onChange=\{\(d: any\) => setProfileData\(\{\.\.\.profileData,\s*personal:\s*d\}\)\}\s*/>", 
                 "<PersonalForm data={profileData.personal} onChange={(d: any) => setProfileData({...profileData, personal: d})} userId={user?.id} />", 
                 content)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
