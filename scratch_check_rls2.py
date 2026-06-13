import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT relname, relrowsecurity 
        FROM pg_class 
        WHERE relname IN ('candidates', 'jobs', 'companies', 'verifications', 'passports', 'conversations', 'messages');
    """)
    rows = cursor.fetchall()
    for row in rows:
        print(f"Table: {row[0]}, RLS Enabled: {row[1]}")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
