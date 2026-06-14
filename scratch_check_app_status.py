import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT status FROM applications;")
    print(cur.fetchall())
    cur.close()
    conn.close()
except Exception as e:
    print(e)
