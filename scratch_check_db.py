import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

tables_to_check = [
    'jobs', 'companies', 'passports', 'conversations', 
    'messages', 'support_tickets', 'verifications', 'applications'
]

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    for table in tables_to_check:
        cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}';")
        cols = cursor.fetchall()
        print(f"\n--- {table.upper()} ---")
        for col in cols:
            print(f"{col[0]} ({col[1]})")
            
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
