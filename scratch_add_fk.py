import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = 'applications_job_id_fkey'
            ) THEN
                ALTER TABLE applications
                ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs (job_id);
            END IF;
        END $$;
    """)
    conn.commit()
    print("Foreign key added successfully.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
