"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { clinics, jobPostings, applications, alerts as allAlerts, standaloneTasks } from "@/data/seed";
import { PIPELINE_STAGES, STAGE_SLA, ALERT_TYPE_LABELS } from "@/data/types";
import type { Alert, Task, AlertSeverity } from "@/data/types";
import {
  AlertTriangle, Bell, CheckCircle2, Clock, Shield, ArrowRight,
  ListTodo, Users, Briefcase, TrendingUp, XCircle, AlertCircle,
  Timer, ChevronRight, Circle,
} from "lucide-react";

// ============================================================
// Helper functions
// ============================================================

const NOW = new Date("2026-04-02T12:00:00Z");

function getDaysInStage(app: (typeof applications)[number]): number {
  const updated = new Date(app.updatedAt);
  const diffMs = NOW.getTime() - updated.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getSLAStatus(app: (typeof applications)[number]): "ok" | "warning" | "breach" {
  const days = getDaysInStage(app);
  const limit = STAGE_SLA[app.stage];
  if (limit === 0) return "ok";
  if (days > limit) return "breach";
  if (days >= limit * 0.7) return "warning";
  return "ok";
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = NOW.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  return `${diffDays}日前`;
}

function getSeverityIcon(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4.5 w-4.5 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-4.5 w-4.5 text-amber-500" />;
    case "info":
      return <Bell className="h-4.5 w-4.5 text-blue-500" />;
  }
}

function getSeverityBg(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return "bg-red-50";
    case "warning":
      return "bg-amber-50";
    case "info":
      return "bg-blue-50";
  }
}

function getSeverityBorder(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return "border-l-red-400";
    case "warning":
      return "border-l-amber-400";
    case "info":
      return "border-l-blue-400";
  }
}

function getPriorityBadge(priority: Task["priority"]) {
  switch (priority) {
    case "urgent":
      return <Badge className="bg-red-100 text-red-700 border-0">緊急</Badge>;
    case "high":
      return <Badge className="bg-amber-100 text-amber-700 border-0">高</Badge>;
    case "medium":
      return <Badge className="bg-blue-100 text-blue-700 border-0">中</Badge>;
    case "low":
      return <Badge className="bg-slate-100 text-slate-600 border-0">低</Badge>;
  }
}

function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "overdue":
      return "text-red-600";
    case "pending":
      return "text-amber-600";
    case "in_progress":
      return "text-blue-600";
    case "completed":
      return "text-emerald-600";
  }
}

function getStatusLabel(status: Task["status"]) {
  switch (status) {
    case "overdue":
      return "期限超過";
    case "pending":
      return "未着手";
    case "in_progress":
      return "進行中";
    case "completed":
      return "完了";
  }
}

// ============================================================
// Page component
// ============================================================

