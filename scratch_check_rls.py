import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("""
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('candidates', 'messages', 'jobs', 'applications', 'companies', 'support_tickets');
    """)
    rows = cur.fetchall()
    for r in rows:
        print(r)
except Exception as e:
    print(f"Error: {e}")
