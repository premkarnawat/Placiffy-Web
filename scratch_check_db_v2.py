import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    # Check jobs/applications
    cur.execute("""
        SELECT a.id, a.candidate_id, c.first_name, a.job_id
        FROM applications a
        LEFT JOIN candidates c ON a.candidate_id = c.id
        LIMIT 5;
    """)
    print("Applications mapping:", cur.fetchall())

    # Check companies table columns for the registry
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'companies'")
    print("Companies columns:", [row[0] for row in cur.fetchall()])
    
    # Check support tickets
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'support_tickets'")
    print("Support columns:", [row[0] for row in cur.fetchall()])
    
except Exception as e:
    print("DB Error:", e)
