with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\layout.tsx", "r", encoding="utf-8-sig") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "const NAV_ITEMS" in line or "const navItems" in line or "export const" in line or "menuItems" in line:
            for j in range(i, i+30):
                if j < len(lines):
                    print(f"Line {j}: {lines[j].rstrip()}")
            break
