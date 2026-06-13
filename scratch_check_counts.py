import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

tables = ['candidates', 'companies', 'jobs', 'verifications', 'passports', 'conversations']

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]
        print(f"{table}: {count} rows")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
