# -*- coding: utf-8 -*-
with open(r"app\company\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We need to replace the static pct with dynamic calculations.
old_funnel = """                {[
                  { label: "Awareness / Views", value: "Total Reach", pct: 100 },
                  { label: "Applied", value: stats.applicants, pct: 45 },
                  { label: "Screened / AI Verified", value: stats.verified, pct: 32 },
                  { label: "Interviewed", value: stats.interviews, pct: 18 },
                  { label: "Hired", value: stats.offers, pct: 5 }
                ].map((item, i) => ("""

new_funnel = """                {[
                  { label: "Awareness / Views", value: "Total Reach", pct: 100 },
                  { label: "Applied", value: stats.applicants, pct: stats.applicants > 0 ? 100 : 0 },
                  { label: "Screened / AI Verified", value: stats.verified, pct: stats.applicants > 0 ? Math.round((stats.verified / stats.applicants) * 100) : 0 },
                  { label: "Interviewed", value: stats.interviews, pct: stats.applicants > 0 ? Math.round((stats.interviews / stats.applicants) * 100) : 0 },
                  { label: "Hired", value: stats.offers, pct: stats.applicants > 0 ? Math.round((stats.offers / stats.applicants) * 100) : 0 }
                ].map((item, i) => ("""

if old_funnel in content:
    content = content.replace(old_funnel, new_funnel)
    with open(r"app\company\dashboard\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed funnel")
else:
    print("Could not find funnel")
