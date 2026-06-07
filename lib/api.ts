/**
 * Placify API Client
 * Handles all communication with the FastAPI backend.
 * Automatically includes JWT token from localStorage.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://placiffy-web.onrender.com";

// ── Types ──────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  role: string;
  full_name: string;
}

export interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  required_skills: string[];
  status: string;
  applications_count: number;
  created_at: string;
  ai_analysis?: JDAnalysis;
}

export interface JDAnalysis {
  title: string;
  required_skills: string[];
  optional_skills: string[];
  experience_min: number;
  experience_max: number;
  salary_min: number;
  salary_max: number;
  location: string;
  work_mode: string;
  keywords: string[];
  interview_focus_areas: string[];
  role_summary: string;
}

export interface ATSResult {
  ats_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  location_score: number;
  salary_score: number;
  semantic_score: number;
  skills_matched: string[];
  skills_missing: string[];
  optional_matched: string[];
}

export interface TrustScore {
  trust_score: number;
  recommendation_level: string;
  recommendation: string;
  joining_probability: number;
  breakdown: Record<string, { score: number; weight: number; contribution: number }>;
}

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  education: Array<{ degree: string; institution: string; year: string }>;
  linkedin_url: string;
  github_url: string;
  fraud_risk: string;
  fraud_score: number;
}

export interface Passport {
  passport_code: string;
  candidate_id: string;
  name: string;
  passport_url: string;
  pdf_url: string;
  qr_url: string;
  trust_score: number;
  recommendation_level: string;
  recommendation: string;
  joining_probability: number;
  breakdown: TrustScore["breakdown"];
  summary: string;
  generated_at: string;
}

// ── HTTP Client ────────────────────────────────────────────────────────────
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("placify_token");
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    isFormData?: boolean
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData && body) headers["Content-Type"] = "application/json";

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: isFormData
          ? (body as FormData)
          : body
          ? JSON.stringify(body)
          : undefined,
      });

      const data = await res.json().catch(() => null);
      return { data, status: res.status, error: !res.ok ? data?.error || data?.detail : undefined };
    } catch (err) {
      return { status: 0, error: `Network error: ${err}` };
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────
  async register(email: string, password: string, fullName: string, role: string) {
    return this.request<LoginResponse>("POST", "/api/auth/register", { email, password, full_name: fullName, role });
  }

  async login(email: string, password: string, role: string) {
    const res = await this.request<LoginResponse>("POST", "/api/auth/login", { email, password, role });
    if (res.data?.access_token) {
      localStorage.setItem("placify_token", res.data.access_token);
      localStorage.setItem("placify_user", JSON.stringify({ id: res.data.user_id, role: res.data.role, name: res.data.full_name }));
    }
    return res;
  }

  async sendOtp(email: string) {
    const fd = new FormData(); fd.append("email", email);
    return this.request("POST", "/api/auth/otp/send", fd, true);
  }

  async verifyOtp(email: string, otp: string) {
    const fd = new FormData(); fd.append("email", email); fd.append("otp", otp);
    return this.request<LoginResponse>("POST", "/api/auth/otp/verify", fd, true);
  }

  logout() {
    localStorage.removeItem("placify_token");
    localStorage.removeItem("placify_user");
  }

  getUser(): { id: string; role: string; name: string } | null {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem("placify_user");
    return s ? JSON.parse(s) : null;
  }

  // ── Resume ────────────────────────────────────────────────────────────
  async parseResume(file: File): Promise<ApiResponse<{ parsed: ParsedResume; fraud_assessment: unknown }>> {
    const fd = new FormData(); fd.append("file", file);
    return this.request("POST", "/api/resume/parse", fd, true);
  }

  async screenResume(resumeText: string, jdText: string, candidateData?: object, jobData?: object) {
    const fd = new FormData();
    fd.append("resume_text", resumeText); fd.append("jd_text", jdText);
    if (candidateData) fd.append("candidate_data", JSON.stringify(candidateData));
    if (jobData) fd.append("job_data", JSON.stringify(jobData));
    return this.request<{ ats_result: ATSResult; fraud_assessment: unknown; trust_score_preview: TrustScore; jd_analysis: JDAnalysis }>("POST", "/api/resume/screen", fd, true);
  }

  // ── Jobs ──────────────────────────────────────────────────────────────
  async listJobs(params?: { status?: string; limit?: number; offset?: number; search?: string }) {
    const q = new URLSearchParams(params as Record<string, string> || {}).toString();
    return this.request<{ jobs: Job[]; total: number }>("GET", `/api/jobs${q ? "?" + q : ""}`);
  }

  async createJob(data: { title: string; description: string; department?: string; location?: string; salary_min?: number; salary_max?: number; is_urgent?: boolean }) {
    return this.request<{ job: Job; ai_analysis: JDAnalysis }>("POST", "/api/jobs", data);
  }

  async analyzeJD(jdText: string) {
    const fd = new FormData(); fd.append("jd_text", jdText);
    return this.request<{ analysis: JDAnalysis; interview_questions: unknown[] }>("POST", "/api/jobs/analyze-jd", fd, true);
  }

  async matchCandidates(jobId: string, topK = 20) {
    return this.request("POST", `/api/jobs/${jobId}/match-candidates?top_k=${topK}`);
  }

  // ── Candidates ────────────────────────────────────────────────────────
  async getMyProfile() {
    return this.request("GET", "/api/candidates/me");
  }

  async getMatchedJobs(minMatch = 80) {
    return this.request("GET", `/api/candidates/matched-jobs?min_match=${minMatch}`);
  }

  // ── Trust Score + Passport ────────────────────────────────────────────
  async computeTrustScore(scores: { ats: number; portfolio: number; work_sample: number; expert: number; communication: number; reliability: number }) {
    const fd = new FormData();
    fd.append("ats_score", String(scores.ats)); fd.append("portfolio_score", String(scores.portfolio));
    fd.append("work_sample_score", String(scores.work_sample)); fd.append("expert_score", String(scores.expert));
    fd.append("communication_score", String(scores.communication)); fd.append("reliability_score", String(scores.reliability));
    return this.request<TrustScore>("POST", "/api/trust-score/compute", fd, true);
  }

  async generatePassport() {
    return this.request<Passport>("POST", "/api/passports/generate");
  }

  // ── Bulk Screening ────────────────────────────────────────────────────
  async bulkScreen(files: File[], jdText: string) {
    const fd = new FormData();
    files.forEach(f => fd.append("files", f));
    fd.append("jd_text", jdText);
    return this.request("POST", "/api/bulk-screen", fd, true);
  }

  // ── Analytics ─────────────────────────────────────────────────────────
  async getPlatformAnalytics() {
    return this.request("GET", "/api/analytics/platform");
  }

  async getCompanyAnalytics(companyId: string) {
    return this.request("GET", `/api/analytics/company/${companyId}`);
  }

  // ── AI Assistant ──────────────────────────────────────────────────────
  async askAssistant(query: string, context?: object) {
    return this.request<{ reply: string; model: string }>("POST", "/api/assistant/chat", { query, context });
  }

  // ── Fraud ─────────────────────────────────────────────────────────────
  async assessFraud(candidateData: object) {
    return this.request("POST", "/api/fraud/assess", candidateData);
  }

  // ── Notifications ─────────────────────────────────────────────────────
  async getNotifications() {
    return this.request("GET", "/api/notifications");
  }

  // ── Health ────────────────────────────────────────────────────────────
  async health() {
    return this.request("GET", "/health");
  }
}

// Singleton
const api = new ApiClient(API_BASE);
export default api;

// ── React hook ──────────────────────────────────────────────────────────────
export function useAuth() {
  if (typeof window === "undefined") return { user: null, token: null };
  const user = api.getUser();
  const token = localStorage.getItem("placify_token");
  return { user, token, isAuthenticated: !!token };
}
