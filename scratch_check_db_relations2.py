import psycopg2

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    cur = conn.cursor()
    
    print("--- COMPANIES ---")
    cur.execute("SELECT id, user_id FROM companies LIMIT 3;")
    for row in cur.fetchall(): print(row)
        
    print("\n--- COMPANY USERS ---")
    cur.execute("SELECT * FROM company_users LIMIT 3;")
    for row in cur.fetchall(): print(row)
        
    print("\n--- JOBS ---")
    cur.execute("SELECT job_id, company_id, job_title FROM jobs LIMIT 3;")
    for row in cur.fetchall(): print(row)
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
