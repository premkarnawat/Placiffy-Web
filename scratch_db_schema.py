import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
    """)
    rows = cur.fetchall()
    
    schema = {}
    for row in rows:
        t, c, d = row
        if t not in schema:
            schema[t] = []
        schema[t].append(f"{c} ({d})")
        
    for t in schema:
        print(f"Table: {t}")
        for c in schema[t]:
            print(f"  - {c}")
    cur.close()
    conn.close()
except Exception as e:
    print(e)
