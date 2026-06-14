import psycopg2
import json

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT candidate_id FROM resume_intelligence_reports LIMIT 1;")
    res = cur.fetchone()
    print("Test fetch:", res)
    cur.close()
    conn.close()
except Exception as e:
    print(e)
