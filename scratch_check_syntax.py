import sys
sys.stdout.reconfigure(encoding='utf-8')

files = [
    r"app\candidate\profile\edit\page.tsx",
    r"components\candidate\profile\PersonalForm.tsx",
    r"components\candidate\profile\PreferencesForm.tsx",
    r"app\candidate\jobs\page.tsx",
    r"app\candidate\applications\page.tsx",
    r"components\candidate\profile\ResumeForm.tsx",
    r"app\api\candidate\parse-resume\route.ts"
]

for file in files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            # Simple check for unmatched braces
            open_braces = content.count('{')
            close_braces = content.count('}')
            open_paren = content.count('(')
            close_paren = content.count(')')
            
            print(f"\n--- {file} ---")
            print(f"Braces: {{ {open_braces} | }} {close_braces} (Diff: {open_braces - close_braces})")
            print(f"Parens: ( {open_paren} | ) {close_paren} (Diff: {open_paren - close_paren})")
            
            # Print last 5 lines to see if it's cleanly closed
            print("Last 5 lines:")
            print("\n".join(content.splitlines()[-5:]))
    except Exception as e:
        print(f"Error reading {file}: {e}")
