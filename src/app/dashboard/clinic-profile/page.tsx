"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/clinic-context";
import {
  Building2, User, Phone, Mail, CheckCircle2, XCircle,
  MapPin, DollarSign, Clock, FileText, Pencil, Save,
  Heart, AlertTriangle, Users, Briefcase,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClinicProfilePage() {
  const { currentClinic } = useAuth();
  const profile = currentClinic.recruitingProfile;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!profile) {
    return (
      <div className="p-6 sm:p-8">
        <div className="text-center py-20">
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold">採用カルテが未作成です</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            医療機関の採用条件・文化・希望を登録すると、候補者提案の精度が上がり、毎回の説明が不要になります。
          </p>
          <Button variant="accent" className="mt-6" onClick={() => setEditing(true)}>
            採用カルテを作成
          </Button>
        </div>
      </div>
    );
  }

  function handleSave() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">採用カルテ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentClinic.name}の採用条件・文化・希望を管理
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-emerald-600 flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              保存しました
            </motion.span>
          )}
          <Button
            variant={editing ? "accent" : "outline"}
            size="sm"
            onClick={editing ? handleSave : () => setEditing(true)}
          >
            {editing ? (
              <><Save className="h-4 w-4" /> 保存</>
            ) : (
              <><Pencil className="h-4 w-4" /> 編集</>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-800">
            この情報をもとに候補者の提案やマッチング判断を行います。正確に記載するほど、提案精度が上がり、毎回の説明が不要になります。
          </p>
          <p className="text-xs text-blue-600 mt-1">
            最終更新: {formatDate(profile.lastUpdatedAt)} · {profile.lastUpdatedBy === "user-neco-2" ? "田村 結衣（Neco）" : "管理者"}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Decision */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                採用担当・意思決定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">採用担当者</p>
                  {editing ? (
                    <Input defaultValue={profile.contactPerson} className="text-sm" />
                  ) : (
                    <p className="text-sm font-medium">{profile.contactPerson}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">役職</p>
                  <p className="text-sm">{profile.contactRole}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.contactEmail}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.contactPhone}
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">最終意思決定者</p>
                <p className="text-sm font-medium">{profile.decisionMaker}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">決裁フロー</p>
                <p className="text-sm">{profile.decisionProcess}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Culture */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                院の雰囲気・文化
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <Textarea defaultValue={profile.cultureDescription} rows={4} />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.cultureDescription}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {profile.cultureTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">働き方の特徴</p>
                <p className="text-sm">{profile.workStyle}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Good Fit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                こういう人が合う
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <Textarea defaultValue={profile.goodFitDescription} rows={3} />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.goodFitDescription}</p>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">過去の成功例</p>
                <div className="space-y-1.5">
                  {profile.goodFitExamples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* NG Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                NG条件・過去の失敗
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">合わないタイプ</p>
                <div className="space-y-1.5">
                  {profile.ngConditions.map((ng, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      <span>{ng}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">過去の失敗理由</p>
                <div className="space-y-1.5">
                  {profile.ngReasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                採用条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">通勤圏の目安</p>
                  <p className="text-sm flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {profile.commuteArea}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">給与レンジ</p>
                  <p className="text-sm flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    {profile.salaryRange}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">希望年齢層</p>
                  <p className="text-sm">{profile.preferredAge}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">希望経験</p>
                  <p className="text-sm">{profile.preferredExperience}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                メモ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">紹介会社メモ</p>
                {editing ? (
                  <Textarea defaultValue={profile.agencyNotes} rows={2} />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.agencyNotes}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">自由メモ</p>
                {editing ? (
                  <Textarea defaultValue={profile.freeNotes} rows={3} />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.freeNotes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
