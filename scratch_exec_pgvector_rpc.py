import psycopg2
import sys

sql = """
CREATE OR REPLACE FUNCTION match_candidates(query_embedding vector(1024), match_threshold float, match_count int)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    headline text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        candidates.id,
        candidates.user_id,
        candidates.headline,
        1 - (candidates.embedding <=> query_embedding) AS similarity
    FROM candidates
    WHERE 1 - (candidates.embedding <=> query_embedding) > match_threshold
    ORDER BY candidates.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
"""

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(sql)
    cur.close()
    conn.close()
    print("SUCCESS: Deployed pgvector match_candidates function!")
except Exception as e:
    print("FAILED:", e)
