import os

def find_file(name, path):
    for root, dirs, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)
    return None

print("Layout:", find_file("layout.tsx", r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin"))

# Run a quick check on the DB to see why companies table failed
import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM companies")
    print("Companies count:", cur.fetchone()[0])
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'subscriptions'")
    print("Subscriptions cols:", [row[0] for row in cur.fetchall()])
except Exception as e:
    print("DB Error:", e)

