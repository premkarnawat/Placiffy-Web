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
    cur.execute("SELECT id, job_title, company_id FROM jobs;")
    rows = cur.fetchall()
    print("Jobs in database:", len(rows))
    for row in rows:
        print(row)
        
    cur.execute("SELECT id, user_id, company_id FROM company_users;")
    cu_rows = cur.fetchall()
    print("\nCompany Users in database:", len(cu_rows))
    for row in cu_rows:
        print(row)
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
