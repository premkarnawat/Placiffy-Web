import psycopg2
import sys

# The definitive list of KEEP tables (19 tables from Master Architecture)
# Plus 'users' table which seems to be used as a mirror of auth.users
KEEP_TABLES = [
    'candidates',
    'candidate_profiles',
    'candidate_education',
    'candidate_experience',
    'candidate_projects',
    'candidate_certifications',
    'candidate_links',
    'companies',
    'jobs',
    'applications',
    'conversations',
    'conversation_participants',
    'messages',
    'notifications',
    'support_tickets',
    'verifications',
    'passports',
    'subscriptions',
    'audit_logs',
    'users' # Added users to keep list as it seems some components still rely on it
]

legacy_tables = [
    'job_insights', 'interest_confirmations', 'verification_stages', 'work_sample_challenges',
    'candidate_passports', 'expert_profiles', 'expert_evaluations', 'fraud_flags',
    'candidate_embeddings', 'hiring_workflows', 'workflow_transitions', 'workflow_timeline',
    'interview_schedules', 'offers', 'invoices', 'pipeline_candidates', 'pipeline_status_history',
    'work_sample_batches', 'trust_score_history', 'reliability_events', 'reliability_scores',
    'bulk_upload_batches', 'bulk_upload_items', 'job_requirements', 'expert_scorecards',
    'community_posts', 'community_comments', 'api_keys', 'fraud_reports', 'candidate_preferences',
    'candidate_internships', 'candidate_courses', 'candidate_consents', 'candidate_resume_versions',
    'candidate_activity_logs', 'message_read_status', 'support_messages', 'support_attachments',
    'support_categories', 'faqs', 'knowledge_base', 'notification_preferences', 'ai_chat_history',
    'ai_conversations', 'ai_messages', 'ai_feedback', 'candidate_resumes', 'trust_score_events',
    'company_roles', 'candidate_shortlists', 'job_notes', 'interviews', 'billing_invoices',
    'company_subscriptions', 'company_settings', 'job_custom_fields'
]

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
    
    # We use CASCADE to drop dependent views/functions automatically
    for table in legacy_tables:
        print(f"Dropping table {table} CASCADE...")
        cur.execute(f"DROP TABLE IF EXISTS public.{table} CASCADE;")
        
    cur.close()
    conn.close()
    print("\nSUCCESS: All unnecessary legacy tables have been permanently deleted!")
except Exception as e:
    print("FAILED:", e)
