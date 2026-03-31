"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clinics, jobPostings, applications, eventMetrics } from "@/data/seed";
import { PIPELINE_STAGES } from "@/data/types";
import {
  Eye,
  MousePointerClick,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const currentClinic = clinics[0];

export default function AnalyticsPage() {
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
  );
  const clinicApps = applications.filter(
    (a) => a.clinicId === currentClinic.id
  );

  const totalViews = clinicJobs.reduce((sum, j) => sum + j.viewCount, 0);
  const totalApplyStarts = clinicJobs.reduce(
    (sum, j) => sum + j.applyStartCount,
    0
  );
  const totalApplyCompletes = clinicJobs.reduce(
    (sum, j) => sum + j.applyCompleteCount,
    0
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

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">分析</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          採用ファネルと求人パフォーマンスの概要
        </p>
      </motion.div>

      {/* Top metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "総閲覧数",
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "応募開始数",
            value: totalApplyStarts.toLocaleString(),
            icon: MousePointerClick,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "応募完了数",
            value: totalApplyCompletes.toLocaleString(),
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "応募完了率",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50",
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5" />
                日別推移（14日間）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Legend */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    閲覧数
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-violet-500" />
                    応募開始
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                    応募完了
                  </div>
                </div>

                {/* Chart */}
                <div className="space-y-2">
                  {last14Days.map((metric, i) => {
                    const date = new Date(metric.date);
                    const label = `${date.getMonth() + 1}/${date.getDate()}`;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                          {label}
                        </span>
                        <div className="flex-1 flex gap-0.5">
                          <div
                            className="h-4 rounded-l-sm bg-blue-500/80 transition-all"
                            style={{
                              width: `${(metric.views / maxMetric) * 100}%`,
                              minWidth: "2px",
                            }}
                          />
                          <div
                            className="h-4 bg-violet-500/80 transition-all"
                            style={{
                              width: `${((metric.applyStarts * 5) / maxMetric) * 100}%`,
                              minWidth: "1px",
                            }}
                          />
                          <div
                            className="h-4 rounded-r-sm bg-emerald-500/80 transition-all"
                            style={{
                              width: `${((metric.applyCompletes * 10) / maxMetric) * 100}%`,
                              minWidth: "1px",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 shrink-0">
                          {metric.views}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipeline funnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>選考パイプライン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stageData.map((stage, i) => (
                  <div key={stage.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        {stage.label}
                      </span>
                      <span className="font-semibold">{stage.count}名</span>
                    </div>
                    <div className="h-6 rounded-lg bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(stage.count / maxStageCount) * 100}%`,
                        }}
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

          {/* Per-job stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>求人別パフォーマンス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicJobs.map((job) => {
                  const appCount = clinicApps.filter(
                    (a) => a.jobId === job.id
                  ).length;
                  const cr = job.applyStartCount
                    ? Math.round(
                        (job.applyCompleteCount / job.applyStartCount) * 100
                      )
                    : 0;
                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg bg-muted/50 space-y-2"
                    >
                      <h4 className="text-sm font-medium">{job.title}</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">
                            {job.viewCount.toLocaleString()}
                          </p>
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
