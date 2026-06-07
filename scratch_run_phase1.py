# -*- coding: utf-8 -*-
import psycopg2
import traceback

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

sql = """
-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Alter Candidates Table for ATS and Scores
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS embedding vector(384);
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS fraud_score numeric DEFAULT 0;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS reliability_score numeric DEFAULT 100;

-- 3. Candidate Preferences
CREATE TABLE IF NOT EXISTS public.candidate_preferences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    current_ctc text,
    expected_ctc text,
    notice_period_days integer,
    availability_to_join text,
    preferred_locations text[],
    work_model_preference text, -- remote, hybrid, onsite
    relocation_preference boolean DEFAULT false,
    international_preference boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Internships
CREATE TABLE IF NOT EXISTS public.candidate_internships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    company text NOT NULL,
    role text NOT NULL,
    start_date date,
    end_date date,
    description text,
    skills_used text[],
    certificate_url text,
    created_at timestamptz DEFAULT now()
);

-- 5. Courses / Training
CREATE TABLE IF NOT EXISTS public.candidate_courses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    course_name text NOT NULL,
    provider text,
    completion_date date,
    certificate_url text,
    skills_learned text[],
    created_at timestamptz DEFAULT now()
);

-- 6. Consent Management
CREATE TABLE IF NOT EXISTS public.candidate_consents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    data_processing_consent boolean DEFAULT false,
    resume_parsing_consent boolean DEFAULT false,
    verification_consent boolean DEFAULT false,
    ai_analysis_consent boolean DEFAULT false,
    passport_consent boolean DEFAULT false,
    communication_consent boolean DEFAULT false,
    terms_accepted boolean DEFAULT false,
    privacy_accepted boolean DEFAULT false,
    ip_address text,
    version text,
    created_at timestamptz DEFAULT now()
);

-- 7. Resume Versioning
CREATE TABLE IF NOT EXISTS public.candidate_resume_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    file_url text NOT NULL,
    parse_status text DEFAULT 'pending',
    extracted_data_snapshot jsonb,
    ats_snapshot jsonb,
    is_active boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 8. Activity Tracking
CREATE TABLE IF NOT EXISTS public.candidate_activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    action_type text NOT NULL,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- 9. Advanced Communication Hub
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text NOT NULL, -- company-candidate, admin-candidate, support, verification
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text,
    joined_at timestamptz DEFAULT now()
);

-- We modify or create the robust messages table. 
-- Since we already had 'messages', let's safely add the new columns.
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS public.message_read_status (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at timestamptz DEFAULT now()
);

-- 10. Support Ticket System
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    category text NOT NULL,
    subject text NOT NULL,
    status text DEFAULT 'open',
    priority text DEFAULT 'normal',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_attachments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id uuid REFERENCES public.support_messages(id) ON DELETE CASCADE,
    file_url text NOT NULL,
    file_type text,
    created_at timestamptz DEFAULT now()
);

-- 11. Storage Buckets (Execute raw SQL to create buckets if missing)
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate_documents', 'candidate_documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project_files', 'project_files', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('support_attachments', 'support_attachments', true) ON CONFLICT (id) DO NOTHING;
"""

print("Connecting to Supabase...")
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    print("Connection successful! Executing Phase 1 Schema Updates...")
    
    cursor.execute(sql)
    
    # 12. Dummy Job for Vector ATS Testing
    # Let's ensure a 'jobs' table exists with an embedding column so vector matching works.
    jobs_sql = """
    CREATE TABLE IF NOT EXISTS public.jobs (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id uuid,
        title text NOT NULL,
        description text,
        location text,
        salary_range text,
        employment_type text,
        required_skills text[],
        embedding vector(384),
        status text DEFAULT 'open',
        created_at timestamptz DEFAULT now()
    );
    """
    cursor.execute(jobs_sql)
    
    print("Execution completed successfully!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
