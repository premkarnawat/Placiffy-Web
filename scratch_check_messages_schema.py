import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'messages';")
    print("messages:", [r[0] for r in cur.fetchall()])
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'support_tickets';")
    print("support_tickets:", [r[0] for r in cur.fetchall()])
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'applications';")
    print("applications:", [r[0] for r in cur.fetchall()])
except Exception as e:
    print(f"Error: {e}")
