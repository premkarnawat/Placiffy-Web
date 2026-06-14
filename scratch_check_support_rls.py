import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'support_tickets';")
    print(cur.fetchall())
except Exception as e:
    print(f"Error: {e}")
