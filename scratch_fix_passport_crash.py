# -*- coding: utf-8 -*-
with open(r"components\passport\passport-showcase.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { Shield, CheckCircle, Download, Link2, MapPin, Briefcase, Award } from 'lucide-react';", "import { Shield, CheckCircle, Download, Link2, MapPin, Briefcase, Award, BrainCircuit } from 'lucide-react';")

with open(r"components\passport\passport-showcase.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected BrainCircuit import into Passport Showcase to fix the crash!")
