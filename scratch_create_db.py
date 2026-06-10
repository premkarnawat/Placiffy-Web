import psycopg2

ddl = """
CREATE TABLE IF NOT EXISTS resume_intelligence_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    grade VARCHAR(10) NOT NULL,
    ats_compatibility_score INTEGER NOT NULL,
    structure_score INTEGER NOT NULL,
    writing_score INTEGER NOT NULL,
    achievement_score INTEGER NOT NULL,
    skill_score INTEGER NOT NULL,
    project_score INTEGER NOT NULL,
    portfolio_score INTEGER NOT NULL,
    strengths JSONB NOT NULL,
    weaknesses JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id)
);
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
    cur.execute(ddl)
    conn.commit()
    print("Table 'resume_intelligence_reports' created successfully!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
