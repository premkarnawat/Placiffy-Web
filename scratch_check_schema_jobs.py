import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs';")
    cols = [row[0] for row in cur.fetchall()]
    print("Jobs cols:", cols)
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'applications';")
    cols = [row[0] for row in cur.fetchall()]
    print("Apps cols:", cols)
    
    cur.close()
    conn.close()
except Exception as e:
    print(e)
