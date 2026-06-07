import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

print("Connecting to Supabase...")
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    print("Connection successful!")
    
    with open("schema.sql", "r", encoding="utf-8-sig") as f:
        sql = f.read()
        
    print("Executing schema.sql...")
    cursor.execute(sql)
    print("Execution completed successfully!")
    
    cursor.close()
    conn.close()
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
