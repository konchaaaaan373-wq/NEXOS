"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { applications, jobPostings, alerts as allAlerts } from "@/data/seed";
import { useAuth } from "@/lib/clinic-context";
import { PIPELINE_STAGES, STAGE_SLA, ROLE_LABELS, ALERT_TYPE_LABELS, type PipelineStage, type CandidateNote } from "@/data/types";
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
  Loader2,
  Shield,
  ListTodo,
  AlertTriangle,
  ArrowRight,
  Circle,
  Timer,
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils";

function getDaysInStage(updatedAt: string): number {
  const now = new Date("2026-04-02");
  const updated = new Date(updatedAt);
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
}

const priorityColors = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityLabels = { urgent: "緊急", high: "高", medium: "中", low: "低" };

const statusLabels = { pending: "未着手", in_progress: "進行中", completed: "完了", overdue: "期限超過" };
const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
};

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
  const [notes, setNotes] = useState<CandidateNote[]>(application?.notes || []);
  const [newNote, setNewNote] = useState("");
  const [stageUpdating, setStageUpdating] = useState(false);
  const [stageUpdated, setStageUpdated] = useState(false);
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const { currentUser } = useAuth();

  if (!application) return notFound();

  const job = jobPostings.find((j) => j.id === application.jobId);
  const activeStage = PIPELINE_STAGES.find((s) => s.id === currentStage)!;
  const daysInStage = getDaysInStage(application.updatedAt);
  const slaLimit = STAGE_SLA[currentStage];
  const slaBreached = slaLimit > 0 && daysInStage > slaLimit;
  const slaWarning = slaLimit > 0 && daysInStage >= slaLimit * 0.8 && !slaBreached;

  // Alerts for this candidate
  const candidateAlerts = allAlerts.filter(
    (a) => a.relatedEntityId === application.id && !a.isResolved
  );

  async function handleStageChange(stage: PipelineStage) {
    setStageUpdating(true);
    try {
      const res = await fetch("/api/applications/stage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: application!.id, stage }),
      });
      if (res.ok) {
        setCurrentStage(stage);
        setStageUpdated(true);
        setTimeout(() => setStageUpdated(false), 2000);
      }
    } finally {
      setStageUpdating(false);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setNoteSubmitting(true);
    try {
      const res = await fetch("/api/applications/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application!.id,
          content: newNote,
          authorName: currentUser.name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([...notes, data.note]);
        setNewNote("");
      }
    } finally {
      setNoteSubmitting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-xl font-bold text-indigo-700">
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
          <div className="flex items-center gap-3">
            <Badge
              className="text-sm py-1 px-3 w-fit"
              style={{
                backgroundColor: activeStage.color + "15",
                color: activeStage.color,
              }}
            >
              {activeStage.label}
            </Badge>
            {slaBreached && (
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs py-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                SLA超過 ({daysInStage}日)
              </Badge>
            )}
            {slaWarning && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs py-1">
                <Timer className="h-3 w-3 mr-1" />
                SLA注意 ({daysInStage}/{slaLimit}日)
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Alerts Banner */}
      {candidateAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="space-y-2">
            {candidateAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                  alert.severity === "critical" ? "text-red-600" : "text-amber-600"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    alert.severity === "critical" ? "text-red-800" : "text-amber-800"
                  }`}>{alert.title}</p>
                  <p className={`text-xs mt-0.5 ${
                    alert.severity === "critical" ? "text-red-600" : "text-amber-600"
                  }`}>{alert.message}</p>
                </div>
                <Badge className={`text-[10px] shrink-0 ${
                  alert.severity === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {ALERT_TYPE_LABELS[alert.type]}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm">
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
                  {stageUpdating && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => handleStageChange(stage.id)}
                      disabled={stageUpdating}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border disabled:opacity-50 cursor-pointer ${
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

                {/* SLA indicator */}
                {slaLimit > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>ステージSLA: {slaLimit}日以内</span>
                      <span className={slaBreached ? "text-red-600 font-medium" : slaWarning ? "text-amber-600" : "text-emerald-600"}>
                        {daysInStage}日経過
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          slaBreached ? "bg-red-500" : slaWarning ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min((daysInStage / slaLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tasks */}
          {application.tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4" />
                    タスク
                    <span className="text-sm font-normal text-muted-foreground">
                      ({application.tasks.filter((t) => t.status !== "completed").length}件未完了)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {application.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className={`p-1 rounded-lg ${
                          task.status === "completed" ? "bg-emerald-100" : task.status === "overdue" ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : task.status === "overdue" ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}>{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.assignedToName} · 期限: {task.dueDate}
                          </p>
                        </div>
                        <Badge className={`text-[10px] border ${priorityColors[task.priority]}`}>
                          {priorityLabels[task.priority]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Activity Timeline */}
          {application.stageHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    選考タイムライン
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {/* Applied event */}
                    <div className="flex gap-3 pb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-1" />
                        <div className="w-px flex-1 bg-border mt-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">応募受付</p>
                        <p className="text-xs text-muted-foreground">{formatDate(application.appliedAt)}</p>
                      </div>
                    </div>
                    {/* Stage changes */}
                    {application.stageHistory.map((change, i) => {
                      const toStage = PIPELINE_STAGES.find((s) => s.id === change.to);
                      const isLast = i === application.stageHistory.length - 1;
                      return (
                        <div key={change.id} className="flex gap-3 pb-4">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-3 h-3 rounded-full shrink-0 mt-1"
                              style={{ backgroundColor: toStage?.color }}
                            />
                            {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {toStage?.label}に変更
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {change.changedByName} · {formatDate(change.changedAt)}
                            </p>
                            {change.note && (
                              <p className="text-xs text-muted-foreground mt-0.5 italic">
                                {change.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Motivation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>志望動機</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
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
                    className="p-4 rounded-xl bg-muted/30 space-y-2"
                  >
                    <p className="text-sm leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {note.authorRole?.startsWith("neco") ? (
                        <Shield className="h-3 w-3 text-amber-600" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {note.authorName}
                      {note.authorRole && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          {ROLE_LABELS[note.authorRole]}
                        </Badge>
                      )}
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
                      disabled={!newNote.trim() || noteSubmitting}
                    >
                      {noteSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
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
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>連絡先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={`mailto:${application.applicantEmail}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">メール</p>
                  <p className="text-sm text-accent">{application.applicantEmail}</p>
                </div>
              </a>
              <a
                href={`tel:${application.applicantPhone}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">電話番号</p>
                  <p className="text-sm text-accent">{application.applicantPhone}</p>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Applicant details */}
          <Card className="border-0 shadow-sm">
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
                  <p className="text-sm">{application.yearsOfExperience}年</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">応募日</p>
                  <p className="text-sm">{formatDate(application.appliedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">現ステージ経過日数</p>
                  <p className={`text-sm font-medium ${slaBreached ? "text-red-600" : ""}`}>
                    {daysInStage}日
                    {slaLimit > 0 && <span className="text-muted-foreground font-normal"> / SLA {slaLimit}日</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job info */}
          {job && (
            <Card className="border-0 shadow-sm">
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

          {/* Operations link */}
          <Link href="/dashboard/operations">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">オペレーション</p>
                  <p className="text-xs text-muted-foreground">アラート・タスク管理</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
