-- PLACIFY Complete PostgreSQL Schema
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('candidate', 'company', 'admin', 'expert');
CREATE TYPE app_stage AS ENUM ('applied','ats_matched','interested','verification','verified','interview','offer_sent','offer_accepted','joined','rejected','withdrawn');
CREATE TYPE fraud_risk AS ENUM ('LOW','MEDIUM','HIGH');
CREATE TYPE verif_status AS ENUM ('pending','in_progress','verified','failed','expired');
CREATE TYPE job_status AS ENUM ('draft','active','paused','closed','expired');

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, hashed_password TEXT,
  role user_role NOT NULL DEFAULT 'candidate',
  full_name TEXT NOT NULL, phone TEXT, avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE, is_active BOOLEAN DEFAULT TRUE,
  auth_provider TEXT DEFAULT 'email', last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  headline TEXT, summary TEXT, location TEXT,
  current_company TEXT, current_role TEXT, experience_years FLOAT DEFAULT 0,
  resume_url TEXT, resume_text TEXT,
  resume_embedding vector(1024),
  skills TEXT[] DEFAULT '{}', education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]', certifications TEXT[] DEFAULT '{}',
  linkedin_url TEXT, github_url TEXT, portfolio_url TEXT,
  expected_salary_min INTEGER, expected_salary_max INTEGER,
  notice_period_days INTEGER DEFAULT 30, open_to_work BOOLEAN DEFAULT TRUE,
  profile_completion_pct INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0, trust_score INTEGER DEFAULT 0,
  reliability_score INTEGER DEFAULT 100,
  fraud_risk fraud_risk DEFAULT 'LOW', fraud_score FLOAT DEFAULT 0.0,
  verification_status verif_status DEFAULT 'pending',
  passport_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON candidates USING ivfflat (resume_embedding vector_cosine_ops) WITH (lists=100);
CREATE INDEX ON candidates USING GIN(skills);
CREATE INDEX ON candidates(trust_score DESC);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, website TEXT, domain TEXT, industry TEXT,
  employee_count TEXT, description TEXT, logo_url TEXT,
  domain_verified BOOLEAN DEFAULT FALSE, is_approved BOOLEAN DEFAULT FALSE,
  subscription_plan TEXT DEFAULT 'starter',
  total_jobs_posted INTEGER DEFAULT 0, total_hires INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL, department TEXT, description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}', optional_skills TEXT[] DEFAULT '{}',
  experience_min FLOAT DEFAULT 0, experience_max FLOAT DEFAULT 10,
  salary_min INTEGER, salary_max INTEGER, location TEXT,
  work_mode TEXT DEFAULT 'hybrid', employment_type TEXT DEFAULT 'full-time',
  keywords TEXT[] DEFAULT '{}',
  interview_focus_areas TEXT[] DEFAULT '{}', role_summary TEXT,
  jd_embedding vector(1024),
  status job_status DEFAULT 'active',
  applications_count INTEGER DEFAULT 0,
  is_urgent BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON jobs USING ivfflat (jd_embedding vector_cosine_ops) WITH (lists=50);
CREATE INDEX ON jobs USING GIN(required_skills);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  stage app_stage DEFAULT 'applied',
  ats_score INTEGER DEFAULT 0,
  skills_match_score INTEGER DEFAULT 0, experience_match_score INTEGER DEFAULT 0,
  semantic_similarity_score FLOAT DEFAULT 0,
  interest_confirmed BOOLEAN DEFAULT FALSE,
  recruiter_notes TEXT, rejection_reason TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Passports
CREATE TABLE IF NOT EXISTS passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  passport_code TEXT UNIQUE NOT NULL,
  ats_score INTEGER DEFAULT 0, trust_score INTEGER DEFAULT 0,
  fraud_score FLOAT DEFAULT 0, reliability_score INTEGER DEFAULT 100,
  communication_score INTEGER DEFAULT 0, portfolio_score INTEGER DEFAULT 0,
  work_sample_score INTEGER DEFAULT 0, expert_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0, recommendation TEXT,
  recommendation_level TEXT, joining_probability INTEGER DEFAULT 0,
  share_url TEXT, pdf_url TEXT, qr_url TEXT,
  is_public BOOLEAN DEFAULT TRUE, views INTEGER DEFAULT 0,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '365 days'
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, title TEXT NOT NULL, message TEXT,
  link TEXT, is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, resource_type TEXT, resource_id UUID,
  ip_address TEXT, details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Reports
CREATE TABLE IF NOT EXISTS fraud_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id),
  risk_level fraud_risk DEFAULT 'LOW',
  overall_fraud_score FLOAT DEFAULT 0,
  timeline_consistent BOOLEAN DEFAULT TRUE,
  skills_authentic BOOLEAN DEFAULT TRUE,
  github_authentic BOOLEAN DEFAULT TRUE,
  ai_generated_ratio FLOAT DEFAULT 0,
  flags JSONB DEFAULT '[]',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_self" ON users FOR ALL USING (auth.uid()=id);
CREATE POLICY "candidates_self" ON candidates FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "companies_self" ON companies FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "jobs_public_read" ON jobs FOR SELECT USING (status='active');
CREATE POLICY "passports_public" ON passports FOR SELECT USING (is_public=TRUE);
CREATE POLICY "notifications_self" ON notifications FOR ALL USING (auth.uid()=user_id);

-- Auto-update triggers
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at=NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_candidates_upd BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_upd BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_jobs_upd BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
