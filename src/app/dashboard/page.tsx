"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { clinics, jobPostings, applications, eventMetrics } from "@/data/seed";
import { PIPELINE_STAGES } from "@/data/types";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  Building2,
  Shield,
  Bot,
  Sparkles,
  Zap,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default function DashboardPage() {
  const { currentClinic, isNeco, accessibleClinics } = useAuth();

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
      {/* Neco cross-clinic overview */}
      {isNeco && accessibleClinics.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-amber-700" />
                <h2 className="text-sm font-semibold text-amber-900">
                  Neco 横断ビュー - 全クリニック概要
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{accessibleClinics.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">管理クリニック数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{jobPostings.filter((j) => j.isActive).length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">公開求人数（全体）</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">候補者数（全体）</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {jobPostings.reduce((s, j) => s + j.viewCount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">合計閲覧数</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {accessibleClinics.map((c) => {
                  const cJobs = jobPostings.filter((j) => j.clinicId === c.id && j.isActive);
                  const cApps = applications.filter((a) => a.clinicId === c.id);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-amber-100"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: c.brand.brandColorLight }}
                      >
                        <ClinicLogo clinicId={c.id} size={20} color={c.brand.brandColor} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          求人 {cJobs.length}件 / 候補者 {cApps.length}名
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Header */}
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
          <div className="flex items-center gap-3">
            <Link href="/dashboard/ai-agent">
              <Button variant="gradient" size="sm" className="gap-1.5">
                <Bot className="h-4 w-4" />
                AI Agent
              </Button>
            </Link>
            <Link href="/dashboard/jobs/new">
              <Button variant="accent">
                <Plus className="h-4 w-4" />
                新規求人作成
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* AI Agent Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI採用エージェントが稼働中</h3>
                  <p className="text-sm text-white/80 mt-0.5">
                    求人票の最適化、候補者マッチング、採用ページ改善をAIがサポート
                  </p>
                </div>
              </div>
              <Link href="/dashboard/ai-agent">
                <Button
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0"
                >
                  <Zap className="h-4 w-4" />
                  使ってみる
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
            gradient: "from-blue-500 to-indigo-500",
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
          },
          {
            label: "候補者数",
            value: clinicApps.length,
            suffix: "名",
            icon: Users,
            gradient: "from-violet-500 to-purple-500",
            bg: "bg-gradient-to-br from-violet-50 to-purple-50",
          },
          {
            label: "合計閲覧数",
            value: totalViews.toLocaleString(),
            suffix: "",
            icon: Eye,
            gradient: "from-amber-500 to-orange-500",
            bg: "bg-gradient-to-br from-amber-50 to-orange-50",
          },
          {
            label: "応募完了率",
            value: totalApplyStarts
              ? Math.round((totalApplyCompletes / totalApplyStarts) * 100)
              : 0,
            suffix: "%",
            icon: TrendingUp,
            gradient: "from-emerald-500 to-teal-500",
            bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
          },
        ].map((metric, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className={`${metric.bg} p-2.5 rounded-xl`}>
                  <metric.icon className={`h-4 w-4 bg-gradient-to-r ${metric.gradient} bg-clip-text`} style={{ color: metric.gradient.includes("blue") ? "#3b82f6" : metric.gradient.includes("violet") ? "#8b5cf6" : metric.gradient.includes("amber") ? "#f59e0b" : "#10b981" }} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-3 tracking-tight">
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
          <Card className="border-0 shadow-sm">
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
                      <div className="w-24 h-2.5 rounded-full bg-muted overflow-hidden">
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
          <Card className="border-0 shadow-sm">
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
              <div className="flex items-end gap-2 h-32">
                {recentMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-indigo-500 to-purple-400 transition-all hover:from-indigo-400 hover:to-purple-300"
                      style={{
                        height: `${(metric.views / maxViews) * 100}%`,
                        minHeight: "8px",
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
        <Card className="border-0 shadow-sm">
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
              <div className="space-y-2">
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
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-sm font-semibold text-indigo-700">
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
                            className="text-xs rounded-lg"
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
