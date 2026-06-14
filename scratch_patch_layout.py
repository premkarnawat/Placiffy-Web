with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(
    "{ name: 'Resume', href: '/candidate/resume', icon: FileText },",
    "{ name: 'Resume', href: '/candidate/resume', icon: FileText },\n    { name: 'ATS Intelligence', href: '/candidate/resume-intelligence', icon: Sparkles },"
)

# Also need to import Sparkles if not present
if "Sparkles" not in content:
    content = content.replace(
        "import { LayoutDashboard, Briefcase, FileText, MessageSquare, Settings, LogOut, Search, Bell, Menu, X, ChevronRight, User, Shield, HelpCircle, Award, CreditCard } from 'lucide-react';",
        "import { LayoutDashboard, Briefcase, FileText, MessageSquare, Settings, LogOut, Search, Bell, Menu, X, ChevronRight, User, Shield, HelpCircle, Award, CreditCard, Sparkles } from 'lucide-react';"
    )

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Patched candidate layout")
