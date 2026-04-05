"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { adminUsers } from "@/data/seed";
import { ROLE_LABELS } from "@/data/types";
import type { ClinicPageSection } from "@/data/types";
import {
  Eye,
  EyeOff,
  GripVertical,
  Save,
  ExternalLink,
  Clock,
  UserCircle,
  Shield,
  CheckCircle2,
  Loader2,
  FileEdit,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: "ヒーローセクション",
  about: "クリニック紹介",
  culture: "カルチャー",
  benefits: "福利厚生",
  jobs: "求人一覧",
  custom: "カスタム",
};

export default function PageEditorPage() {
  const { currentClinic, isNeco, currentUser, canEdit } = useAuth();
  const [sections, setSections] = useState<ClinicPageSection[]>(
    [...currentClinic.pageSections].sort((a, b) => a.order - b.order)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleVisibility(sectionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      )
    );
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  const editingSection = sections.find((s) => s.id === editingId);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              採用ページ編集
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentClinic.name}の採用ページを編集します
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/clinics/${currentClinic.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3.5 w-3.5" />
                プレビュー
              </Button>
            </Link>
            <Button
              variant="accent"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {saved ? "保存しました" : "変更を保存"}
            </Button>
          </div>
        </div>

        {/* Co-editing notice */}
        {isNeco && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <Shield className="h-4 w-4 shrink-0" />
            <span>
              Neco共同編集モードです。クリニックの採用ページを代理編集できます。
              変更履歴には「{currentUser.name}（{ROLE_LABELS[currentUser.role]}）」として記録されます。
            </span>
          </div>
        )}
      </motion.div>

      {/* Brand preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>ブランド設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-lg"
                style={{ backgroundColor: currentClinic.brand.brandColorLight }}
              >
                <ClinicLogo clinicId={currentClinic.id} size={40} color={currentClinic.brand.brandColor} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: currentClinic.brand.brandColor }}
                  />
                  <span className="text-sm text-muted-foreground">
                    ブランドカラー: {currentClinic.brand.brandColor}
                  </span>
                </div>
                <div
                  className={`h-8 rounded-lg bg-gradient-to-r ${currentClinic.brand.coverImageGradient} w-full max-w-xs`}
                />
              </div>
            </div>
            {currentClinic.brand.heroTagline && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  ヒーローキャッチコピー
                </p>
                <p className="text-sm font-medium">
                  {currentClinic.brand.heroTagline}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Page sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1 space-y-3"
        >
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            ページ構成
          </h3>
          {sections.map((section, i) => {
            const editor = section.lastEditedBy
              ? adminUsers.find((u) => u.id === section.lastEditedBy)
              : null;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setEditingId(section.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    editingId === section.id
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {section.title}
                        </span>
                        {!section.isVisible && (
                          <Badge variant="secondary" className="text-xs">
                            非表示
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {SECTION_TYPE_LABELS[section.type]}
                      </p>
                    </div>
                    {section.isVisible ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  {editor && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground pl-7">
                      {editor.role.startsWith("neco") ? (
                        <Shield className="h-3 w-3 text-amber-600" />
                      ) : (
                        <UserCircle className="h-3 w-3" />
                      )}
                      <span>
                        {editor.name} が{" "}
                        {formatRelativeDate(section.lastEditedAt!)} に編集
                      </span>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section editor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2"
        >
          {editingSection ? (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{editingSection.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(editingSection.id)}
                  >
                    {editingSection.isVisible ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        非表示にする
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        表示する
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    セクションタイトル
                  </label>
                  <Input defaultValue={editingSection.title} />
                </div>

                {editingSection.type === "hero" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        キャッチコピー
                      </label>
                      <Input
                        defaultValue={
                          currentClinic.brand.heroTagline || ""
                        }
                        placeholder="採用ページのヒーローに表示するメッセージ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        ミッション
                      </label>
                      <Textarea
                        defaultValue={currentClinic.mission}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {editingSection.type === "about" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      クリニック紹介文
                    </label>
                    <Textarea
                      defaultValue={currentClinic.description}
                      rows={5}
                    />
                  </div>
                )}

                {editingSection.type === "culture" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      カルチャー（1行に1つ）
                    </label>
                    <Textarea
                      defaultValue={currentClinic.culture.join("\n")}
                      rows={4}
                    />
                  </div>
                )}

                {editingSection.type === "benefits" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      福利厚生（1行に1つ）
                    </label>
                    <Textarea
                      defaultValue={currentClinic.benefits.join("\n")}
                      rows={5}
                    />
                  </div>
                )}

                {editingSection.type === "jobs" && (
                  <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    求人一覧セクションは、公開中の求人から自動で表示されます。
                    求人の追加・編集は「求人管理」ページから行ってください。
                  </div>
                )}

                {editingSection.type === "custom" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      コンテンツ
                    </label>
                    <Textarea
                      defaultValue={editingSection.content}
                      rows={6}
                      placeholder="自由にコンテンツを入力してください..."
                    />
                  </div>
                )}

                {editingSection.lastEditedBy && (
                  <div className="pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    最終編集:{" "}
                    {adminUsers.find(
                      (u) => u.id === editingSection.lastEditedBy
                    )?.name ?? "不明"}{" "}
                    · {formatRelativeDate(editingSection.lastEditedAt!)}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <FileEdit className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  左のセクションを選択して編集を開始してください
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
