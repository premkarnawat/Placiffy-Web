# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_import = "import { Upload, Linkedin, Github, FileText, ArrowRight, CheckCircle, Shield, FileBadge, Lock } from 'lucide-react';"
new_import = "import { Upload, Linkedin, Github, FileText, ArrowRight, CheckCircle, Shield, FileBadge, Lock, Eye, EyeOff } from 'lucide-react';"

if old_import in content:
    content = content.replace(old_import, new_import)
    with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED")
