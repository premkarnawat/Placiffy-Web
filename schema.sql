-- ==========================================
-- PLACIFY: MASSIVE PROFILE & MESSAGING SCHEMA
-- ==========================================

-- 1. EXTEND CANDIDATES TABLE
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS current_location TEXT,
ADD COLUMN IF NOT EXISTS permanent_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS work_authorization TEXT,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS preferred_work_mode TEXT[],
ADD COLUMN IF NOT EXISTS preferred_employment_type TEXT[],
ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS open_to_international BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS portfolio_links JSONB DEFAULT '{}'::jsonb;

-- 2. CREATE NEW RELATIONAL TABLES
CREATE TABLE IF NOT EXISTS public.candidate_education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    specialization TEXT,
    college TEXT NOT NULL,
    university TEXT,
    start_year INTEGER,
    end_year INTEGER,
    cgpa NUMERIC(4,2),
    percentage NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.candidate_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    designation TEXT NOT NULL,
    employment_type TEXT,
    start_date DATE,
    end_date DATE,
    responsibilities TEXT,
    achievements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.candidate_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[],
    project_url TEXT,
    github_url TEXT,
    role TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.candidate_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE MESSAGING SYSTEM TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENABLE RLS (Row Level Security) ON NEW TABLES
ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. CREATE BASIC RLS POLICIES (Users can view/edit their own data)
CREATE POLICY "Users can view their own education" ON public.candidate_education FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Users can manage their own education" ON public.candidate_education FOR ALL USING (auth.uid() = candidate_id);

CREATE POLICY "Users can view their own experience" ON public.candidate_experience FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Users can manage their own experience" ON public.candidate_experience FOR ALL USING (auth.uid() = candidate_id);

CREATE POLICY "Users can view their own projects" ON public.candidate_projects FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Users can manage their own projects" ON public.candidate_projects FOR ALL USING (auth.uid() = candidate_id);

CREATE POLICY "Users can view their own certs" ON public.candidate_certifications FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Users can manage their own certs" ON public.candidate_certifications FOR ALL USING (auth.uid() = candidate_id);

CREATE POLICY "Users can read their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages (read status)" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- 6. SETUP STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile_photos', 'profile_photos', true),
('candidate_resumes', 'candidate_resumes', false),
('certificates', 'certificates', true),
('passport_files', 'passport_files', false),
('verification_documents', 'verification_documents', false),
('message_attachments', 'message_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Simplified: Authenticated users can upload to these buckets)
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile_photos');
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile_photos');

CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('candidate_resumes', 'certificates', 'passport_files', 'verification_documents', 'message_attachments'));
CREATE POLICY "Authenticated users can download their files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id IN ('candidate_resumes', 'certificates', 'passport_files', 'verification_documents', 'message_attachments'));
