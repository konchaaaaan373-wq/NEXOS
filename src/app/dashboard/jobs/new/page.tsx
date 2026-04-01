"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useClinic } from "@/lib/clinic-context";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const { currentClinic } = useClinic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const parseLines = (val: string) =>
      val
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: currentClinic.id,
          title: formData.get("title"),
          type: formData.get("type"),
          category: formData.get("category"),
          location: formData.get("location") || currentClinic.location,
          salaryMin: Number(formData.get("salaryMin")) || 0,
          salaryMax: Number(formData.get("salaryMax")) || 0,
          description: formData.get("description"),
          requirements: parseLines((formData.get("requirements") as string) || ""),
          niceToHave: parseLines((formData.get("niceToHave") as string) || ""),
          benefits: parseLines((formData.get("benefits") as string) || ""),
        }),
      });

      if (res.ok) {
        router.push("/dashboard/jobs");
      } else {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
        setIsSubmitting(false);
      }
    } catch {
      setError("ネットワークエラーが発生しました");
      setIsSubmitting(false);
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

        <h1 className="text-2xl font-bold tracking-tight">新規求人作成</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentClinic.name}の新しい求人を作成して公開します
        </p>
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
                <label className="block text-sm font-medium mb-1.5">
                  求人タイトル <span className="text-destructive">*</span>
                </label>
                <Input name="title" placeholder="例：内科 常勤医師" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    職種カテゴリ
                  </label>
                  <Select name="category" defaultValue="医師">
                    <option value="医師">医師</option>
                    <option value="看護師">看護師</option>
                    <option value="臨床検査技師">臨床検査技師</option>
                    <option value="医療事務">医療事務</option>
                    <option value="その他">その他</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    雇用形態
                  </label>
                  <Select name="type" defaultValue="full-time">
                    <option value="full-time">常勤</option>
                    <option value="part-time">非常勤</option>
                    <option value="contract">契約</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  勤務地
                </label>
                <Input
                  name="location"
                  placeholder={currentClinic.location}
                  defaultValue={currentClinic.location}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収下限（万円）
                  </label>
                  <Input name="salaryMin" type="number" placeholder="500" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収上限（万円）
                  </label>
                  <Input name="salaryMax" type="number" placeholder="800" min="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  仕事内容 <span className="text-destructive">*</span>
                </label>
                <Textarea
                  name="description"
                  rows={6}
                  placeholder="求人の詳しい仕事内容を入力してください..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  応募要件（1行に1つ）
                </label>
                <Textarea
                  name="requirements"
                  rows={4}
                  placeholder={"医師免許保有\n臨床経験3年以上"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  歓迎条件（1行に1つ）
                </label>
                <Textarea name="niceToHave" rows={3} placeholder="専門医資格" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  待遇・福利厚生（1行に1つ）
                </label>
                <Textarea
                  name="benefits"
                  rows={4}
                  placeholder={"完全週休2日制\n学会参加補助あり"}
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <Link href="/dashboard/jobs">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
                <Button type="submit" variant="accent" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      求人を公開する
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
