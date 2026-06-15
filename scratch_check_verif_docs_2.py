import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'candidates'")
    print("Candidates:", [row[0] for row in cur.fetchall()])
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'candidate_verifications'")
    print("Candidate Verifications:", [row[0] for row in cur.fetchall()])

    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'company_verifications'")
    print("Company Verifications:", [row[0] for row in cur.fetchall()])
    
except Exception as e:
    print("DB Error:", e)
