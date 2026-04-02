"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/clinic-context";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { clinics, jobPostings, applications, adminUsers, eventMetrics } from "@/data/seed";
import { ROLE_LABELS, PIPELINE_STAGES } from "@/data/types";
import type { UserRole } from "@/data/types";
import {
  Shield,
  Building2,
  Users,
  Briefcase,
  Eye,
  TrendingUp,
  ArrowRight,
  Search,
  UserPlus,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Globe,
  Bot,
  Mail,
} from "lucide-react";

const roleColors: Record<UserRole, string> = {
  neco_admin: "from-amber-500 to-orange-500",
  neco_editor: "from-violet-500 to-purple-500",
  clinic_admin: "from-blue-500 to-indigo-500",
  clinic_editor: "from-slate-500 to-slate-600",
};

const roleBgColors: Record<UserRole, string> = {
  neco_admin: "bg-amber-50 text-amber-700 border-amber-200",
  neco_editor: "bg-violet-50 text-violet-700 border-violet-200",
  clinic_admin: "bg-blue-50 text-blue-700 border-blue-200",
  clinic_editor: "bg-slate-50 text-slate-700 border-slate-200",
};

// Mock system activity log
const systemActivities = [
  { action: "新規求人公開", detail: "メディカルフロンティア渋谷 — 医療事務・受付スタッフ", user: "佐藤 健太", time: "15分前", type: "job" as const },
  { action: "候補者ステージ変更", detail: "田中 美咲 → 面接", user: "鈴木 院長", time: "1時間前", type: "candidate" as const },
  { action: "採用ページ更新", detail: "さくら在宅クリニック — ヒーローセクション", user: "田村 結衣 (Neco)", time: "2時間前", type: "page" as const },
  { action: "新規応募", detail: "加藤 裕子 — 臨床検査技師（脳波・MRI）", user: "システム", time: "3時間前", type: "candidate" as const },
  { action: "AI求人票最適化", detail: "訪問看護師 — 応募率+28%の改善提案", user: "AI Agent", time: "5時間前", type: "ai" as const },
  { action: "ユーザー追加", detail: "渡辺 慎一 — ニューロサイエンス東京 管理者", user: "Neco 管理者", time: "1日前", type: "user" as const },
];

const activityIcons = {
  job: Briefcase,
  candidate: Users,
  page: Globe,
  ai: Bot,
  user: UserPlus,
};

const activityColors = {
  job: "text-blue-500 bg-blue-50",
  candidate: "text-violet-500 bg-violet-50",
  page: "text-emerald-500 bg-emerald-50",
  ai: "text-indigo-500 bg-indigo-50",
  user: "text-amber-500 bg-amber-50",
};

