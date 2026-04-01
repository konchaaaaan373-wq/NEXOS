// ============================================================
// Pipeline
// ============================================================

export type PipelineStage =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export const PIPELINE_STAGES: {
  id: PipelineStage;
  label: string;
  color: string;
}[] = [
  { id: "applied", label: "応募済み", color: "#3b82f6" },
  { id: "screening", label: "書類選考中", color: "#8b5cf6" },
  { id: "interview", label: "面接", color: "#f59e0b" },
  { id: "offer", label: "内定", color: "#10b981" },
  { id: "hired", label: "採用", color: "#059669" },
  { id: "rejected", label: "不採用", color: "#ef4444" },
];

// ============================================================
// Roles & Users
// ============================================================

export type UserRole =
  | "neco_admin"      // Neco platform operator — full cross-clinic access
  | "neco_editor"     // Neco co-editor — can edit pages/jobs for assigned clinics
  | "clinic_admin"    // Clinic owner/admin — full access to own clinic
  | "clinic_editor";  // Clinic staff — limited edit access

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicIds: string[];   // clinics this user can access (empty = all for neco_admin)
  avatarEmoji: string;
  isActive: boolean;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  neco_admin: "Neco 管理者",
  neco_editor: "Neco 編集者",
  clinic_admin: "クリニック管理者",
  clinic_editor: "クリニック編集者",
};

export function isNecoRole(role: UserRole): boolean {
  return role === "neco_admin" || role === "neco_editor";
}

export function canEditClinic(user: AdminUser, clinicId: string): boolean {
  if (user.role === "neco_admin") return true;
  return user.clinicIds.includes(clinicId);
}

export function canManageCandidates(user: AdminUser, clinicId: string): boolean {
  return canEditClinic(user, clinicId);
}

// ============================================================
// Clinic
// ============================================================

export interface ClinicBrandConfig {
  logoEmoji: string;
  coverImageGradient: string;
  brandColor: string;
  brandColorLight: string;
  heroTagline?: string;
}

export type PageSectionType =
  | "hero"
  | "about"
  | "culture"
  | "benefits"
  | "jobs"
  | "custom";

export interface ClinicPageSection {
  id: string;
  type: PageSectionType;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  lastEditedBy?: string;   // AdminUser.id
  lastEditedAt?: string;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  description: string;
  mission: string;
  brand: ClinicBrandConfig;
  location: string;
  employeeCount: string;
  foundedYear: number;
  specialties: string[];
  benefits: string[];
  culture: string[];
  website: string;
  pageSections: ClinicPageSection[];
}

// ============================================================
// Job Posting
// ============================================================

export interface JobPosting {
  id: string;
  clinicId: string;
  title: string;
  type: "full-time" | "part-time" | "contract";
  category: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  isActive: boolean;
  publishedAt: string;
  viewCount: number;
  applyStartCount: number;
  applyCompleteCount: number;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

// ============================================================
// Application & Candidates
// ============================================================

export interface Application {
  id: string;
  jobId: string;
  clinicId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  currentPosition: string;
  yearsOfExperience: number;
  motivation: string;
  resumeFileName?: string;
  stage: PipelineStage;
  notes: CandidateNote[];
  appliedAt: string;
  updatedAt: string;
}

export interface CandidateNote {
  id: string;
  content: string;
  authorId: string;       // AdminUser.id
  authorName: string;     // denormalized for display
  authorRole: UserRole;   // denormalized for display
  createdAt: string;
}

// ============================================================
// Analytics
// ============================================================

export interface EventMetric {
  date: string;
  views: number;
  applyStarts: number;
  applyCompletes: number;
}
