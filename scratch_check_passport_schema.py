import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'passports';")
    print(cur.fetchall())
    cur.close()
    conn.close()
except Exception as e:
    print(e)
