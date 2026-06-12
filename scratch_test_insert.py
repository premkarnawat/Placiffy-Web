import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("INSERT INTO conversations (type, status) VALUES ('company-candidate', 'active') RETURNING id;")
    conv_id = cursor.fetchone()[0]
    print(f"INSERT SUCCESS. ID: {conv_id}")
    
    # Try inserting participant
    # cursor.execute("INSERT INTO conversation_participants (conversation_id, user_id, role) VALUES (%s, %s, 'company');", (conv_id, "some-uuid"))
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
