import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("ALTER TABLE public.ticket_messages DROP CONSTRAINT IF EXISTS ticket_messages_sender_role_check;")
    cur.execute("ALTER TABLE public.ticket_messages ADD CONSTRAINT ticket_messages_sender_role_check CHECK (sender_role IN ('candidate', 'admin', 'company'));")
    conn.commit()
    print("Added 'company' to sender_role check constraint")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
