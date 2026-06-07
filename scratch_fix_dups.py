# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove one instance of the duplicate states
dup_str = "  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);\n"
content = content.replace(dup_str + dup_str, dup_str)

# Remove duplicate imports
dup_import = "import { Check, Upload, FileText, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';\n"
content = content.replace(dup_import + dup_import, dup_import)

# Remove duplicate confirmPassword state
dup_conf = "    confirmPassword: '',\n"
content = content.replace(dup_conf + dup_conf, dup_conf)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
