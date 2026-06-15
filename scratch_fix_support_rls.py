import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("""
        DROP POLICY IF EXISTS "Allow all operations for authenticated users on support_replies" ON support_replies;
        CREATE POLICY "Allow all operations for authenticated users on support_replies" 
        ON support_replies 
        FOR ALL 
        USING (auth.role() = 'authenticated') 
        WITH CHECK (auth.role() = 'authenticated');
    """)
    conn.commit()
    print("Fixed support_replies RLS policy!")
except Exception as e:
    print("DB Error:", e)
