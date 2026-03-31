"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { clinics, applications, jobPostings } from "@/data/seed";
import { PIPELINE_STAGES, type PipelineStage } from "@/data/types";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  User,
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

const currentClinic = clinics[0];

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const application = applications.find((a) => a.id === id);
  const [currentStage, setCurrentStage] = useState<PipelineStage>(
    application?.stage || "applied"
  );
  const [notes, setNotes] = useState(application?.notes || []);
  const [newNote, setNewNote] = useState("");
  const [stageUpdated, setStageUpdated] = useState(false);

  if (!application) return notFound();

  const job = jobPostings.find((j) => j.id === application.jobId);
  const activeStage = PIPELINE_STAGES.find((s) => s.id === currentStage)!;

  function handleStageChange(stage: PipelineStage) {
    setCurrentStage(stage);
    setStageUpdated(true);
    setTimeout(() => setStageUpdated(false), 2000);
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    const note = {
      id: `note-${Date.now()}`,
      content: newNote,
      authorName: "管理者",
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, note]);
    setNewNote("");
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          候補者一覧に戻る
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-xl font-bold">
              {application.applicantName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {application.applicantName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {job?.title} への応募
              </p>
            </div>
          </div>
          <Badge
            className="text-sm py-1 px-3 w-fit"
            style={{
              backgroundColor: activeStage.color + "15",
              color: activeStage.color,
            }}
          >
            {activeStage.label}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  選考ステージ
                  {stageUpdated && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-normal text-success flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      更新しました
                    </motion.span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => handleStageChange(stage.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        currentStage === stage.id
                          ? "text-white border-transparent shadow-sm"
                          : "border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                      style={
                        currentStage === stage.id
                          ? { backgroundColor: stage.color }
                          : undefined
                      }
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>志望動機</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {application.motivation}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5" />
                  選考メモ
                  <span className="text-sm font-normal text-muted-foreground">
                    ({notes.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    まだメモがありません。選考に関するメモを残しましょう。
                  </p>
                )}
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-lg bg-muted/50 space-y-2"
                  >
                    <p className="text-sm leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {note.authorName}
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(note.createdAt)}
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t space-y-3">
                  <Textarea
                    placeholder="選考メモを追加..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      <Send className="h-3.5 w-3.5" />
                      メモを追加
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="space-y-6"
        >
          {/* Contact info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>連絡先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">メール</p>
                  <p className="text-sm">{application.applicantEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">電話番号</p>
                  <p className="text-sm">{application.applicantPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicant details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>候補者情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">現在の職種</p>
                  <p className="text-sm">
                    {application.currentPosition || "未入力"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">経験年数</p>
                  <p className="text-sm">
                    {application.yearsOfExperience}年
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">応募日</p>
                  <p className="text-sm">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job info */}
          {job && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>応募先求人</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  {job.title}
                </Link>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {job.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {job.type === "full-time"
                      ? "常勤"
                      : job.type === "part-time"
                        ? "非常勤"
                        : "契約"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
