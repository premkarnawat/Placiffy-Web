import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

sql_commands = """
-- 1. Alter support_tickets
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS category text DEFAULT 'General Inquiry';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS priority text DEFAULT 'Medium';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 2. Create ticket_messages
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role text NOT NULL CHECK (sender_role IN ('candidate', 'admin')),
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for ticket_messages
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ticket_messages;
CREATE POLICY "Enable read access for all users" ON public.ticket_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.ticket_messages;
CREATE POLICY "Enable insert access for all users" ON public.ticket_messages FOR INSERT WITH CHECK (true);

-- 3. Create ticket_attachments
CREATE TABLE IF NOT EXISTS public.ticket_attachments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    message_id uuid REFERENCES public.ticket_messages(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for ticket_attachments
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ticket_attachments;
CREATE POLICY "Enable read access for all users" ON public.ticket_attachments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.ticket_attachments;
CREATE POLICY "Enable insert access for all users" ON public.ticket_attachments FOR INSERT WITH CHECK (true);

-- 4. Enable RLS for support_tickets if not already enabled
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.support_tickets;
CREATE POLICY "Enable read access for all users" ON public.support_tickets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.support_tickets;
CREATE POLICY "Enable insert access for all users" ON public.support_tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update access for all users" ON public.support_tickets;
CREATE POLICY "Enable update access for all users" ON public.support_tickets FOR UPDATE USING (true);

-- 5. Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('support-attachments', 'support-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public read/write
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'support-attachments');
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'support-attachments');
"""

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute(sql_commands)
    conn.commit()
    cur.close()
    conn.close()
    print("Database migrations applied successfully!")
except Exception as e:
    print(f"Error applying migrations: {e}")
