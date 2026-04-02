"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clinics, jobPostings } from "@/data/seed";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { IconPageEdit, IconSparkle, IconClipboard, IconChart } from "@/components/icons/feature-icons";
import {
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  Shield,
  Sparkles,
  TrendingUp,
  MapPin,
  Bot,
  Zap,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const activeJobs = jobPostings.filter((j) => j.isActive);
  const categories = [...new Set(activeJobs.map((j) => j.category))];

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 gradient-mesh-dark" />
        {/* Floating orbs */}
        <div className="absolute top-20 right-[15%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-[40%] left-[50%] w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm text-indigo-300 mb-8">
              <Sparkles className="h-4 w-4" />
              AI搭載の次世代採用OS
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              採用を、AIで
              <br />
              <span className="text-gradient">再定義する。</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              NEXOSは、AIエージェントが採用活動を自動化する次世代プラットフォーム。各医療機関が自院ブランドで採用ページを持ち、求人公開から選考管理まで一気通貫で行えます。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="xl" variant="gradient" className="w-full sm:w-auto gap-2">
                  <Zap className="h-5 w-5" />
                  無料で始める
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800 hover:text-white"
                >
                  求人を探す
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: "掲載クリニック数", value: `${clinics.length}院`, icon: Building2 },
              { label: "公開求人数", value: `${activeJobs.length}件`, icon: Briefcase },
              { label: "職種カテゴリ", value: `${categories.length}種`, icon: Users },
              { label: "応募完了率", value: "68%", icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="glass-dark rounded-2xl p-5 text-center">
                <stat.icon className="h-5 w-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Agent Showcase */}
      <section className="py-24 sm:py-32 gradient-mesh">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="accent" className="mb-4 text-sm py-1 px-3">
              <Bot className="h-3.5 w-3.5 mr-1.5" />
              AI Agent
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              AIエージェントが、
              <br />
              <span className="text-gradient">採用を自動化</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              求人票の作成から候補者分析まで、AIが採用業務をインテリジェントにサポート
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Chat Demo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  <div className="relative">
                    <Bot className="h-5 w-5" />
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
                  </div>
                  <span className="text-sm font-medium">NEXOS AI Agent</span>
                  <Badge className="ml-auto bg-white/20 text-white text-[10px] border-0">Claude搭載</Badge>
                </div>
                <CardContent className="p-5 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                  {/* AI message */}
                  <div className="flex gap-2">
                    <div className="shrink-0 mt-1 p-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl rounded-bl-lg px-4 py-3 text-sm max-w-[85%]">
                      こんにちは！看護師の求人票を分析しました。応募率を<strong>35%向上</strong>させる改善案があります。
                    </div>
                  </div>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-2xl rounded-br-lg px-4 py-3 text-sm max-w-[85%]">
                      改善案を見せて
                    </div>
                  </div>
                  {/* AI message */}
                  <div className="flex gap-2">
                    <div className="shrink-0 mt-1 p-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl rounded-bl-lg px-4 py-3 text-sm max-w-[85%]">
                      <p className="font-semibold text-indigo-600 mb-1">3つの改善提案:</p>
                      <p>1. 給与レンジを明確化 → +15%<br/>2. 福利厚生を具体的に → +12%<br/>3. キャリアパスを追記 → +8%</p>
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex gap-2 items-center text-muted-foreground">
                    <div className="shrink-0 p-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex gap-1 px-4 py-3 bg-white border rounded-2xl rounded-bl-lg shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { icon: Sparkles, title: "求人票の最適化", desc: "AIが応募率を最大化する求人票を自動生成・改善", gradient: "from-indigo-500 to-violet-500", bg: "bg-indigo-50" },
                { icon: Users, title: "候補者マッチング", desc: "AIスコアリングで最適な候補者を瞬時に特定", gradient: "from-violet-500 to-fuchsia-500", bg: "bg-violet-50" },
                { icon: BarChart3, title: "採用分析レポート", desc: "データドリブンな採用改善提案を自動生成", gradient: "from-fuchsia-500 to-pink-500", bg: "bg-fuchsia-50" },
                { icon: MessageSquare, title: "選考プロセス管理", desc: "面接質問・評価テンプレートをAIが作成", gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-hover h-full border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${item.gradient} mb-4`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-base">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Clinics */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              導入クリニック
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              それぞれのクリニックが、自院ブランドの採用ページを運営しています
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {clinics.map((clinic) => {
              const clinicJobs = jobPostings.filter(
                (j) => j.clinicId === clinic.id && j.isActive
              );
              return (
                <motion.div key={clinic.id} variants={fadeUp}>
                  <Link href={`/clinics/${clinic.slug}`}>
                    <Card className="group overflow-hidden card-hover h-full border-0 shadow-sm">
                      <div
                        className={`h-36 bg-gradient-to-r ${clinic.brand.coverImageGradient} flex items-center justify-center relative`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <ClinicLogo clinicId={clinic.id} size={56} color="white" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                          {clinic.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {clinic.location}
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {clinic.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {clinic.specialties.slice(0, 3).map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <span className="text-sm font-medium text-accent">
                            {clinicJobs.length}件の求人
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="mb-14">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  最新の求人
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  あなたの経験を活かせる求人が見つかります
                </p>
              </div>
              <Link href="/jobs" className="hidden sm:block">
                <Button variant="outline">
                  すべての求人を見る
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {activeJobs.slice(0, 6).map((job) => {
              const clinic = clinics.find((c) => c.id === job.clinicId)!;
              return (
                <motion.div key={job.id} variants={fadeUp}>
                  <Link href={`/jobs/${job.id}`}>
                    <Card className="group card-hover h-full border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: clinic.brand.brandColorLight }}
                          >
                            <ClinicLogo clinicId={clinic.id} size={24} color={clinic.brand.brandColor} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              {clinic.name}
                            </p>
                            <h3 className="text-base font-semibold mt-0.5 group-hover:text-accent transition-colors">
                              {job.title}
                            </h3>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.category}</Badge>
                          <Badge variant="secondary">{job.type === "full-time" ? "常勤" : job.type === "part-time" ? "非常勤" : "契約"}</Badge>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          年収 {(job.salaryMin / 10000).toFixed(0)}万〜
                          {(job.salaryMax / 10000).toFixed(0)}万円
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/jobs">
              <Button variant="outline" className="w-full">
                すべての求人を見る
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              NEXOSが実現すること
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              表は各院ブランド、裏はNEXOS共通基盤、AIが採用を加速
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Building2,
                title: "AI搭載の採用ページ",
                description:
                  "各クリニックが自院の世界観で採用ページを持てます。AIが最適なコンテンツを提案し、応募率を最大化します。",
                gradient: "from-indigo-500 to-violet-500",
              },
              {
                icon: Users,
                title: "インテリジェント選考管理",
                description:
                  "応募から内定まで、AIが候補者をスコアリング。選考プロセスをダッシュボードで一元管理します。",
                gradient: "from-violet-500 to-fuchsia-500",
              },
              {
                icon: Shield,
                title: "共同運用プラットフォーム",
                description:
                  "求人公開、応募管理、分析機能をNEXOSが共通提供。必要に応じてNecoが共同運用に入ります。",
                gradient: "from-fuchsia-500 to-pink-500",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border-0 shadow-sm card-hover">
                  <CardContent className="p-8">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${item.gradient} mb-5`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              利用の流れ
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              3ステップでAI搭載の採用活動を開始できます
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "AIで採用ページを生成",
                description:
                  "自院のブランドカラー、理念、文化を入力するだけ。AIが最適な採用ページを自動生成します。",
              },
              {
                step: "02",
                title: "求人を公開・最適化",
                description:
                  "AIが求人票を分析し、応募率を最大化する表現を提案。共通求人ボードにも同時掲載されます。",
              },
              {
                step: "03",
                title: "AIが選考をサポート",
                description:
                  "候補者のマッチングスコア算出、面接質問の生成、採用レポートの自動作成をAIが担います。",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="relative">
                  <div className="text-7xl font-extrabold text-gradient mb-4 leading-none">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Co-management highlight */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} viewport={{ once: true }}>
              <Badge variant="warning" className="mb-5 text-sm py-1 px-3">
                NEXOSの特徴
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                一人で抱えない。
                <br />
                <span className="text-gradient">共同運用</span>という選択肢。
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                NEXOSは単なるセルフサーブのSaaSではありません。
                採用ページの作成、求人票の改善、応募者対応まで、
                必要に応じてNecoが共同で運用に入ることができます。
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                各医療機関が「自院の採用子会社を持ったような」体験を、
                AIとチームの力で実現します。
              </p>
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button variant="gradient" size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    管理画面を体験する
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "採用ページ編集", desc: "自院でもNecoでも編集可能", Icon: IconPageEdit, color: "#6366f1" },
                { label: "求人票の改善", desc: "AIが応募率向上を支援", Icon: IconSparkle, color: "#8b5cf6" },
                { label: "選考管理", desc: "候補者管理を共同で推進", Icon: IconClipboard, color: "#d946ef" },
                { label: "採用分析", desc: "データに基づく改善提案", Icon: IconChart, color: "#06b6d4" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border shadow-sm card-hover"
                >
                  <item.Icon size={28} color={item.color} className="mb-3" />
                  <h4 className="text-sm font-semibold">{item.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="absolute top-10 left-[20%] w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-[20%] w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              採用の未来を、
              <br />
              <span className="text-gradient">今すぐ始めよう</span>
            </h2>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              AIが採用活動を自動化する次世代プラットフォーム。
              まずは無料で始めてみてください。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="xl" variant="gradient" className="gap-2">
                  <Zap className="h-5 w-5" />
                  無料で始める
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 hover:text-white"
                >
                  求人を探す
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
