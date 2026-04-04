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

// 各段階の対応期限（この日数を超えると「対応が遅れている」と判定）
export const STAGE_SLA: Record<PipelineStage, number> = {
  applied: 2,      // 応募が来たら2日以内に返事する
  screening: 5,    // 書類選考は5日以内に結果を出す
  interview: 7,    // 面接は7日以内に日程を決める
  offer: 3,        // 内定を出したら3日以内にフォローする
  hired: 0,        // 完了
  rejected: 0,     // 完了
};

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
  avatarUrl?: string;
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
  logoIcon: string;
  coverImageGradient: string;
  brandColor: string;
  brandColorLight: string;
  heroTagline?: string;
  logoUrl?: string;
  coverImageUrl?: string;
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
  lastEditedBy?: string;
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
// Publication Readiness Checklist
// ============================================================

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  check: (job: JobPosting) => boolean;
  severity: "required" | "recommended";
}

export const JOB_PUBLISH_CHECKLIST: ChecklistItem[] = [
  {
    id: "title",
    label: "求人タイトルが設定されている",
    description: "具体的で検索されやすいタイトルを設定",
    check: (j) => j.title.length >= 5,
    severity: "required",
  },
  {
    id: "description",
    label: "求人詳細が十分に記載されている",
    description: "200文字以上の具体的な説明",
    check: (j) => j.description.length >= 200,
    severity: "required",
  },
  {
    id: "salary",
    label: "給与レンジが設定されている",
    description: "最低・最高給与が正しく設定",
    check: (j) => j.salaryMin > 0 && j.salaryMax > j.salaryMin,
    severity: "required",
  },
  {
    id: "requirements",
    label: "必須要件が記載されている",
    description: "応募に必要な資格・経験を明記",
    check: (j) => j.requirements.length >= 1 && j.requirements[0].length > 0,
    severity: "required",
  },
  {
    id: "benefits",
    label: "福利厚生・待遇が記載されている",
    description: "応募意欲を高める待遇情報",
    check: (j) => j.benefits.length >= 1,
    severity: "recommended",
  },
  {
    id: "nice-to-have",
    label: "歓迎条件が記載されている",
    description: "間口を広げる歓迎条件の記載",
    check: (j) => j.niceToHave.length >= 1,
    severity: "recommended",
  },
];

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
  tasks: Task[];
  stageHistory: StageChange[];
  appliedAt: string;
  updatedAt: string;
}

export interface CandidateNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
}

export interface StageChange {
  id: string;
  from: PipelineStage;
  to: PipelineStage;
  changedBy: string;       // AdminUser.id
  changedByName: string;
  changedAt: string;
  note?: string;
}

// ============================================================
// Harness: Tasks & Follow-ups
// ============================================================

export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  clinicId: string;
  applicationId?: string;  // optional: linked to specific candidate
  jobId?: string;          // optional: linked to specific job
  title: string;
  description?: string;
  assignedTo: string;      // AdminUser.id
  assignedToName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// Harness: Alerts
// ============================================================

export type AlertType =
  | "stagnation"          // candidate stuck in stage too long
  | "unresponded"         // application not responded to
  | "interview_unset"     // interview stage but no interview scheduled
  | "sla_breach"          // SLA exceeded
  | "kpi_drop"            // KPI fell below threshold
  | "job_incomplete";     // job missing required fields

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  clinicId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  relatedEntityId?: string;    // application ID, job ID, etc.
  relatedEntityType?: "application" | "job" | "clinic";
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  stagnation: "対応が止まっている",
  unresponded: "まだ返事していない",
  interview_unset: "面接日程が未定",
  sla_breach: "対応期限を過ぎている",
  kpi_drop: "数字が下がっている",
  job_incomplete: "求人情報が不足",
};

// ============================================================
// Analytics
// ============================================================

export interface EventMetric {
  date: string;
  views: number;
  applyStarts: number;
  applyCompletes: number;
}

// ============================================================
// Workforce / Compliance Layer
// ============================================================

export interface Qualification {
  id: string;
  name: string;           // e.g. "正看護師", "准看護師", "介護福祉士"
  category: string;       // e.g. "看護", "介護", "リハビリ", "事務"
  isRequired?: boolean;   // for staffing requirements
}

export const QUALIFICATION_MASTER: Qualification[] = [
  { id: "q-1", name: "正看護師", category: "看護" },
  { id: "q-2", name: "准看護師", category: "看護" },
  { id: "q-3", name: "保健師", category: "看護" },
  { id: "q-4", name: "介護福祉士", category: "介護" },
  { id: "q-5", name: "理学療法士", category: "リハビリ" },
  { id: "q-6", name: "作業療法士", category: "リハビリ" },
  { id: "q-7", name: "言語聴覚士", category: "リハビリ" },
  { id: "q-8", name: "医師", category: "医療" },
  { id: "q-9", name: "薬剤師", category: "医療" },
  { id: "q-10", name: "臨床検査技師", category: "医療" },
  { id: "q-11", name: "医療事務", category: "事務" },
  { id: "q-12", name: "管理者", category: "管理" },
];

export interface Facility {
  id: string;
  clinicId: string;       // parent organization
  name: string;
  type: "visiting_nursing" | "clinic" | "hospital" | "care_facility" | "other";
  location: string;
  staffingRequirements: StaffingRequirement[];
  complianceRules: ComplianceRule[];
}

export const FACILITY_TYPES: Record<Facility["type"], string> = {
  visiting_nursing: "訪問看護ステーション",
  clinic: "クリニック",
  hospital: "病院",
  care_facility: "介護施設",
  other: "その他",
};

export interface StaffingRequirement {
  id: string;
  facilityId: string;
  qualificationId: string;  // required qualification
  qualificationName: string;
  requiredCount: number;    // required headcount (常勤換算)
  currentCount: number;     // current headcount
  employmentType: "full-time" | "part-time" | "either";
  isComplianceCritical: boolean;  // true if under = losing certification/加算
  linkedComplianceRuleId?: string;
}

export interface ComplianceRule {
  id: string;
  facilityId: string;
  name: string;              // e.g. "機能強化型訪問看護管理療養費1"
  description: string;
  type: "facility_standard" | "additional_fee";  // 施設基準 or 加算
  requiredStaffing: string;  // human-readable requirement
  monthlyRevenueImpact: number;  // 月額売上影響額 (円)
  isMet: boolean;            // currently meeting the requirement?
  riskLevel: "safe" | "at_risk" | "critical";
}

export interface VacancyImpact {
  facilityId: string;
  facilityName: string;
  qualificationName: string;
  shortage: number;          // how many people short
  affectedRules: {
    ruleName: string;
    monthlyImpact: number;
    riskLevel: "at_risk" | "critical";
  }[];
  totalMonthlyImpact: number;  // sum of all affected rules
  recommendedAction: string;
}

// Candidate source tracking
export type CandidateSource =
  | "自社応募"
  | "人材紹介"
  | "ハローワーク"
  | "リファラル"
  | "求人媒体"
  | "その他";

export interface CandidateQualification {
  qualificationId: string;
  qualificationName: string;
  verified: boolean;
  verifiedAt?: string;
  expiresAt?: string;
}

export interface OnboardingTask {
  id: string;
  applicationId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  category: "document" | "qualification" | "orientation" | "other";
}
