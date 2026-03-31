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
import { ArrowLeft, Save, Eye } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      router.push("/dashboard/jobs");
    }, 1500);
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
          新しい求人を作成して公開できます
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
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  求人タイトル <span className="text-destructive">*</span>
                </label>
                <Input placeholder="例：内科 常勤医師" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    職種カテゴリ
                  </label>
                  <Select>
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
                  <Select>
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
                <Input placeholder="例：東京都渋谷区" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収下限（万円）
                  </label>
                  <Input type="number" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    年収上限（万円）
                  </label>
                  <Input type="number" placeholder="800" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  仕事内容 <span className="text-destructive">*</span>
                </label>
                <Textarea
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
                  rows={4}
                  placeholder="医師免許保有&#10;臨床経験3年以上&#10;..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  歓迎条件（1行に1つ）
                </label>
                <Textarea rows={3} placeholder="専門医資格&#10;..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  待遇・福利厚生（1行に1つ）
                </label>
                <Textarea
                  rows={4}
                  placeholder="完全週休2日制&#10;学会参加補助あり&#10;..."
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <Button type="button" variant="outline">
                  <Eye className="h-4 w-4" />
                  プレビュー
                </Button>
                <Button type="submit" variant="accent" disabled={saved}>
                  <Save className="h-4 w-4" />
                  {saved ? "保存しました ✓" : "求人を公開する"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
