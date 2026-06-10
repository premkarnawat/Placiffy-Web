import psycopg2

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    conn.autocommit = True
    cur = conn.cursor()

    # Force the candidate_resumes bucket to be public
    cur.execute("UPDATE storage.buckets SET public = true WHERE id = 'candidate_resumes';")
    print("Set candidate_resumes bucket to public!")
    
    cur.close()
    conn.close()
except Exception as e:
    print("FAILED:", e)
