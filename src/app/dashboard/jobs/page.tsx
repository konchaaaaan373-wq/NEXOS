"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobPostings, applications, adminUsers, facilities } from "@/data/seed";
import { useClinic } from "@/lib/clinic-context";
import { ROLE_LABELS, PIPELINE_STAGES } from "@/data/types";
import {
  Plus,
  Eye,
  Users,
  ArrowRight,
  Pencil,
  Shield,
  UserCircle,
  Briefcase,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

function getDaysPosted(publishedAt: string): number {
  return Math.floor(
    (new Date("2026-04-02").getTime() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function JobsManagementPage() {
  const { currentClinic } = useClinic();
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
  );

  // Check if any facility has a staffing gap that maps to a job category
  const clinicFacilities = facilities.filter((f) => f.clinicId === currentClinic.id);
  const criticalQualifications = new Set(
    clinicFacilities.flatMap((f) =>
      f.staffingRequirements
        .filter((sr) => sr.currentCount < sr.requiredCount && sr.isComplianceCritical)
        .map((sr) => sr.qualificationName)
    )
  );

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">求人管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clinicJobs.filter((j) => j.isActive).length}件公開中 / {clinicJobs.length}件
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            新規求人作成
          </Button>
        </Link>
      </motion.div>

      {clinicJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">求人がありません</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            最初の求人を作成して、採用活動を始めましょう
          </p>
          <Link href="/dashboard/jobs/new" className="mt-6 inline-block">
            <Button variant="accent">
              <Plus className="h-4 w-4" />
              新規求人作成
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {clinicJobs.map((job, i) => {
            const jobApps = applications.filter((a) => a.jobId === job.id);
            const activeApps = jobApps.filter((a) => a.stage !== "hired" && a.stage !== "rejected");
            const lastEditor = job.lastEditedBy
              ? adminUsers.find((u) => u.id === job.lastEditedBy)
              : null;
            const daysPosted = getDaysPosted(job.publishedAt);
            const conversionRate = job.applyStartCount > 0
              ? Math.round((job.applyCompleteCount / job.applyStartCount) * 100)
              : 0;

            // Is this job category critically needed?
            const isCritical = criticalQualifications.has(job.category);

            // Pipeline summary for this job
            const pipelineSummary = PIPELINE_STAGES
              .filter((s) => s.id !== "hired" && s.id !== "rejected")
              .map((s) => ({ ...s, count: jobApps.filter((a) => a.stage === s.id).length }))
              .filter((s) => s.count > 0);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className={`transition-shadow border shadow-none hover:shadow-md ${
                  isCritical ? "border-l-4 border-l-red-400" : ""
                }`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold">{job.title}</h3>
                          <Badge
                            variant={job.isActive ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {job.isActive ? "公開中" : "非公開"}
                          </Badge>
                          {isCritical && (
                            <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                              <AlertTriangle className="h-3 w-3 mr-0.5" />
                              人員不足
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-[10px]">{job.category}</Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {job.type === "full-time" ? "常勤" : job.type === "part-time" ? "非常勤" : "契約"}
                          </Badge>
                        </div>

                        {/* Metrics row */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysPosted}日掲載中
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.viewCount.toLocaleString()}閲覧
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {jobApps.length}応募
                          </span>
                          <span>
                            完了率 {conversionRate}%
                          </span>
                        </div>

                        {/* Mini pipeline for this job */}
                        {pipelineSummary.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            {pipelineSummary.map((s) => (
                              <span key={s.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.label} {s.count}
                              </span>
                            ))}
                          </div>
                        )}

                        {lastEditor && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            {lastEditor.role.startsWith("neco") ? (
                              <Shield className="h-2.5 w-2.5 text-amber-600" />
                            ) : (
                              <UserCircle className="h-2.5 w-2.5" />
                            )}
                            {lastEditor.name} · {formatRelativeDate(job.lastEditedAt!)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {activeApps.length > 0 && (
                          <Link href={`/dashboard/candidates?jobId=${job.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              応募者 {activeApps.length}名
                            </Button>
                          </Link>
                        )}
                        <Link href={`/dashboard/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
