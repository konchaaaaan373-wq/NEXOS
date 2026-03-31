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

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  description: string;
  mission: string;
  logoEmoji: string;
  coverImageGradient: string;
  brandColor: string;
  brandColorLight: string;
  location: string;
  employeeCount: string;
  foundedYear: number;
  specialties: string[];
  benefits: string[];
  culture: string[];
  website: string;
}

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
}

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
  authorName: string;
  createdAt: string;
}

export interface EventMetric {
  date: string;
  views: number;
  applyStarts: number;
  applyCompletes: number;
}
