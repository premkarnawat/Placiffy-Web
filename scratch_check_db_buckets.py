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

    cur.execute("SELECT id, name, public FROM storage.buckets;")
    buckets = cur.fetchall()
    print("Buckets currently in storage.buckets table:")
    for b in buckets:
        print(b)
        
    cur.close()
    conn.close()
except Exception as e:
    print("FAILED:", e)
