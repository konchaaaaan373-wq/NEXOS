"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clinics, jobPostings, applications } from "@/data/seed";
import { Plus, Eye, Users, ArrowRight, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

const currentClinic = clinics[0];

export default function JobsManagementPage() {
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

      <div className="space-y-4">
        {clinicJobs.map((job, i) => {
          const appCount = applications.filter(
            (a) => a.jobId === job.id
          ).length;
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
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
                    </div>
                    <div className="flex items-center gap-2">
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
    </div>
  );
}
