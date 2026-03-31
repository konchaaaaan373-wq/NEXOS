"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { jobPostings } from "@/data/seed";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = jobPostings.find((j) => j.id === id);
  const [saved, setSaved] = useState(false);

  if (!job) return notFound();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

        <h1 className="text-2xl font-bold tracking-tight">求人を編集</h1>
        <p className="mt-1 text-sm text-muted-foreground">{job.title}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  求人タイトル
                </label>
                <Input defaultValue={job.title} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    職種カテゴリ
                  </label>
                  <Select defaultValue={job.category}>
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
                  <Select defaultValue={job.type}>
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
                <Input defaultValue={job.location} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収下限（万円）
                  </label>
                  <Input
                    type="number"
                    defaultValue={job.salaryMin / 10000}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収上限（万円）
                  </label>
                  <Input
                    type="number"
                    defaultValue={job.salaryMax / 10000}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  仕事内容
                </label>
                <Textarea rows={6} defaultValue={job.description} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  応募要件
                </label>
                <Textarea
                  rows={4}
                  defaultValue={job.requirements.join("\n")}
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <Link href="/dashboard/jobs">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
                <Button type="submit" variant="accent" disabled={saved}>
                  <Save className="h-4 w-4" />
                  {saved ? "保存しました ✓" : "変更を保存"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
