import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM candidates;")
    print("Candidates:", cur.fetchone()[0])
    
    cur.execute("SELECT COUNT(*) FROM jobs;")
    print("Jobs:", cur.fetchone()[0])

    cur.execute("SELECT COUNT(*) FROM companies;")
    print("Companies:", cur.fetchone()[0])
    
    cur.execute("SELECT COUNT(*) FROM messages;")
    print("Messages:", cur.fetchone()[0])

except Exception as e:
    print(f"Error: {e}")
