-- Performance indexes for NEXOS
-- These indexes optimize the most common query patterns

-- Job search: filter by clinic + active status
CREATE INDEX IF NOT EXISTS "idx_job_postings_clinic_active" ON "JobPosting" ("clinicId", "isActive");

-- Job search: filter by category
CREATE INDEX IF NOT EXISTS "idx_job_postings_category" ON "JobPosting" ("category");

-- Job search: filter by active + published date for sorting
CREATE INDEX IF NOT EXISTS "idx_job_postings_active_published" ON "JobPosting" ("isActive", "publishedAt" DESC);

-- Application pipeline: filter by clinic + stage
CREATE INDEX IF NOT EXISTS "idx_applications_clinic_stage" ON "Application" ("clinicId", "stage");

-- Application pipeline: filter by job + stage
CREATE INDEX IF NOT EXISTS "idx_applications_job_stage" ON "Application" ("jobId", "stage");

-- Application sorting: most recent first
CREATE INDEX IF NOT EXISTS "idx_applications_applied_at" ON "Application" ("clinicId", "appliedAt" DESC);

-- Analytics: metrics by clinic and date range
CREATE INDEX IF NOT EXISTS "idx_event_metrics_clinic_date" ON "EventMetric" ("clinicId", "date" DESC);

-- Notes: fetch by application
CREATE INDEX IF NOT EXISTS "idx_candidate_notes_application" ON "CandidateNote" ("applicationId", "createdAt" DESC);

-- Membership: user clinic lookup
CREATE INDEX IF NOT EXISTS "idx_clinic_members_user" ON "ClinicMember" ("userId");

-- Clinic: slug lookup (already has unique constraint, just documenting)
-- CREATE INDEX IF NOT EXISTS "idx_clinic_slug" ON "Clinic" ("slug");
