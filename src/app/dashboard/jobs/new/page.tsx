"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useClinic } from "@/lib/clinic-context";
import { ArrowLeft, Save, Loader2, CheckCircle2, Circle } from "lucide-react";
import { JOB_PUBLISH_CHECKLIST } from "@/data/types";
import type { JobPosting } from "@/data/types";

export default function NewJobPage() {
  const router = useRouter();
  const { currentClinic } = useClinic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Controlled form state for real-time checklist evaluation
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("医師");
  const [jobType, setJobType] = useState<"full-time" | "part-time" | "contract">("full-time");
  const [location, setLocation] = useState(currentClinic.location);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [benefitsText, setBenefitsText] = useState("");

  // Build a partial JobPosting from current form state
  const partialJob: JobPosting = useMemo(
    () => ({
      id: "",
      clinicId: currentClinic.id,
      title,
      type: jobType,
      category,
      location,
      salaryMin: salaryMin ? parseInt(salaryMin) * 10000 : 0,
      salaryMax: salaryMax ? parseInt(salaryMax) * 10000 : 0,
      description,
      requirements: requirements.split("\n").filter(Boolean),
      niceToHave: niceToHave.split("\n").filter(Boolean),
      benefits: benefitsText.split("\n").filter(Boolean),
      isActive: true,
      publishedAt: "",
      viewCount: 0,
      applyStartCount: 0,
      applyCompleteCount: 0,
    }),
    [title, jobType, category, location, salaryMin, salaryMax, description, requirements, niceToHave, benefitsText, currentClinic.id]
  );

  // Evaluate checklist
  const checklistResults = useMemo(
    () =>
      JOB_PUBLISH_CHECKLIST.map((item) => ({
        ...item,
        passed: item.check(partialJob),
      })),
    [partialJob]
  );

  const passedCount = checklistResults.filter((r) => r.passed).length;
  const totalCount = checklistResults.length;
  const allRequiredPassed = checklistResults
    .filter((r) => r.severity === "required")
    .every((r) => r.passed);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

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
          title,
          type: jobType,
          category,
          location: location || currentClinic.location,
          salaryMin: Number(salaryMin) || 0,
          salaryMax: Number(salaryMax) || 0,
          description,
          requirements: parseLines(requirements),
          niceToHave: parseLines(niceToHave),
          benefits: parseLines(benefitsText),
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

  // Checklist panel component (reused in desktop sidebar and mobile inline)
  const checklistPanel = (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-sm font-semibold tracking-tight">公開準備チェックリスト</h3>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{passedCount}/{totalCount} 完了</span>
            <span>{Math.round((passedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(passedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {checklistResults.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5 py-1.5">
              {item.passed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm leading-tight ${
                      item.passed ? "text-emerald-600 font-medium" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.severity === "required" ? (
                    <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                      必須
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                      推奨
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form column: 2/3 width */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="border-0 shadow-sm rounded-2xl">
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
                    <Input
                      name="title"
                      placeholder="例：内科 常勤医師"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        職種カテゴリ
                      </label>
                      <Select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
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
                      <Select
                        name="type"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value as "full-time" | "part-time" | "contract")}
                      >
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        年収下限（万円）
                      </label>
                      <Input
                        name="salaryMin"
                        type="number"
                        placeholder="500"
                        min="0"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        年収上限（万円）
                      </label>
                      <Input
                        name="salaryMax"
                        type="number"
                        placeholder="800"
                        min="0"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                      />
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      歓迎条件（1行に1つ）
                    </label>
                    <Textarea
                      name="niceToHave"
                      rows={3}
                      placeholder="専門医資格"
                      value={niceToHave}
                      onChange={(e) => setNiceToHave(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      待遇・福利厚生（1行に1つ）
                    </label>
                    <Textarea
                      name="benefits"
                      rows={4}
                      placeholder={"完全週休2日制\n学会参加補助あり"}
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                    />
                  </div>

                  {/* Mobile checklist: shown above submit buttons on small screens */}
                  <div className="lg:hidden">{checklistPanel}</div>

                  {/* Readiness summary + submit buttons */}
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center gap-2">
                      {allRequiredPassed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          公開可能
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <Circle className="h-3.5 w-3.5" />
                          必須項目が未完了です
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Link href="/dashboard/jobs">
                        <Button type="button" variant="outline">
                          キャンセル
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        variant="accent"
                        disabled={isSubmitting || !allRequiredPassed}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : allRequiredPassed ? (
                          <>
                            <Save className="h-4 w-4" />
                            公開する
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            下書き保存
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Checklist sidebar: 1/3 width, desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-6">{checklistPanel}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
