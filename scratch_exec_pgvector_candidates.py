import psycopg2
import sys

sql = """
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS embedding vector(1024);
"""

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(sql)
    cur.close()
    conn.close()
    print("SUCCESS: Added embedding vector column to candidates!")
except Exception as e:
    print("FAILED:", e)
