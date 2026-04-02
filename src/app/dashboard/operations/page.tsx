"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { clinics, jobPostings, applications, alerts as allAlerts, standaloneTasks } from "@/data/seed";
import { PIPELINE_STAGES, STAGE_SLA, ALERT_TYPE_LABELS } from "@/data/types";
import type { Alert, Task, AlertSeverity } from "@/data/types";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  ListTodo,
  Users,
  Briefcase,
  TrendingUp,
  XCircle,
  AlertCircle,
  Timer,
  ChevronRight,
  Circle,
  Eye,
} from "lucide-react";

function getDaysAgo(dateStr: string): string {
  const now = new Date("2026-04-02T12:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  return "直近";
}

function getDaysInStage(updatedAt: string): number {
  const now = new Date("2026-04-02");
  return Math.floor((now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
}

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
  critical: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  info: { icon: Bell, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
};

const priorityLabels = { urgent: "緊急", high: "高", medium: "中", low: "低" };
const priorityColors = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};
const statusLabels = { pending: "未着手", in_progress: "進行中", completed: "完了", overdue: "期限超過" };

export default function OperationsPage() {
  const { currentClinic, isNeco, accessibleClinics } = useAuth();
  const [showResolved, setShowResolved] = useState(false);

  // Filter by clinic (or show all for Neco)
  const filterClinicIds = isNeco
    ? accessibleClinics.map((c) => c.id)
    : [currentClinic.id];

  const filteredAlerts = allAlerts.filter(
    (a) => filterClinicIds.includes(a.clinicId) && (showResolved || !a.isResolved)
  );
  const unresolvedAlerts = allAlerts.filter(
    (a) => filterClinicIds.includes(a.clinicId) && !a.isResolved
  );

  // Collect all tasks: from applications + standalone
  const allTasks: (Task & { source?: string })[] = [];
  applications.forEach((app) => {
    if (!filterClinicIds.includes(app.clinicId)) return;
    app.tasks.forEach((t) => allTasks.push({ ...t, source: app.applicantName }));
  });
  standaloneTasks.forEach((t) => {
    if (filterClinicIds.includes(t.clinicId)) allTasks.push(t);
  });

  const pendingTasks = allTasks.filter((t) => t.status === "pending" || t.status === "overdue");
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress");
  const completedTasks = allTasks.filter((t) => t.status === "completed");

  // SLA calculation
  const activeApps = applications.filter(
    (a) => filterClinicIds.includes(a.clinicId) && a.stage !== "hired" && a.stage !== "rejected"
  );
  const appsWithSLA = activeApps.filter((a) => STAGE_SLA[a.stage] > 0);
  const appsWithinSLA = appsWithSLA.filter(
    (a) => getDaysInStage(a.updatedAt) <= STAGE_SLA[a.stage]
  );
  const slaRate = appsWithSLA.length
    ? Math.round((appsWithinSLA.length / appsWithSLA.length) * 100)
    : 100;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">採用オペレーション</h1>
            <p className="text-sm text-muted-foreground">
              {isNeco ? "全クリニック横断" : currentClinic.name} — アラート・タスク・SLA管理
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "未解決アラート",
            value: unresolvedAlerts.length,
            suffix: "件",
            icon: AlertTriangle,
            bg: unresolvedAlerts.length > 0 ? "bg-gradient-to-br from-red-50 to-rose-50" : "bg-gradient-to-br from-emerald-50 to-teal-50",
            iconColor: unresolvedAlerts.length > 0 ? "#ef4444" : "#10b981",
          },
          {
            label: "進行中タスク",
            value: pendingTasks.length + inProgressTasks.length,
            suffix: "件",
            icon: ListTodo,
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
            iconColor: "#3b82f6",
          },
          {
            label: "SLA遵守率",
            value: `${slaRate}`,
            suffix: "%",
            icon: Timer,
            bg: slaRate >= 80 ? "bg-gradient-to-br from-emerald-50 to-teal-50" : "bg-gradient-to-br from-amber-50 to-orange-50",
            iconColor: slaRate >= 80 ? "#10b981" : "#f59e0b",
          },
          {
            label: "完了タスク",
            value: completedTasks.length,
            suffix: "件",
            icon: CheckCircle2,
            bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
            iconColor: "#10b981",
          },
        ].map((m, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`${m.bg} p-2 rounded-xl`}>
                  <m.icon className="h-4 w-4" style={{ color: m.iconColor }} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {m.value}<span className="text-sm font-normal text-muted-foreground ml-0.5">{m.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  アクティブアラート
                  {unresolvedAlerts.length > 0 && (
                    <Badge className="bg-red-100 text-red-700 text-[10px]">{unresolvedAlerts.length}</Badge>
                  )}
                </CardTitle>
                <button
                  onClick={() => setShowResolved(!showResolved)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {showResolved ? "未解決のみ" : "解決済みも表示"}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">未解決のアラートはありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => {
                    const cfg = severityConfig[alert.severity];
                    const IconComp = cfg.icon;
                    const clinic = clinics.find((c) => c.id === alert.clinicId);
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border} ${alert.isResolved ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComp className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-medium ${cfg.color}`}>{alert.title}</p>
                              <Badge className={`text-[10px] border ${cfg.bg} ${cfg.color}`}>
                                {ALERT_TYPE_LABELS[alert.type]}
                              </Badge>
                              {isNeco && clinic && (
                                <Badge variant="secondary" className="text-[10px]">{clinic.name}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {getDaysAgo(alert.createdAt)}
                              </span>
                              {alert.relatedEntityId && alert.relatedEntityType === "application" && (
                                <Link
                                  href={`/dashboard/candidates/${alert.relatedEntityId}`}
                                  className="text-[10px] text-accent hover:underline flex items-center gap-0.5"
                                >
                                  対応する <ArrowRight className="h-2.5 w-2.5" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Queue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-blue-500" />
                タスクキュー
                {pendingTasks.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 text-[10px]">{pendingTasks.length + inProgressTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...pendingTasks.filter((t) => t.status === "overdue"), ...pendingTasks.filter((t) => t.status !== "overdue"), ...inProgressTasks].map((task) => {
                  const clinic = clinics.find((c) => c.id === task.clinicId);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${
                        task.status === "overdue" ? "bg-red-100" : task.status === "in_progress" ? "bg-blue-100" : "bg-amber-100"
                      }`}>
                        {task.status === "overdue" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                        ) : task.status === "in_progress" ? (
                          <Timer className="h-3.5 w-3.5 text-blue-600" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">{task.assignedToName}</span>
                          <span className="text-[10px] text-muted-foreground">期限: {task.dueDate}</span>
                          {isNeco && clinic && (
                            <Badge variant="secondary" className="text-[9px] py-0">{clinic.name}</Badge>
                          )}
                          {"source" in task && task.source && (
                            <span className="text-[10px] text-accent">{task.source as string}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-[10px] border shrink-0 ${priorityColors[task.priority]}`}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </div>
                  );
                })}
                {pendingTasks.length === 0 && inProgressTasks.length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">すべてのタスクが完了しています</p>
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">完了済み ({completedTasks.length}件)</p>
                    {completedTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg opacity-60">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <p className="text-xs line-through text-muted-foreground truncate">{task.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SLA Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-indigo-500" />
              SLA モニター
              <Badge className={`text-[10px] ${slaRate >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                遵守率 {slaRate}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeApps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">アクティブな候補者がいません</p>
            ) : (
              <div className="space-y-2">
                {activeApps
                  .map((app) => {
                    const days = getDaysInStage(app.updatedAt);
                    const sla = STAGE_SLA[app.stage];
                    const stage = PIPELINE_STAGES.find((s) => s.id === app.stage)!;
                    const job = jobPostings.find((j) => j.id === app.jobId);
                    const clinic = clinics.find((c) => c.id === app.clinicId);
                    const ratio = sla > 0 ? days / sla : 0;
                    const status = sla === 0 ? "ok" : ratio > 1 ? "breach" : ratio > 0.7 ? "warning" : "ok";
                    return { app, days, sla, stage, job, clinic, ratio, status };
                  })
                  .sort((a, b) => b.ratio - a.ratio)
                  .map(({ app, days, sla, stage, job, clinic, ratio, status }) => (
                    <Link
                      key={app.id}
                      href={`/dashboard/candidates/${app.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-semibold text-indigo-700 shrink-0">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                            {app.applicantName}
                          </p>
                          {isNeco && clinic && (
                            <Badge variant="secondary" className="text-[9px] py-0">{clinic.name}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{job?.title}</p>
                      </div>
                      <Badge
                        className="text-[10px] py-0.5 shrink-0"
                        style={{ backgroundColor: stage.color + "15", color: stage.color }}
                      >
                        {stage.label}
                      </Badge>
                      <div className="w-20 shrink-0">
                        {sla > 0 ? (
                          <>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  status === "breach" ? "bg-red-500" : status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                              />
                            </div>
                            <p className={`text-[10px] mt-0.5 text-right ${
                              status === "breach" ? "text-red-600 font-medium" : "text-muted-foreground"
                            }`}>
                              {days}/{sla}日
                            </p>
                          </>
                        ) : (
                          <p className="text-[10px] text-muted-foreground text-right">—</p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Co-management status (Neco only) */}
      {isNeco && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-0 shadow-sm border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                共同運用ステータス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {accessibleClinics.map((clinic) => {
                  const clinicAlerts = allAlerts.filter((a) => a.clinicId === clinic.id && !a.isResolved);
                  const clinicTasks = allTasks.filter((t) => t.clinicId === clinic.id && t.status !== "completed");
                  const clinicApps = applications.filter((a) => a.clinicId === clinic.id && a.stage !== "hired" && a.stage !== "rejected");
                  return (
                    <div
                      key={clinic.id}
                      className="p-4 rounded-xl bg-white border"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: clinic.brand.brandColorLight }}
                        >
                          <ClinicLogo clinicId={clinic.id} size={20} color={clinic.brand.brandColor} />
                        </div>
                        <p className="text-sm font-semibold truncate">{clinic.name}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className={`text-lg font-bold ${clinicAlerts.length > 0 ? "text-red-600" : ""}`}>
                            {clinicAlerts.length}
                          </p>
                          <p className="text-[10px] text-muted-foreground">アラート</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{clinicTasks.length}</p>
                          <p className="text-[10px] text-muted-foreground">タスク</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{clinicApps.length}</p>
                          <p className="text-[10px] text-muted-foreground">選考中</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
