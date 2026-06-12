import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'conversations';")
    columns = cursor.fetchall()
    print("conversations columns:")
    for c in columns: print(c)

    cursor.execute("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'conversation_participants';")
    columns = cursor.fetchall()
    print("conversation_participants columns:")
    for c in columns: print(c)

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
