import psycopg2

sql = """
-- Drop the existing 768 dimension indexes
DROP INDEX IF EXISTS job_analysis_embedding_idx;
DROP INDEX IF EXISTS candidates_embedding_idx;

-- Alter the columns to accept Gemini's massive 3072-dimensional high-res embeddings
ALTER TABLE job_analysis ALTER COLUMN embedding TYPE vector(3072);
ALTER TABLE candidates ALTER COLUMN embedding TYPE vector(3072);

-- Recreate the indexes for fast semantic matching
CREATE INDEX IF NOT EXISTS job_analysis_embedding_idx ON job_analysis USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS candidates_embedding_idx ON candidates USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
"""

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    print("Database migrated to high-resolution 3072-dimensional pgvector schema!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
