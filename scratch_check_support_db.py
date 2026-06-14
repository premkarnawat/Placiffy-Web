import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

def execute_query(query):
    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        cur.execute(query)
        res = cur.fetchall()
        cur.close()
        conn.close()
        return res
    except Exception as e:
        return str(e)

print("--- TABLES ---")
tables = execute_query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%ticket%';")
print(tables)

for t in tables:
    if isinstance(t, str): continue
    table_name = t[0]
    print(f"\n--- Columns in {table_name} ---")
    cols = execute_query(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{table_name}';")
    for c in cols:
        print(f"{c[0]}: {c[1]}")
