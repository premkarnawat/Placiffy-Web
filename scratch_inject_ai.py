# -*- coding: utf-8 -*-
with open(r"app\candidate\layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Inject import
if "AIAssistant" not in content:
    content = content.replace("import Sidebar from '@/components/candidate/Sidebar';", "import Sidebar from '@/components/candidate/Sidebar';\nimport AIAssistant from '@/components/candidate/AIAssistant';")

# Inject component just before closing </ProtectedRoute> or main div
if "<AIAssistant />" not in content:
    content = content.replace("</ProtectedRoute>", "  <AIAssistant />\n    </ProtectedRoute>")

with open(r"app\candidate\layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
