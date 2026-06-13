import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

tables_to_bypass = [
    'jobs', 'passports', 'subscriptions', 'support_tickets', 
    'messages', 'conversations', 'conversation_participants',
    'candidates', 'companies', 'applications', 'candidate_profiles'
]

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("Setting up Admin RLS bypasses...")
    for table in tables_to_bypass:
        policy_name = f"{table}_admin_all"
        
        # Check if table exists
        cursor.execute(f"SELECT 1 FROM information_schema.tables WHERE table_name = '{table}';")
        if not cursor.fetchone():
            print(f"Skipping {table} (does not exist yet)")
            continue
            
        # Enable RLS just in case (most already have it)
        cursor.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
        
        # Drop if exists
        cursor.execute(f"DROP POLICY IF EXISTS {policy_name} ON {table};")
        
        # Create policy
        sql = f"""
        CREATE POLICY {policy_name} ON {table}
        FOR ALL
        USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
        """
        cursor.execute(sql)
        print(f"Added Admin RLS bypass to {table}")
    
    print("RLS setup complete.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
