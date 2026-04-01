"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { clinics, jobPostings } from "@/data/seed";
import { applicationSchema } from "@/lib/validations";
import { ArrowLeft, Building2, Send, Loader2, AlertCircle } from "lucide-react";

export default function ApplyPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const router = useRouter();
  const job = jobPostings.find((j) => j.id === jobId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  if (!job) return notFound();

  const clinic = clinics.find((c) => c.id === job.clinicId)!;
  const jobRef = job;
  const clinicRef = clinic;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = {
      jobId: jobRef.id,
      clinicId: clinicRef.id,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      currentPosition: formData.get("currentPosition") as string,
      yearsOfExperience: formData.get("yearsOfExperience") as string,
      motivation: formData.get("motivation") as string,
    };

    // Client-side Zod validation
    const result = applicationSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setServerError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        router.push(`/apply/${jobId}/success`);
      } else {
        const data = await res.json();
        setServerError(data.error || "送信に失敗しました。もう一度お試しください。");
        setIsSubmitting(false);
      }
    } catch {
      setServerError("ネットワークエラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <PublicHeader />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          求人詳細に戻る
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Job info header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: clinic.brand.brandColorLight }}
                >
                  {clinic.brand.logoEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {clinic.name}
                  </div>
                  <h1 className="text-xl font-bold mt-0.5">{job.title}</h1>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="accent">
                      {job.type === "full-time"
                        ? "常勤"
                        : job.type === "part-time"
                          ? "非常勤"
                          : "契約"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application form */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold">応募フォーム</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  以下の情報を入力して応募してください。応募内容は{clinic.name}
                  に直接送信されます。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {serverError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {serverError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      お名前 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="name"
                      placeholder="山田 太郎"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      メールアドレス <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      電話番号 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="phone"
                      placeholder="090-1234-5678"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      現在の職種
                    </label>
                    <Input
                      name="currentPosition"
                      placeholder="例：総合病院 内科勤務"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    臨床経験年数
                  </label>
                  <Input
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    志望動機 <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    name="motivation"
                    rows={5}
                    placeholder="この求人に応募する理由や、ご自身の強みなどをお聞かせください..."
                    className={errors.motivation ? "border-destructive" : ""}
                  />
                  {errors.motivation && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.motivation}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-4">
                    「応募する」ボタンを押すと、入力した情報が{clinic.name}
                    に送信されます。個人情報は採用選考の目的でのみ使用されます。ご不明点は{" "}
                    <a href="mailto:contact@necofindjob.com" className="text-accent hover:underline">contact@necofindjob.com</a>{" "}
                    までお問い合わせください。
                  </p>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        応募する
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <PublicFooter />
    </div>
  );
}
