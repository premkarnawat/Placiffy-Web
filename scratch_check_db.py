import os
import psycopg2

# Supabase direct connection string format:
# postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# We need the connection string. Is it in .env?
with open(r".env", "r", encoding="utf-8") as f:
    env_content = f.read()

import re
match = re.search(r'DATABASE_URL="(.*?)"', env_content)
if match:
    conn_str = match.group(1)
    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs';")
        cols = cur.fetchall()
        print("Jobs table columns:")
        print([c[0] for c in cols])
        cur.close()
        conn.close()
    except Exception as e:
        print("DB Error:", e)
else:
    print("No DATABASE_URL found in .env")
