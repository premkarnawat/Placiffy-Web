import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT id, conversation_id, sender_id, content FROM messages ORDER BY created_at DESC LIMIT 5;")
    msgs = cursor.fetchall()
    print("MESSAGES:")
    for m in msgs: print(m)
    
    cursor.execute("SELECT * FROM conversations;")
    convs = cursor.fetchall()
    print("CONVERSATIONS:")
    for c in convs: print(c)

    cursor.execute("SELECT * FROM conversation_participants;")
    parts = cursor.fetchall()
    print("PARTICIPANTS:")
    for p in parts: print(p)

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
