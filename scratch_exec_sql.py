import os
import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import psycopg2
except ImportError:
    install('psycopg2-binary')
    import psycopg2

conn_str = "postgresql://postgres:@Placify$Data1716#@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

with open(r"c:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_resume_intelligence.sql", "r", encoding="utf-8-sig") as f:
    sql = f.read()

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    print("Successfully created resume_intelligence_reports table and applied RLS policies.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Database error: {e}")
