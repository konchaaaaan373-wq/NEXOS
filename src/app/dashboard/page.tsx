"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClinic } from "@/lib/clinic-context";
import { jobPostings, applications, eventMetrics } from "@/data/seed";
import { PIPELINE_STAGES } from "@/data/types";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default function DashboardPage() {
  const { currentClinic } = useClinic();

  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
  );
  const clinicApps = applications.filter(
    (a) => a.clinicId === currentClinic.id
  );
  const activeJobs = clinicJobs.filter((j) => j.isActive);

  const totalViews = clinicJobs.reduce((sum, j) => sum + j.viewCount, 0);
  const totalApplyStarts = clinicJobs.reduce(
    (sum, j) => sum + j.applyStartCount,
    0
  );
  const totalApplyCompletes = clinicJobs.reduce(
    (sum, j) => sum + j.applyCompleteCount,
    0
  );

  const recentMetrics = eventMetrics.slice(-7);
  const maxViews = Math.max(...recentMetrics.map((m) => m.views));

  const stageGroups = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: clinicApps.filter((a) => a.stage === stage.id).length,
  }));

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentClinic.name}の採用状況
            </p>
          </div>
          <Link href="/dashboard/jobs/new">
            <Button variant="accent">
              <Plus className="h-4 w-4" />
              新規求人作成
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "公開中の求人",
            value: activeJobs.length,
            suffix: "件",
            icon: Briefcase,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "候補者数",
            value: clinicApps.length,
            suffix: "名",
            icon: Users,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "合計閲覧数",
            value: totalViews.toLocaleString(),
            suffix: "",
            icon: Eye,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "応募完了率",
            value: totalApplyStarts
              ? Math.round((totalApplyCompletes / totalApplyStarts) * 100)
              : 0,
            suffix: "%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className={`${metric.bg} p-2 rounded-lg`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">
                {metric.value}
                <span className="text-base font-normal text-muted-foreground ml-0.5">
                  {metric.suffix}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>選考パイプライン</CardTitle>
                <Link href="/dashboard/candidates">
                  <Button variant="ghost" size="sm">
                    詳細
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {clinicApps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  まだ候補者がいません
                </p>
              ) : (
                <div className="space-y-3">
                  {stageGroups.map((stage) => (
                    <div key={stage.id} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm flex-1">{stage.label}</span>
                      <span className="text-sm font-semibold">
                        {stage.count}
                      </span>
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${clinicApps.length ? (stage.count / clinicApps.length) * 100 : 0}%`,
                            backgroundColor: stage.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Mini chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>閲覧数推移（7日間）</CardTitle>
                <Link href="/dashboard/analytics">
                  <Button variant="ghost" size="sm">
                    詳細
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1.5 h-32">
                {recentMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t-sm bg-accent/80 transition-all hover:bg-accent"
                      style={{
                        height: `${(metric.views / maxViews) * 100}%`,
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(metric.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent candidates */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>最新の候補者</CardTitle>
              <Link href="/dashboard/candidates">
                <Button variant="ghost" size="sm">
                  すべて見る
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {clinicApps.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  まだ候補者がいません
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  求人が公開されると、応募がここに表示されます
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clinicApps
                  .sort(
                    (a, b) =>
                      new Date(b.appliedAt).getTime() -
                      new Date(a.appliedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((app) => {
                    const job = jobPostings.find((j) => j.id === app.jobId);
                    const stage = PIPELINE_STAGES.find(
                      (s) => s.id === app.stage
                    )!;
                    return (
                      <Link
                        key={app.id}
                        href={`/dashboard/candidates/${app.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {app.applicantName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium group-hover:text-accent transition-colors">
                              {app.applicantName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {job?.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: stage.color + "15",
                              color: stage.color,
                            }}
                          >
                            {stage.label}
                          </Badge>
                          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatRelativeDate(app.appliedAt)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
