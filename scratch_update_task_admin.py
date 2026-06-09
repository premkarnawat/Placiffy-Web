# -*- coding: utf-8 -*-
with open("task.md", "r", encoding="utf-8") as f:
    content = f.read()

admin_phase = """
## Phase 8: Admin Portal
- [ ] Admin Dashboard Overview
- [ ] Candidate & Company Management
- [ ] Verification Center (Approve/Reject)
- [ ] Support Ticket Management
- [ ] System Audit Logs
"""

if "Phase 8" not in content:
    content += admin_phase

with open("task.md", "w", encoding="utf-8") as f:
    f.write(content)
