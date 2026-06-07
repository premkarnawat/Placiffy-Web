# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "Eye," not in content:
    content = content.replace(
        "import { Check, Upload, FileText, Loader2, ArrowRight } from 'lucide-react';",
        "import { Check, Upload, FileText, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';"
    )

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
