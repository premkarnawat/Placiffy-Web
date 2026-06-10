# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add SOURCES array definition
sources_patch = """
const BOTTOM_NAV = [
  { id: "billing", label: "Billing", icon: LayoutDashboard, href: "/company/billing" },
  { id: "support", label: "Support", icon: HelpCircle, href: "/company/support" },
  { id: "settings", label: "Settings", icon: Settings, href: "/company/settings" },
  { id: "ai", label: "AI Assistant", icon: Sparkles, href: "/company/ai-assistant" },
];

const SOURCES = [
  { name: "Organic Search", pct: 45, color: "bg-[#0052CC]" },
  { name: "Referrals", pct: 25, color: "bg-emerald-500" },
  { name: "Direct Link", pct: 20, color: "bg-amber-500" },
  { name: "Social Media", pct: 10, color: "bg-purple-500" },
];
"""

content = content.replace("const BOTTOM_NAV = [\n  { id: \"billing\", label: \"Billing\", icon: LayoutDashboard, href: \"/company/billing\" },\n  { id: \"support\", label: \"Support\", icon: HelpCircle, href: \"/company/support\" },\n  { id: \"settings\", label: \"Settings\", icon: Settings, href: \"/company/settings\" },\n  { id: \"ai\", label: \"AI Assistant\", icon: Sparkles, href: \"/company/ai-assistant\" },\n];", sources_patch)

with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected missing SOURCES array into Company Dashboard to fix the crash!")
