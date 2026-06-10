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
    
    # Check if RLS is enabled on jobs
    cur.execute("""
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'jobs';
    """)
    print("Jobs RLS Enabled:", cur.fetchone()[0])
    
    # Check policies on jobs
    cur.execute("""
        SELECT policyname, permissive, roles, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename = 'jobs';
    """)
    print("Jobs Policies:", cur.fetchall())
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
