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
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs';
    """)
    rows = cur.fetchall()
    print("=== JOBS TABLE SCHEMA ===")
    for r in rows:
        print(f"{r[0]}: {r[1]}")
    
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name LIKE '%job%';
    """)
    print("\n=== RELATED TABLES ===")
    for r in cur.fetchall():
        print(r[0])
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
