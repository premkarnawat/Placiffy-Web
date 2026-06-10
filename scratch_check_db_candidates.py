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
    cur.execute("SELECT * FROM candidates LIMIT 1;")
    colnames = [desc[0] for desc in cur.description]
    row = cur.fetchone()
    if row:
        for col, val in zip(colnames, row):
            print(f"{col}: {val}")
    else:
        print(f"Columns available: {colnames}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
