# -*- coding: utf-8 -*-
import psycopg2
db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
    """)
    print("Tables:")
    for row in cursor.fetchall():
        print(f"  {row[0]}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
