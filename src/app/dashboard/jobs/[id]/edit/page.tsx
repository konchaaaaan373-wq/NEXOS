"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { jobPostings, adminUsers } from "@/data/seed";
import { useAuth } from "@/lib/clinic-context";
import { ROLE_LABELS } from "@/data/types";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
  UserCircle,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = jobPostings.find((j) => j.id === id);
  const { currentUser, isNeco } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isActive, setIsActive] = useState(job?.isActive ?? true);
  const [error, setError] = useState("");

  if (!job) return notFound();

  const jobRef = job;
  const lastEditor = job.lastEditedBy
    ? adminUsers.find((u) => u.id === job.lastEditedBy)
    : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const parseLines = (val: string) =>
      val.split("\n").map((l) => l.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/jobs/${jobRef.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          category: formData.get("category"),
          type: formData.get("type"),
          location: formData.get("location"),
          salaryMin: Number(formData.get("salaryMin")) || 0,
          salaryMax: Number(formData.get("salaryMax")) || 0,
          description: formData.get("description"),
          requirements: parseLines((formData.get("requirements") as string) || ""),
          niceToHave: parseLines((formData.get("niceToHave") as string) || ""),
          benefits: parseLines((formData.get("benefits") as string) || ""),
          isActive,
          editorId: currentUser.id,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          求人管理に戻る
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">求人を編集</h1>
            <p className="mt-1 text-sm text-muted-foreground">{job.title}</p>
          </div>
          <Badge variant={isActive ? "success" : "secondary"}>
            {isActive ? "公開中" : "非公開"}
          </Badge>
        </div>

        {isNeco && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <Shield className="h-4 w-4 shrink-0" />
            <span>
              Neco共同編集モードです。変更は「{currentUser.name}（{ROLE_LABELS[currentUser.role]}）」として記録されます。
            </span>
          </div>
        )}

        {lastEditor && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {lastEditor.role.startsWith("neco") ? (
              <Shield className="h-3 w-3 text-amber-600" />
            ) : (
              <UserCircle className="h-3 w-3" />
            )}
            最終編集: {lastEditor.name}（{ROLE_LABELS[lastEditor.role]}）
            <Clock className="h-3 w-3 ml-1" />
            {formatRelativeDate(job.lastEditedAt!)}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1.5">求人タイトル</label>
                <Input id="title" name="title" defaultValue={job.title} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1.5">職種カテゴリ</label>
                  <Select id="category" name="category" defaultValue={job.category}>
                    <option value="医師">医師</option>
                    <option value="看護師">看護師</option>
                    <option value="臨床検査技師">臨床検査技師</option>
                    <option value="医療事務">医療事務</option>
                    <option value="その他">その他</option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1.5">雇用形態</label>
                  <Select id="type" name="type" defaultValue={job.type}>
                    <option value="full-time">常勤</option>
                    <option value="part-time">非常勤</option>
                    <option value="contract">契約</option>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1.5">勤務地</label>
                <Input id="location" name="location" defaultValue={job.location} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium mb-1.5">年収下限（万円）</label>
                  <Input id="salaryMin" name="salaryMin" type="number" defaultValue={job.salaryMin / 10000} />
                </div>
                <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium mb-1.5">年収上限（万円）</label>
                  <Input id="salaryMax" name="salaryMax" type="number" defaultValue={job.salaryMax / 10000} />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1.5">仕事内容</label>
                <Textarea id="description" name="description" rows={6} defaultValue={job.description} />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium mb-1.5">応募要件（1行に1つ）</label>
                <Textarea id="requirements" name="requirements" rows={4} defaultValue={job.requirements.join("\n")} />
              </div>

              <div>
                <label htmlFor="niceToHave" className="block text-sm font-medium mb-1.5">歓迎条件（1行に1つ）</label>
                <Textarea id="niceToHave" name="niceToHave" rows={3} defaultValue={job.niceToHave.join("\n")} />
              </div>

              <div>
                <label htmlFor="benefits" className="block text-sm font-medium mb-1.5">待遇・福利厚生（1行に1つ）</label>
                <Textarea id="benefits" name="benefits" rows={4} defaultValue={job.benefits.join("\n")} />
              </div>

              <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">公開設定</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    非公開にすると求職者には表示されなくなります
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="flex items-center gap-2 text-sm"
                  aria-label={isActive ? "非公開にする" : "公開する"}
                >
                  {isActive ? (
                    <ToggleRight className="h-8 w-8 text-success" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <Link href={`/jobs/${job.id}`} target="_blank">
                  <Button type="button" variant="ghost" size="sm">
                    <Eye className="h-3.5 w-3.5" />
                    公開ページを確認
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard/jobs">
                    <Button type="button" variant="outline">キャンセル</Button>
                  </Link>
                  <Button type="submit" variant="accent" disabled={saving}>
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />保存中...</>
                    ) : saved ? (
                      <><CheckCircle2 className="h-4 w-4" />保存しました</>
                    ) : (
                      <><Save className="h-4 w-4" />変更を保存</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
