"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { applications, jobPostings, alerts as allAlerts } from "@/data/seed";
import { useClinic } from "@/lib/clinic-context";
import { PIPELINE_STAGES, STAGE_SLA, type PipelineStage } from "@/data/types";
import { Search, Users, Clock, ArrowRight, AlertTriangle, Timer, CheckCircle2 } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

function getDaysInStage(updatedAt: string): number {
  return Math.floor(
    (new Date("2026-04-02").getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
}

function getNextAction(app: (typeof applications)[0]): string | null {
  switch (app.stage) {
    case "applied": return "書類確認";
    case "screening": return "選考判定";
    case "interview": {
      const hasInterviewTask = app.tasks.some((t) => t.title.includes("面接") && t.status !== "completed");
      return hasInterviewTask ? "面接日程調整" : "面接実施";
    }
    case "offer": return "内定フォロー";
    default: return null;
  }
}

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [sortBy, setSortBy] = useState<"updated" | "urgency">("urgency");
  const { currentClinic } = useClinic();

  const clinicApps = applications.filter(
    (a) => a.clinicId === currentClinic.id
  );
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
  );
  const clinicAlerts = allAlerts.filter(
    (a) => a.clinicId === currentClinic.id && !a.isResolved
  );

  const filteredApps = clinicApps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !selectedStage || app.stage === selectedStage;
    const matchesJob = !selectedJob || app.jobId === selectedJob;
    return matchesSearch && matchesStage && matchesJob;
  });

  // Sort by urgency: SLA breaches first, then by days in stage
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === "urgency") {
      const aDays = getDaysInStage(a.updatedAt);
      const bDays = getDaysInStage(b.updatedAt);
      const aSLA = STAGE_SLA[a.stage];
      const bSLA = STAGE_SLA[b.stage];
      const aRatio = aSLA > 0 ? aDays / aSLA : 0;
      const bRatio = bSLA > 0 ? bDays / bSLA : 0;
      return bRatio - aRatio;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const stageGroups = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: clinicApps.filter((a) => a.stage === stage.id).length,
  }));

  // Counts
  const activeCount = clinicApps.filter((a) => a.stage !== "hired" && a.stage !== "rejected").length;
  const breachCount = clinicApps.filter((a) => {
    const sla = STAGE_SLA[a.stage];
    return sla > 0 && getDaysInStage(a.updatedAt) > sla;
  }).length;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">候補者管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            選考中 {activeCount}名
            {breachCount > 0 && (
              <span className="text-red-600 ml-2">({breachCount}名 SLA超過)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "updated" | "urgency")}
            className="w-32 text-xs h-8"
          >
            <option value="urgency">緊急度順</option>
            <option value="updated">更新日順</option>
          </Select>
        </div>
      </motion.div>

      {/* Pipeline overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {stageGroups.map((stage) => (
          <button
            key={stage.id}
            onClick={() =>
              setSelectedStage(selectedStage === stage.id ? "" : stage.id)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedStage === stage.id
                ? "border-transparent text-white"
                : "border-border hover:bg-gray-50"
            }`}
            style={
              selectedStage === stage.id
                ? { backgroundColor: stage.color }
                : undefined
            }
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  selectedStage === stage.id ? "white" : stage.color,
              }}
            />
            {stage.label}
            <span className="text-xs opacity-70">{stage.count}</span>
          </button>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="名前やメールで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="sm:w-64"
        >
          <option value="">すべての求人</option>
          {clinicJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </Select>
      </motion.div>

      {/* Candidate list */}
      <div className="space-y-2">
        {sortedApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">候補者が見つかりません</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {clinicApps.length === 0 ? (
                <>求人を公開して応募を待ちましょう</>
              ) : (
                <>検索条件を変更してお試しください</>
              )}
            </p>
            {clinicApps.length === 0 && (
              <Link href="/dashboard/jobs/new">
                <Button variant="accent" size="sm" className="mt-4">新規求人を作成</Button>
              </Link>
            )}
          </motion.div>
        ) : (
          sortedApps.map((app, i) => {
            const job = jobPostings.find((j) => j.id === app.jobId);
            const stage = PIPELINE_STAGES.find((s) => s.id === app.stage)!;
            const days = getDaysInStage(app.updatedAt);
            const sla = STAGE_SLA[app.stage];
            const isBreach = sla > 0 && days > sla;
            const isWarning = sla > 0 && days >= sla * 0.7 && !isBreach;
            const nextAction = getNextAction(app);
            const pendingTasks = app.tasks.filter((t) => t.status !== "completed").length;
            const hasAlert = allAlerts.some(
              (a) => a.relatedEntityId === app.id && !a.isResolved
            );

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link href={`/dashboard/candidates/${app.id}`}>
                  <Card className={`hover:shadow-md transition-all group ${
                    isBreach ? "border-red-200 bg-red-50/30" : hasAlert ? "border-amber-200 bg-amber-50/20" : "border shadow-none"
                  }`}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold shrink-0 ${
                          isBreach ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {app.applicantName.charAt(0)}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold group-hover:text-accent transition-colors truncate">
                              {app.applicantName}
                            </h3>
                            {isBreach && (
                              <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {app.currentPosition || "未設定"} · {job?.title}
                          </p>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Next action chip */}
                          {nextAction && (
                            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-gray-100 px-2 py-1 rounded-md">
                              次: {nextAction}
                            </span>
                          )}

                          {/* Task count */}
                          {pendingTasks > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                              {pendingTasks}タスク
                            </span>
                          )}

                          {/* Stage badge */}
                          <Badge
                            className="text-[10px] py-0.5"
                            style={{
                              backgroundColor: stage.color + "15",
                              color: stage.color,
                            }}
                          >
                            {stage.label}
                          </Badge>

                          {/* Time in stage */}
                          <span className={`hidden sm:inline-flex items-center gap-1 text-xs ${
                            isBreach ? "text-red-600 font-medium" : isWarning ? "text-amber-600" : "text-muted-foreground"
                          }`}>
                            <Timer className="h-3 w-3" />
                            {days}日
                          </span>

                          <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
