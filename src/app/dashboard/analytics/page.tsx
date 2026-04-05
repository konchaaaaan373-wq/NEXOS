"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobPostings, applications, eventMetrics, alerts as allAlerts } from "@/data/seed";
import { useClinic } from "@/lib/clinic-context";
import { PIPELINE_STAGES, STAGE_SLA } from "@/data/types";
import type { PipelineStage } from "@/data/types";
import {
  Eye,
  MousePointerClick,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Timer,
  ArrowRight,
  Clock,
} from "lucide-react";

function getDaysInStage(updatedAt: string): number {
  const now = new Date();
  const updated = new Date(updatedAt);
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AnalyticsPage() {
  const { currentClinic } = useClinic();
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
  );
  const clinicApps = applications.filter(
    (a) => a.clinicId === currentClinic.id
  );
  const clinicAlerts = allAlerts.filter(
    (a) => a.clinicId === currentClinic.id && !a.isResolved
  );

  const totalViews = clinicJobs.reduce((sum, j) => sum + j.viewCount, 0);
  const totalApplyStarts = clinicJobs.reduce(
    (sum, j) => sum + j.applyStartCount, 0
  );
  const totalApplyCompletes = clinicJobs.reduce(
    (sum, j) => sum + j.applyCompleteCount, 0
  );
  const conversionRate = totalApplyStarts
    ? Math.round((totalApplyCompletes / totalApplyStarts) * 100)
    : 0;

  const last14Days = eventMetrics.slice(-14);
  const maxMetric = Math.max(
    ...last14Days.map((m) => Math.max(m.views, m.applyStarts * 5, m.applyCompletes * 10))
  );

  const stageData = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: clinicApps.filter((a) => a.stage === stage.id).length,
  }));
  const maxStageCount = Math.max(...stageData.map((s) => s.count), 1);

  // SLA compliance calculation
  const activeApps = clinicApps.filter(
    (a) => a.stage !== "hired" && a.stage !== "rejected"
  );
  const appsWithSLA = activeApps.filter((a) => STAGE_SLA[a.stage] > 0);
  const appsWithinSLA = appsWithSLA.filter(
    (a) => getDaysInStage(a.updatedAt) <= STAGE_SLA[a.stage]
  );
  const slaComplianceRate = appsWithSLA.length
    ? Math.round((appsWithinSLA.length / appsWithSLA.length) * 100)
    : 100;

  // Stage velocity (avg days per stage from stageHistory)
  const stageVelocity: Record<string, { total: number; count: number }> = {};
  clinicApps.forEach((app) => {
    if (!app.stageHistory) return;
    for (let i = 0; i < app.stageHistory.length; i++) {
      const change = app.stageHistory[i];
      const prevDate = i === 0 ? app.appliedAt : app.stageHistory[i - 1].changedAt;
      const days = Math.floor(
        (new Date(change.changedAt).getTime() - new Date(prevDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (!stageVelocity[change.from]) stageVelocity[change.from] = { total: 0, count: 0 };
      stageVelocity[change.from].total += days;
      stageVelocity[change.from].count += 1;
    }
  });

  // Stagnation list
  const stagnantApps = activeApps
    .map((app) => ({
      app,
      days: getDaysInStage(app.updatedAt),
      sla: STAGE_SLA[app.stage],
      stage: PIPELINE_STAGES.find((s) => s.id === app.stage)!,
    }))
    .filter((x) => x.sla > 0 && x.days > x.sla * 0.5)
    .sort((a, b) => b.days / b.sla - a.days / a.sla);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">採用分析</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            採用ファネル・SLA遵守率・ステージ速度の分析
          </p>
        </div>
        <Link href="/dashboard/operations">
          <Button variant="outline" size="sm" className="gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            オペレーション
          </Button>
        </Link>
      </motion.div>

      {/* Top metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { label: "総閲覧数", value: totalViews.toLocaleString(), icon: Eye, bg: "bg-gradient-to-br from-blue-50 to-indigo-50", iconColor: "#3b82f6" },
          { label: "応募開始", value: totalApplyStarts.toLocaleString(), icon: MousePointerClick, bg: "bg-gradient-to-br from-violet-50 to-purple-50", iconColor: "#8b5cf6" },
          { label: "応募完了", value: totalApplyCompletes.toLocaleString(), icon: CheckCircle2, bg: "bg-gradient-to-br from-emerald-50 to-teal-50", iconColor: "#10b981" },
          { label: "完了率", value: `${conversionRate}%`, icon: TrendingUp, bg: "bg-gradient-to-br from-amber-50 to-orange-50", iconColor: "#f59e0b" },
          { label: "SLA遵守率", value: `${slaComplianceRate}%`, icon: Timer, bg: slaComplianceRate >= 80 ? "bg-gradient-to-br from-emerald-50 to-teal-50" : "bg-gradient-to-br from-red-50 to-rose-50", iconColor: slaComplianceRate >= 80 ? "#10b981" : "#ef4444" },
        ].map((metric, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <div className={`${metric.bg} p-2 rounded-lg`}>
                  <metric.icon className="h-4 w-4" style={{ color: metric.iconColor }} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily metrics chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                日別推移（14日間）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /> 閲覧数</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-500" /> 応募開始</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> 応募完了</div>
                </div>
                <div className="space-y-2">
                  {last14Days.map((metric, i) => {
                    const date = new Date(metric.date);
                    const label = `${date.getMonth() + 1}/${date.getDate()}`;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{label}</span>
                        <div className="flex-1 flex gap-0.5">
                          <div className="h-4 rounded-l-sm bg-blue-500/80 transition-all" style={{ width: `${(metric.views / maxMetric) * 100}%`, minWidth: "2px" }} />
                          <div className="h-4 bg-violet-500/80 transition-all" style={{ width: `${((metric.applyStarts * 5) / maxMetric) * 100}%`, minWidth: "1px" }} />
                          <div className="h-4 rounded-r-sm bg-emerald-500/80 transition-all" style={{ width: `${((metric.applyCompletes * 10) / maxMetric) * 100}%`, minWidth: "1px" }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 shrink-0">{metric.views}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipeline funnel + Stage velocity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>選考パイプライン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stageData.map((stage, i) => (
                  <div key={stage.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                        {stage.label}
                      </span>
                      <span className="font-semibold">{stage.count}名</span>
                    </div>
                    <div className="h-6 rounded-lg bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stage.count / maxStageCount) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-lg"
                        style={{ backgroundColor: stage.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage velocity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                ステージ平均滞在日数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PIPELINE_STAGES.filter((s) => s.id !== "hired" && s.id !== "rejected").map((stage) => {
                  const vel = stageVelocity[stage.id];
                  const avgDays = vel ? Math.round(vel.total / vel.count) : null;
                  const sla = STAGE_SLA[stage.id];
                  const breached = avgDays !== null && sla > 0 && avgDays > sla;
                  return (
                    <div key={stage.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                      <span className="text-sm flex-1">{stage.label}</span>
                      <span className={`text-sm font-semibold ${breached ? "text-red-600" : ""}`}>
                        {avgDays !== null ? `${avgDays}日` : "—"}
                      </span>
                      {sla > 0 && (
                        <span className="text-xs text-muted-foreground">/ SLA {sla}日</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stagnation Monitor + Per-job stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stagnation monitor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                滞留モニター
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stagnantApps.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">SLA内で全候補者が対応されています</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stagnantApps.map(({ app, days, sla, stage }) => {
                    const ratio = days / sla;
                    const isBreached = ratio > 1;
                    return (
                      <Link
                        key={app.id}
                        href={`/dashboard/candidates/${app.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-semibold text-indigo-700 shrink-0">
                          {app.applicantName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                            {app.applicantName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              className="text-[10px] py-0"
                              style={{ backgroundColor: stage.color + "15", color: stage.color }}
                            >
                              {stage.label}
                            </Badge>
                            <span className={`text-xs font-medium ${isBreached ? "text-red-600" : "text-amber-600"}`}>
                              {days}日 / SLA {sla}日
                            </span>
                          </div>
                        </div>
                        <div className="w-16">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isBreached ? "bg-red-500" : "bg-amber-500"}`}
                              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                            />
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

        {/* Per-job stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>求人別パフォーマンス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicJobs.map((job) => {
                  const appCount = clinicApps.filter((a) => a.jobId === job.id).length;
                  const cr = job.applyStartCount
                    ? Math.round((job.applyCompleteCount / job.applyStartCount) * 100)
                    : 0;
                  return (
                    <div key={job.id} className="p-4 rounded-lg bg-muted/30 space-y-2">
                      <h4 className="text-sm font-medium">{job.title}</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{job.viewCount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">閲覧</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{appCount}</p>
                          <p className="text-xs text-muted-foreground">応募</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{cr}%</p>
                          <p className="text-xs text-muted-foreground">完了率</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
