import os

path = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app"
for root, dirs, files in os.walk(path):
    for f in files:
        if f.endswith(".tsx"):
            full_path = os.path.join(root, f)
            with open(full_path, "r", encoding="utf-8-sig") as file:
                lines = file.readlines()
                for i, line in enumerate(lines):
                    if "@/hooks/use-toast" in line:
                        print(f"FOUND IN: {full_path}")
                        
                        # Fix it right now
                        content = "".join(lines)
                        content = content.replace("@/hooks/use-toast", "@/components/ui/toast")
                        with open(full_path, "w", encoding="utf-8-sig") as out:
                            out.write(content)
                        print(f"Fixed {full_path}")
