import psycopg2

db_url = "postgresql://postgres.wkgczwtnxrseiykcrzqj:%40Placify%24Data1716%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'applications';")
    rows = cursor.fetchall()
    print("Applications Columns:")
    for row in rows:
        print(row[0])
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
