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
    cur.execute("SELECT id, name, public FROM storage.buckets;")
    print("Buckets:", cur.fetchall())
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
