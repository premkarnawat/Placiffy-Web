import { supabase } from './supabase';

export async function calculateCandidateScores(candidateId: string) {
  try {
    // 1. Fetch all necessary data
    const [candRes, appRes, msgRes, projRes, expRes, verifRes] = await Promise.all([
      supabase.from('candidates').select('*, candidate_profiles(*)').eq('id', candidateId).single(),
      supabase.from('applications').select('id, created_at').eq('candidate_id', candidateId),
      supabase.from('messages').select('id, created_at').eq('sender_id', candidateId),
      supabase.from('candidate_projects').select('id').eq('candidate_id', candidateId),
      supabase.from('candidate_experience').select('id, start_date, end_date').eq('candidate_id', candidateId),
      supabase.from('verifications').select('status').eq('user_id', candidateId)
    ]);

    const cand = candRes.data;
    if (!cand) throw new Error("Candidate not found");

    const apps = appRes.data || [];
    const msgs = msgRes.data || [];
    const projs = projRes.data || [];
    const exps = expRes.data || [];
    const verifs = verifRes.data || [];

    // ---------------------------------------------------------
    // ACTIVITY SCORE (Max 100)
    // ---------------------------------------------------------
    let activityScore = 0;
    
    // Base logins/activity (simulated by last_active_at recency)
    const lastActive = new Date(cand.last_active_at || cand.created_at).getTime();
    const daysSinceActive = (Date.now() - lastActive) / (1000 * 3600 * 24);
    if (daysSinceActive < 1) activityScore += 30;
    else if (daysSinceActive < 7) activityScore += 20;
    else if (daysSinceActive < 30) activityScore += 10;

    // Profile & Resume Updates
    const lastProfileUpdate = new Date(cand.last_profile_update || cand.created_at).getTime();
    const daysSinceUpdate = (Date.now() - lastProfileUpdate) / (1000 * 3600 * 24);
    if (daysSinceUpdate < 30) activityScore += 20;

    // Applications driven activity (Cap at 30 points, 5 pts per app)
    activityScore += Math.min(30, apps.length * 5);

    // Messaging activity (Cap at 20 points, 2 pts per msg)
    activityScore += Math.min(20, msgs.length * 2);

    activityScore = Math.min(100, Math.floor(activityScore));

    // ---------------------------------------------------------
    // TRUST SCORE (Max 100)
    // ---------------------------------------------------------
    // Profile Completion = 25%
    const completionPct = cand.profile_completion_pct || 0;
    const completionScore = (completionPct / 100) * 25;

    // Resume Quality = 20% (Assumed 100% if resume_url exists, else 0)
    const resumeScore = cand.resume_url ? 20 : 0;

    // Verification = 20% (Assumed 100% if verifications table has 'approved')
    const isVerified = verifs.some(v => v.status === 'approved');
    const verifScore = isVerified ? 20 : 0;

    // Portfolio & Skills = 15% (Skills presence + Projects presence)
    const hasSkills = cand.skills && cand.skills.length > 2;
    const hasProjects = projs.length > 0;
    let portfolioScore = 0;
    if (hasSkills) portfolioScore += 7.5;
    if (hasProjects) portfolioScore += 7.5;

    // Experience Consistency = 10% (Has multiple experiences or at least one long-term)
    const expScore = exps.length > 0 ? 10 : 0;

    // Activity Score Contribution = 10%
    const activityContribution = (activityScore / 100) * 10;

    const rawTrustScore = completionScore + resumeScore + verifScore + portfolioScore + expScore + activityContribution;
    const trustScore = Math.min(100, Math.floor(rawTrustScore));

    // Update the database
    await supabase.from('candidates').update({
      activity_score: activityScore,
      trust_score: trustScore
    }).eq('id', candidateId);

    // Auto-generate Passport if Trust Score >= 80 and no passport exists
    if (trustScore >= 80) {
      const { data: existingPassport } = await supabase.from('passports').select('id').eq('candidate_id', candidateId).maybeSingle();
      if (!existingPassport) {
        await supabase.from('passports').insert({
          candidate_id: candidateId,
          status: 'active',
          metadata: { generated_by: 'system_auto_trust' }
        });
      }
    }

    return { activityScore, trustScore };
  } catch (err) {
    console.error("Score calc error:", err);
    return null;
  }
}

export function getActivityLevel(score: number) {
  if (score >= 80) return 'Highly Active';
  if (score >= 50) return 'Active';
  if (score >= 20) return 'Moderate';
  if (score > 0) return 'Inactive';
  return 'Dormant';
}