export default function OperationsPage() {
  const { currentClinic, isNeco } = useAuth();
  const [showResolved, setShowResolved] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // --- Filter data based on role ---
  const clinicAlerts = isNeco
    ? allAlerts
    : allAlerts.filter((a) => a.clinicId === currentClinic.id);

  const unresolvedAlerts = clinicAlerts.filter((a) => !a.isResolved);
  const resolvedAlerts = clinicAlerts.filter((a) => a.isResolved);

  // Gather all tasks: from applications + standalone
  const allApplicationTasks = applications
    .filter((app) => isNeco || app.clinicId === currentClinic.id)
    .flatMap((app) => app.tasks);
  const filteredStandalone = isNeco
    ? standaloneTasks
    : standaloneTasks.filter((t) => t.clinicId === currentClinic.id);
  const allTasks = [...allApplicationTasks, ...filteredStandalone];

  const overdueTasks = allTasks.filter((t) => t.status === "overdue");
  const pendingTasks = allTasks.filter((t) => t.status === "pending");
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress");
  const completedTasks = allTasks.filter((t) => t.status === "completed");

  // Active applications (non-terminal stages)
  const activeApplications = applications
    .filter((app) => isNeco || app.clinicId === currentClinic.id)
    .filter((app) => app.stage !== "hired" && app.stage !== "rejected");

  // SLA compliance calculation
  const slaCompliant = activeApplications.filter(
    (app) => getSLAStatus(app) !== "breach"
  ).length;
  const slaRate = activeApplications.length > 0
    ? Math.round((slaCompliant / activeApplications.length) * 100)
    : 100;

  // Stage info lookup
  const getStageInfo = (stageId: string) =>
    PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0];

  // Get clinic name by id
  const getClinicName = (clinicId: string) =>
    clinics.find((c) => c.id === clinicId)?.name || clinicId;

  // Alert link builder
  const getAlertLink = (alert: Alert) => {
    if (alert.relatedEntityType === "application") {
      return `/dashboard/candidates?id=${alert.relatedEntityId}`;
    }
    if (alert.relatedEntityType === "job") {
      return `/dashboard/jobs?id=${alert.relatedEntityId}`;
    }
    return "/dashboard/operations";
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* ====== Header ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">採用オペレーション</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isNeco ? "全クリニックの採用ハーネス状況" : `${currentClinic.name} の採用ハーネス状況`}
          </p>
        </div>
      </motion.div>

      {/* ====== Alert Summary Bar ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "未解決アラート",
            value: unresolvedAlerts.length,
            icon: AlertTriangle,
            color: unresolvedAlerts.length > 0 ? "text-red-600" : "text-slate-600",
            bg: unresolvedAlerts.length > 0 ? "bg-red-50" : "bg-slate-50",
          },
          {
            label: "進行中タスク",
            value: pendingTasks.length + inProgressTasks.length,
            icon: ListTodo,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "SLA遵守率",
            value: `${slaRate}%`,
            icon: Timer,
            color: slaRate >= 80 ? "text-emerald-600" : slaRate >= 50 ? "text-amber-600" : "text-red-600",
            bg: slaRate >= 80 ? "bg-emerald-50" : slaRate >= 50 ? "bg-amber-50" : "bg-red-50",
          },
          {
            label: "完了タスク",
            value: completedTasks.length,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((metric, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className={`${metric.bg} p-2 rounded-xl`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ====== Active Alerts Section ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-50">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                </div>
                アクティブアラート
                {unresolvedAlerts.length > 0 && (
                  <Badge className="bg-red-100 text-red-700 border-0 ml-1">
                    {unresolvedAlerts.length}
                  </Badge>
                )}
              </CardTitle>
              {resolvedAlerts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResolved(!showResolved)}
                  className="text-muted-foreground"
                >
                  {showResolved ? "解決済みを非表示" : `解決済み (${resolvedAlerts.length}) を表示`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {unresolvedAlerts.length === 0 && !showResolved ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 rounded-2xl bg-emerald-50 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-slate-700">すべてのアラートが解決済みです</p>
                <p className="text-xs text-muted-foreground mt-1">現在対応が必要なアラートはありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unresolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${getSeverityBorder(alert.severity)} ${getSeverityBg(alert.severity)}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">
                          {alert.title}
                        </span>
                        <Badge className="bg-white/80 text-slate-600 border border-slate-200 text-[10px]">
                          {ALERT_TYPE_LABELS[alert.type]}
                        </Badge>
                        {isNeco && (
                          <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[10px]">
                            {getClinicName(alert.clinicId)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        <Clock className="inline h-3 w-3 mr-0.5 -mt-px" />
                        {getRelativeTime(alert.createdAt)}
                      </p>
                    </div>
                    {alert.relatedEntityId && (
                      <Link href={getAlertLink(alert)} className="shrink-0">
                        <Button variant="outline" size="sm" className="gap-1 text-xs">
                          対応する
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}

                {showResolved && resolvedAlerts.length > 0 && (
                  <>
                    <div className="border-t border-slate-200 my-4" />
                    <p className="text-xs text-muted-foreground font-medium mb-2">解決済み</p>
                    {resolvedAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 opacity-60"
                      >
                        <div className="mt-0.5 shrink-0">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-600 line-through">
                              {alert.title}
                            </span>
                            <Badge className="bg-slate-100 text-slate-500 border-0 text-[10px]">
                              {ALERT_TYPE_LABELS[alert.type]}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Task Queue Section ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-50">
                  <ListTodo className="h-4.5 w-4.5 text-violet-500" />
                </div>
                タスクキュー
                <Badge className="bg-violet-100 text-violet-700 border-0 ml-1">
                  {allTasks.length}
                </Badge>
              </CardTitle>
              {completedTasks.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="text-muted-foreground"
                >
                  {showCompleted ? "完了を非表示" : `完了 (${completedTasks.length}) を表示`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {allTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 mb-4">
                  <ListTodo className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">タスクはありません</p>
                <p className="text-xs text-muted-foreground mt-1">現在割り当てられているタスクはありません</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Overdue tasks */}
                {overdueTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">期限超過 ({overdueTasks.length})</p>
                    </div>
                    {overdueTasks.map((task) => (
                      <TaskRow key={task.id} task={task} isNeco={isNeco} getClinicName={getClinicName} />
                    ))}
                  </div>
                )}

                {/* Pending tasks */}
                {pendingTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-amber-500" />
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">未着手 ({pendingTasks.length})</p>
                    </div>
                    {pendingTasks.map((task) => (
                      <TaskRow key={task.id} task={task} isNeco={isNeco} getClinicName={getClinicName} />
                    ))}
                  </div>
                )}

                {/* In progress tasks */}
                {inProgressTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Timer className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">進行中 ({inProgressTasks.length})</p>
                    </div>
                    {inProgressTasks.map((task) => (
                      <TaskRow key={task.id} task={task} isNeco={isNeco} getClinicName={getClinicName} />
                    ))}
                  </div>
                )}

                {/* Completed tasks (collapsed by default) */}
                {showCompleted && completedTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">完了 ({completedTasks.length})</p>
                    </div>
                    {completedTasks.map((task) => (
                      <TaskRow key={task.id} task={task} isNeco={isNeco} getClinicName={getClinicName} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== SLA Monitor Section ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              </div>
              SLA モニター
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">アクティブな候補者はいません</p>
                <p className="text-xs text-muted-foreground mt-1">選考中の候補者が表示されます</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeApplications.map((app) => {
                  const days = getDaysInStage(app);
                  const limit = STAGE_SLA[app.stage];
                  const status = getSLAStatus(app);
                  const stageInfo = getStageInfo(app.stage);
                  const progress = limit > 0 ? Math.min((days / limit) * 100, 100) : 0;
                  const progressBarColor =
                    status === "breach"
                      ? "bg-red-500"
                      : status === "warning"
                        ? "bg-amber-400"
                        : "bg-emerald-500";

                  return (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-indigo-600">
                              {app.applicantName.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {app.applicantName}
                            </p>
                            {isNeco && (
                              <p className="text-[10px] text-muted-foreground">
                                {getClinicName(app.clinicId)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            className="border-0 text-[10px]"
                            style={{
                              backgroundColor: `${stageInfo.color}15`,
                              color: stageInfo.color,
                            }}
                          >
                            {stageInfo.label}
                          </Badge>
                          <Link href={`/dashboard/candidates?id=${app.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {limit > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">
                              {days}日経過 / SLA {limit}日
                            </span>
                            {status === "breach" && (
                              <span className="text-red-500 font-semibold flex items-center gap-0.5">
                                <AlertTriangle className="h-3 w-3" />
                                超過
                              </span>
                            )}
                            {status === "warning" && (
                              <span className="text-amber-500 font-medium">注意</span>
                            )}
                            {status === "ok" && (
                              <span className="text-emerald-500 font-medium">正常</span>
                            )}
                          </div>
                          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={`h-full rounded-full ${progressBarColor}`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Co-Management Section (Neco only) ====== */}
      {isNeco && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100">
                  <Briefcase className="h-4.5 w-4.5 text-amber-600" />
                </div>
                共同運用ステータス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clinics.map((clinic) => {
                  const clinicAlertCount = allAlerts.filter(
                    (a) => a.clinicId === clinic.id && !a.isResolved
                  ).length;
                  const clinicTaskCount = [
                    ...applications
                      .filter((app) => app.clinicId === clinic.id)
                      .flatMap((app) => app.tasks),
                    ...standaloneTasks.filter((t) => t.clinicId === clinic.id),
                  ].filter((t) => t.status === "pending" || t.status === "in_progress").length;
                  const clinicAppCount = applications.filter(
                    (app) =>
                      app.clinicId === clinic.id &&
                      app.stage !== "hired" &&
                      app.stage !== "rejected"
                  ).length;

                  return (
                    <div
                      key={clinic.id}
                      className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                          style={{ backgroundColor: clinic.brand.brandColor }}
                        >
                          {clinic.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {clinic.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{clinic.location}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-red-50">
                          <p className="text-lg font-bold text-red-600">{clinicAlertCount}</p>
                          <p className="text-[10px] text-red-500">アラート</p>
                        </div>
                        <div className="p-2 rounded-xl bg-amber-50">
                          <p className="text-lg font-bold text-amber-600">{clinicTaskCount}</p>
                          <p className="text-[10px] text-amber-500">タスク</p>
                        </div>
                        <div className="p-2 rounded-xl bg-indigo-50">
                          <p className="text-lg font-bold text-indigo-600">{clinicAppCount}</p>
                          <p className="text-[10px] text-indigo-500">候補者</p>
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

// ============================================================
// Task Row Component
// ============================================================

function TaskRow({
  task,
  isNeco,
  getClinicName,
}: {
  task: Task;
  isNeco: boolean;
  getClinicName: (id: string) => string;
}) {
  const isOverdue = task.status === "overdue";
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors ${
        isOverdue
          ? "bg-red-50/80"
          : isCompleted
            ? "bg-emerald-50/50 opacity-70"
            : "bg-slate-50/80 hover:bg-slate-50"
      }`}
    >
      <div className="shrink-0">{getPriorityBadge(task.priority)}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            {task.assignedToName}
          </span>
          {isNeco && (
            <Badge className="bg-indigo-50 text-indigo-600 border-0 text-[10px] py-0">
              {getClinicName(task.clinicId)}
            </Badge>
          )}
          <span className={`text-[11px] ${getStatusColor(task.status)} font-medium`}>
            {getStatusLabel(task.status)}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-[11px] ${isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
          <Clock className="inline h-3 w-3 mr-0.5 -mt-px" />
          {task.dueDate}
        </p>
      </div>
      {task.applicationId && (
        <Link href={`/dashboard/candidates?id=${task.applicationId}`} className="shrink-0">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </Link>
      )}
    </div>
  );
}
