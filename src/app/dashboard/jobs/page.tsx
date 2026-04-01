"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobPostings, applications, adminUsers } from "@/data/seed";
import { useClinic } from "@/lib/clinic-context";
import { ROLE_LABELS } from "@/data/types";
import {
  Plus,
  Eye,
  Users,
  ArrowRight,
  Pencil,
  Shield,
  UserCircle,
  Briefcase,
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

export default function JobsManagementPage() {
  const { currentClinic } = useClinic();
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
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
            {clinicJobs.length}件の求人
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button variant="accent">
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
        <div className="space-y-4">
          {clinicJobs.map((job, i) => {
            const appCount = applications.filter(
              (a) => a.jobId === job.id
            ).length;
            const lastEditor = job.lastEditedBy
              ? adminUsers.find((u) => u.id === job.lastEditedBy)
              : null;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge
                            variant={job.isActive ? "success" : "secondary"}
                          >
                            {job.isActive ? "公開中" : "非公開"}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.category}</Badge>
                          <Badge variant="secondary">
                            {job.type === "full-time"
                              ? "常勤"
                              : job.type === "part-time"
                                ? "非常勤"
                                : "契約"}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            {job.viewCount.toLocaleString()} 閲覧
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {appCount} 応募
                          </span>
                          <span>掲載日: {formatDate(job.publishedAt)}</span>
                        </div>

                        {/* Last editor tracking */}
                        {lastEditor && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            {lastEditor.role.startsWith("neco") ? (
                              <Shield className="h-3 w-3 text-amber-600" />
                            ) : (
                              <UserCircle className="h-3 w-3" />
                            )}
                            <span>
                              最終編集: {lastEditor.name}
                              （{ROLE_LABELS[lastEditor.role]}）
                              · {formatRelativeDate(job.lastEditedAt!)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            公開ページ
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                            編集
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
