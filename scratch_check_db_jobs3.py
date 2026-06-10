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
    
    cur.execute("SELECT id, user_id FROM companies LIMIT 1;")
    company = cur.fetchone()
    print("Company:", company)
    
    if company:
        cur.execute(f"SELECT job_id, job_title, company_id FROM jobs WHERE company_id = '{company[0]}';")
        jobs = cur.fetchall()
        print(f"Jobs for this company ({len(jobs)}):")
        for job in jobs:
            print(job)
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
