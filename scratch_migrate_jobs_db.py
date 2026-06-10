import psycopg2

ddl = """
-- Drop the old table and its dependencies to enforce the new strict schema
DROP TABLE IF EXISTS jobs CASCADE;

-- Create the new production-grade jobs table
CREATE TABLE jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    employment_type VARCHAR(50) NOT NULL,
    work_mode VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    salary_negotiable BOOLEAN DEFAULT FALSE,
    experience_min INTEGER NOT NULL,
    experience_max INTEGER NOT NULL,
    freshers_allowed BOOLEAN DEFAULT FALSE,
    notice_period_required VARCHAR(50),
    openings INTEGER DEFAULT 1,
    bond_required BOOLEAN DEFAULT FALSE,
    bond_duration INTEGER DEFAULT 0,
    bond_amount INTEGER DEFAULT 0,
    education_required VARCHAR(255),
    education_preferred VARCHAR(255),
    job_description TEXT NOT NULL,
    about_role TEXT,
    key_responsibilities TEXT,
    benefits TEXT,
    
    -- ATS CRITICAL FIELDS
    mandatory_skills JSONB NOT NULL DEFAULT '[]',
    good_to_have_skills JSONB DEFAULT '[]',
    secondary_skills JSONB DEFAULT '[]',
    skill_weightage_json JSONB DEFAULT '{"mandatory": 70, "good_to_have": 20, "secondary": 10}',
    experience_weight INTEGER DEFAULT 20,
    education_weight INTEGER DEFAULT 10,
    location_weight INTEGER DEFAULT 10,
    notice_period_weight INTEGER DEFAULT 10,
    semantic_weight INTEGER DEFAULT 10,
    
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_analysis table for PGVector parsing and semantic matching
CREATE TABLE IF NOT EXISTS job_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(job_id) ON DELETE CASCADE,
    extracted_skills JSONB,
    extracted_tools JSONB,
    extracted_keywords JSONB,
    extracted_location VARCHAR(255),
    extracted_salary JSONB,
    extracted_experience JSONB,
    embedding VECTOR(1536), -- Uses pgvector for OpenAI text-embedding-3-small
    analysis_timestamp TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id)
);

-- Enable vector indexing for ultra-fast candidate matching
CREATE INDEX IF NOT EXISTS job_analysis_embedding_idx ON job_analysis USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
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
    print("Database Schema migrated successfully! New jobs and job_analysis tables are live.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