export default function AdminPage() {
  const { currentUser, isNeco } = useAuth();
  const [userSearch, setUserSearch] = useState("");

  const totalJobs = jobPostings.filter((j) => j.isActive).length;
  const totalApps = applications.length;
  const totalViews = jobPostings.reduce((s, j) => s + j.viewCount, 0);
  const totalUsers = adminUsers.filter((u) => u.isActive).length;

  const filteredUsers = adminUsers.filter(
    (u) =>
      u.isActive &&
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        ROLE_LABELS[u.role].includes(userSearch))
  );

  // Clinic-level metrics
  const clinicMetrics = clinics.map((clinic) => {
    const jobs = jobPostings.filter((j) => j.clinicId === clinic.id);
    const activeJobs = jobs.filter((j) => j.isActive);
    const apps = applications.filter((a) => a.clinicId === clinic.id);
    const views = jobs.reduce((s, j) => s + j.viewCount, 0);
    const users = adminUsers.filter(
      (u) => u.clinicIds.includes(clinic.id) || u.role === "neco_admin"
    );
    return { clinic, activeJobs: activeJobs.length, totalApps: apps.length, views, users: users.length, apps };
  });

  if (!isNeco) {
    return (
      <div className="p-6 sm:p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold">アクセス権限がありません</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              このページはNeco管理者のみアクセスできます。
            </p>
            <Link href="/dashboard">
              <Button variant="accent" className="mt-6">
                ダッシュボードに戻る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Neco 管理ダッシュボード</h1>
            <p className="text-sm text-muted-foreground">
              全クリニック横断管理 — {currentUser.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Platform Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { label: "管理クリニック", value: clinics.length, suffix: "院", icon: Building2, gradient: "from-blue-500 to-indigo-500", bg: "bg-gradient-to-br from-blue-50 to-indigo-50" },
          { label: "公開求人数", value: totalJobs, suffix: "件", icon: Briefcase, gradient: "from-violet-500 to-purple-500", bg: "bg-gradient-to-br from-violet-50 to-purple-50" },
          { label: "全候補者数", value: totalApps, suffix: "名", icon: Users, gradient: "from-fuchsia-500 to-pink-500", bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50" },
          { label: "合計閲覧数", value: totalViews.toLocaleString(), suffix: "", icon: Eye, gradient: "from-amber-500 to-orange-500", bg: "bg-gradient-to-br from-amber-50 to-orange-50" },
          { label: "登録ユーザー", value: totalUsers, suffix: "名", icon: Users, gradient: "from-emerald-500 to-teal-500", bg: "bg-gradient-to-br from-emerald-50 to-teal-50" },
        ].map((metric, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <div className={`${metric.bg} p-2 rounded-xl`}>
                  <metric.icon className="h-3.5 w-3.5" style={{ color: metric.gradient.includes("blue") ? "#3b82f6" : metric.gradient.includes("violet") ? "#8b5cf6" : metric.gradient.includes("fuchsia") ? "#d946ef" : metric.gradient.includes("amber") ? "#f59e0b" : "#10b981" }} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">
                {metric.value}
                <span className="text-sm font-normal text-muted-foreground ml-0.5">{metric.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Clinic Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">クリニック別概要</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clinicMetrics.map(({ clinic, activeJobs, totalApps, views, apps }) => {
            const pipeline = PIPELINE_STAGES.map((s) => ({
              ...s,
              count: apps.filter((a) => a.stage === s.id).length,
            }));
            return (
              <Card key={clinic.id} className="border-0 shadow-sm overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${clinic.brand.coverImageGradient}`} />
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: clinic.brand.brandColorLight }}
                    >
                      <ClinicLogo clinicId={clinic.id} size={24} color={clinic.brand.brandColor} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{clinic.name}</h3>
                      <p className="text-xs text-muted-foreground">{clinic.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{activeJobs}</p>
                      <p className="text-[10px] text-muted-foreground">求人</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{totalApps}</p>
                      <p className="text-[10px] text-muted-foreground">候補者</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{views.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">閲覧数</p>
                    </div>
                  </div>

                  {/* Mini pipeline */}
                  <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-muted">
                    {pipeline.filter((s) => s.count > 0).map((s) => (
                      <div
                        key={s.id}
                        className="h-full transition-all"
                        style={{
                          width: `${totalApps ? (s.count / totalApps) * 100 : 0}%`,
                          backgroundColor: s.color,
                          minWidth: s.count > 0 ? "8px" : "0",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {pipeline.filter((s) => s.count > 0).map((s) => (
                      <span key={s.id} className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label} {s.count}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ユーザー管理</CardTitle>
                <Button variant="accent" size="sm" className="gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="ユーザーを検索..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <div className="space-y-2 max-h-[360px] overflow-y-auto">
                {filteredUsers.map((user) => {
                  const userClinics = user.role === "neco_admin"
                    ? "全クリニック"
                    : clinics
                        .filter((c) => user.clinicIds.includes(c.id))
                        .map((c) => c.name)
                        .join("、") || "未割当";
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${roleColors[user.role]} text-white text-sm font-semibold shrink-0`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <Badge className={`text-[10px] border ${roleBgColors[user.role]}`}>
                            {ROLE_LABELS[user.role]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{userClinics}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0 h-7 w-7 p-0">
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  システムアクティビティ
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemActivities.map((activity, i) => {
                  const IconComp = activityIcons[activity.type];
                  const colorClass = activityColors[activity.type];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${colorClass} shrink-0 mt-0.5`}>
                        <IconComp className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{activity.user}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">システムステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "データベース", status: "正常", icon: CheckCircle2, color: "text-emerald-500" },
                { label: "AI Agent", status: "稼働中", icon: Bot, color: "text-indigo-500" },
                { label: "メール配信", status: "正常", icon: Mail, color: "text-emerald-500" },
                { label: "ファイルストレージ", status: "正常", icon: CheckCircle2, color: "text-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
