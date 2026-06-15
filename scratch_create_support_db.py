import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS support_replies (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
            sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            message TEXT,
            attachment_url TEXT,
            attachment_type TEXT,
            attachment_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        ALTER TABLE support_replies ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all operations for authenticated users on support_replies" ON support_replies FOR ALL USING (auth.role() = 'authenticated');
    """)
    conn.commit()
    print("Created support_replies table successfully!")
except Exception as e:
    print("DB Error:", e)
