"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { clinics, jobPostings, applications, alerts as allAlerts, standaloneTasks, facilities, vacancyImpacts } from "@/data/seed";
import { PIPELINE_STAGES, STAGE_SLA } from "@/data/types";
import {
  Briefcase,
  Users,
  ArrowRight,
  Plus,
  AlertTriangle,
  Timer,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

// ステージ滞留日数を計算
function getDaysInStage(updatedAt: string): number {
  const now = new Date();
  return Math.floor((now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const { currentClinic, isNeco } = useAuth();

  const filterIds = isNeco ? clinics.map((c) => c.id) : [currentClinic.id];
  const clinicJobs = jobPostings.filter((j) => filterIds.includes(j.clinicId));
  const clinicApps = applications.filter((a) => filterIds.includes(a.clinicId));
  const activeJobs = clinicJobs.filter((j) => j.isActive);
  const clinicAlerts = allAlerts.filter((a) => filterIds.includes(a.clinicId) && !a.isResolved);
  const clinicFacilities = facilities.filter((f) => filterIds.includes(f.clinicId));
  const clinicVacancies = vacancyImpacts.filter((v) => clinicFacilities.some((f) => f.id === v.facilityId));

  const activeApps = clinicApps.filter((a) => a.stage !== "hired" && a.stage !== "rejected");
  const totalMonthlyImpact = clinicVacancies.reduce((sum, v) => sum + v.totalMonthlyImpact, 0);
  const criticalAlerts = clinicAlerts.filter((a) => a.severity === "critical");
  const appsWithSLA = activeApps.filter((a) => STAGE_SLA[a.stage] > 0);
  const slaBreach = appsWithSLA.filter((a) => getDaysInStage(a.updatedAt) > STAGE_SLA[a.stage]);

  // パイプライン集計
  const stageGroups = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: clinicApps.filter((a) => a.stage === stage.id).length,
  }));

  // 緊急タスク
  const urgentTasks = [
    ...clinicApps.flatMap((a) => a.tasks.filter((t) => t.status === "overdue" || (t.status === "pending" && t.priority === "urgent"))),
    ...standaloneTasks.filter((t) => filterIds.includes(t.clinicId) && (t.status === "overdue" || (t.status === "pending" && t.priority === "urgent"))),
  ];

  // 要対応の件数を集計
  const actionCount = criticalAlerts.length + slaBreach.length + urgentTasks.length;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNeco ? "Neco 管理ダッシュボード" : currentClinic.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            新規求人
          </Button>
        </Link>
      </motion.div>

      {/* メトリクス（4つに厳選） */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "公開求人", value: activeJobs.length, suffix: "件", icon: Briefcase, color: "#4f46e5" },
          { label: "選考中", value: activeApps.length, suffix: "名", icon: Users, color: "#7c3aed" },
          { label: "要対応", value: actionCount, suffix: "件", icon: AlertTriangle, color: actionCount > 0 ? "#dc2626" : "#059669" },
          { label: "SLA超過", value: slaBreach.length, suffix: "件", icon: Timer, color: slaBreach.length > 0 ? "#d97706" : "#059669" },
        ].map((metric, i) => (
          <Card key={i} className="border shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <metric.icon className="h-4 w-4" style={{ color: metric.color }} />
              </div>
              <p className="text-2xl font-bold">
                {metric.value}<span className="text-sm font-normal text-muted-foreground ml-0.5">{metric.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* 要対応アラート（欠員+SLA+緊急を統合、該当がある場合のみ表示） */}
      {(actionCount > 0 || totalMonthlyImpact > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-amber-200 bg-amber-50/30">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4" />
                対応が必要な項目
              </h3>
              <div className="space-y-2">
                {totalMonthlyImpact > 0 && (
                  <Link href="/dashboard/facilities" className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-950 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    欠員による売上影響: {(totalMonthlyImpact / 10000).toLocaleString()}万円/月
                    <ArrowRight className="h-3 w-3 ml-auto shrink-0" />
                  </Link>
                )}
                {criticalAlerts.slice(0, 2).map((a) => (
                  <Link key={a.id} href="/dashboard/operations" className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-950 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {a.title}
                  </Link>
                ))}
                {slaBreach.slice(0, 2).map((a) => (
                  <Link key={a.id} href={`/dashboard/candidates/${a.id}`} className="flex items-center gap-2 text-sm text-amber-800 hover:text-amber-950 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    SLA超過: {a.applicantName}（{PIPELINE_STAGES.find((s) => s.id === a.stage)?.label} {getDaysInStage(a.updatedAt)}日）
                  </Link>
                ))}
                {urgentTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm text-amber-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {t.status === "overdue" ? "期限超過" : "緊急"}: {t.title}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* パイプライン + 最新候補者 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* パイプライン */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">選考パイプライン</CardTitle>
                <Link href="/dashboard/candidates">
                  <Button variant="ghost" size="sm">詳細 <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stageGroups.map((stage) => (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                    <span className="text-sm flex-1">{stage.label}</span>
                    <span className="text-sm font-semibold">{stage.count}</span>
                    <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
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
            </CardContent>
          </Card>
        </motion.div>

        {/* 最新の候補者（3件に絞る） */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">最新の候補者</CardTitle>
                <Link href="/dashboard/candidates">
                  <Button variant="ghost" size="sm">すべて見る <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {clinicApps.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">まだ候補者がいません</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {clinicApps
                    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                    .slice(0, 3)
                    .map((app) => {
                      const job = jobPostings.find((j) => j.id === app.jobId);
                      const stage = PIPELINE_STAGES.find((s) => s.id === app.stage)!;
                      return (
                        <Link
                          key={app.id}
                          href={`/dashboard/candidates/${app.id}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                              {app.applicantName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium group-hover:text-accent transition-colors">{app.applicantName}</p>
                              <p className="text-xs text-muted-foreground">{job?.title}</p>
                            </div>
                          </div>
                          <Badge
                            className="text-[10px] py-0.5"
                            style={{ backgroundColor: stage.color + "12", color: stage.color }}
                          >
                            {stage.label}
                          </Badge>
                        </Link>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
