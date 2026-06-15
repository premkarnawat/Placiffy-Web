import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    tables_to_check = [
        'candidate_education', 'candidate_experience', 'candidate_projects', 
        'candidate_certifications', 'candidate_verifications'
    ]
    for t in tables_to_check:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {t}")
            print(f"{t} exists.")
        except Exception as e:
            print(f"Error on {t}: {e}")
            conn.rollback()
            
except Exception as e:
    print("DB Error:", e)

# Also let's find where Verification form is submitted by candidate
import os
for root, dirs, files in os.walk(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app"):
    for file in files:
        if file == "page.tsx":
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8-sig") as f:
                content = f.read()
                if "candidate_verifications" in content and "insert" in content:
                    print(f"Found verification insert at: {path}")

