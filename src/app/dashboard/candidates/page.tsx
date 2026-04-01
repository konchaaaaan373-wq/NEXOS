"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { applications, jobPostings } from "@/data/seed";
import { useClinic } from "@/lib/clinic-context";
import { PIPELINE_STAGES, type PipelineStage } from "@/data/types";
import { Search, Users, Clock, ArrowRight } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const { currentClinic } = useClinic();

  const clinicApps = applications.filter(
    (a) => a.clinicId === currentClinic.id
  );
  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === currentClinic.id
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

  const stageGroups = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: clinicApps.filter((a) => a.stage === stage.id).length,
  }));

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">候補者管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {clinicApps.length}名の候補者
        </p>
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
              setSelectedStage(
                selectedStage === stage.id ? "" : stage.id
              )
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
              selectedStage === stage.id
                ? "border-transparent text-white"
                : "border-border hover:bg-muted/50"
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
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">候補者が見つかりません</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              検索条件を変更してお試しください
            </p>
          </motion.div>
        ) : (
          filteredApps
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map((app, i) => {
              const job = jobPostings.find((j) => j.id === app.jobId);
              const stage = PIPELINE_STAGES.find(
                (s) => s.id === app.stage
              )!;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/dashboard/candidates/${app.id}`}>
                    <Card className="hover:shadow-md transition-all group">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-base font-semibold">
                              {app.applicantName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-semibold group-hover:text-accent transition-colors">
                                {app.applicantName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {app.currentPosition || "未設定"} ·{" "}
                                {job?.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="hidden sm:inline-flex"
                              style={{
                                backgroundColor: stage.color + "15",
                                color: stage.color,
                              }}
                            >
                              {stage.label}
                            </Badge>
                            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatRelativeDate(app.updatedAt)}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
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
