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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function HomePage() {
  const activeJobs = jobPostings.filter((j) => j.isActive);
  const categories = [...new Set(activeJobs.map((j) => j.category))];

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero — clean, product-focused */}
      <section className="relative overflow-hidden bg-gray-950 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-sm font-medium text-indigo-400 tracking-wide mb-4">
              医療機関のための共同管理型・採用OS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              自院ブランドの採用を、
              <br />
              最後まで壊さず進める。
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              NEXOSは、各医療機関が自院名義で採用ページ・求人・選考を管理し、必要に応じてNecoが共同運用に入れる採用プラットフォーム。採用ハーネスが、長い採用活動を壊れず完遂させます。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent" className="w-full sm:w-auto">
                  無料で始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  求人を探す
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Product preview — mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 shadow-2xl shadow-black/20 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-800 rounded-md py-1 px-3 text-xs text-gray-500 text-center max-w-xs mx-auto">
                    nexos.necofindjob.com/dashboard
                  </div>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "公開中求人", value: `${activeJobs.length}件`, color: "text-blue-400" },
                  { label: "候補者", value: "7名", color: "text-violet-400" },
                  { label: "SLA遵守率", value: "71%", color: "text-amber-400" },
                  { label: "未対応アラート", value: "3件", color: "text-red-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl bg-gray-800/60 p-4 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-xl bg-gray-800/40 p-4">
                  <p className="text-xs text-gray-500 mb-3">選考パイプライン</p>
                  <div className="space-y-2">
                    {["応募済み", "書類選考", "面接", "内定"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-16">{s}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-700 overflow-hidden">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${[60, 40, 25, 10][i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-800/40 p-4">
                  <p className="text-xs text-gray-500 mb-3">アラート</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-gray-400">未対応応募 (48h超)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-gray-400">面接ステージ滞留</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-gray-400">SLA超過 (書類選考)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 sm:gap-16 text-center"
          >
            {[
              { label: "掲載クリニック", value: `${clinics.length}院` },
              { label: "公開求人", value: `${activeJobs.length}件` },
              { label: "職種カテゴリ", value: `${categories.length}種` },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3-Layer Architecture */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-accent tracking-wide mb-3">NEXOSの3層構造</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              採用ブランド + 共同運用 + 採用ハーネス
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              単なる求人媒体でもATSでもない。採用活動を最後まで壊れず進めるOS
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Building2,
                num: "01",
                title: "採用ブランドOS",
                description: "自院の世界観で採用ページを構築。ブランドカラー、理念、文化を反映した採用体験を、各医療機関が自分で持てます。",
                features: ["自院名義の採用ページ", "ブランドカスタマイズ", "求人公開・管理"],
              },
              {
                icon: Shield,
                num: "02",
                title: "共同運用レイヤー",
                description: "セルフサーブで終わらない。必要に応じてNecoが共同編集・共同運用に入り、採用活動の成果に伴走します。",
                features: ["Neco共同編集", "クロスクリニック管理", "運用改善支援"],
              },
              {
                icon: Zap,
                num: "03",
                title: "採用ハーネス",
                description: "応募対応漏れ、ステージ滞留、面接未設定。長い採用活動で起きる問題をルールベースで検知し、壊れず完遂させます。",
                features: ["SLA監視・アラート", "公開前チェックリスト", "タスク・期限管理"],
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border shadow-none hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-sm font-bold text-accent/40">{item.num}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <ul className="mt-5 space-y-2">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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

      {/* Who it's for */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              医師採用を中心とした、医療機関向け採用基盤
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              常勤医師、非常勤医師、専門医採用。採用資産が自院に蓄積する仕組みを
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Building2,
                title: "自院ブランドの採用ページ",
                description: "各クリニックが自院の世界観で採用ページを持てます。ブランドカラー、理念、文化を求職者に直接伝えます。",
              },
              {
                icon: Users,
                title: "一気通貫の選考管理",
                description: "応募から内定まで、候補者の選考プロセスをダッシュボードで管理。SLA監視でタスク漏れを防ぎます。",
              },
              {
                icon: Shield,
                title: "Neco共同運用",
                description: "必要に応じてNecoが共同で運用に入ります。求人改善、応募対応、歩留まり改善をパートナーとして支援。",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border shadow-none hover:shadow-md transition-shadow">
                  <CardContent className="p-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 mb-4">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">利用の流れ</h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              3ステップで自院ブランドの採用活動を開始
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
              { step: "01", title: "採用ページを作成", description: "自院のブランドカラー、理念、文化を反映した採用ページを作成。公開前チェックリストで品質を担保します。" },
              { step: "02", title: "求人を公開・管理", description: "求人を作成・公開し、共通求人ボードにも同時掲載。必須項目チェックで漏れなく公開できます。" },
              { step: "03", title: "選考を完遂する", description: "応募者管理、ステージ進行、SLA監視まで一気通貫。ハーネスが最後まで壊れず進めます。" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="relative">
                  <div className="text-6xl font-bold text-accent/10 mb-3 leading-none">{item.step}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Co-management highlight */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} viewport={{ once: true }}>
              <p className="text-sm font-medium text-accent tracking-wide mb-3">共同運用</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                一人で抱えない。
                <br />
                共同運用という選択肢。
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                NEXOSは単なるセルフサーブのSaaSではありません。
                採用ページの作成、求人票の改善、応募者対応まで、
                必要に応じてNecoが共同で運用に入ることができます。
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                各医療機関が「自院の採用子会社を持ったような」体験を実現します。
              </p>
              <div className="mt-7">
                <Link href="/login">
                  <Button variant="accent" size="lg">
                    管理画面を体験する
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div {...fadeUp} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[
                { label: "採用ページ編集", desc: "自院でもNecoでも編集可能", Icon: IconPageEdit },
                { label: "求人票の改善", desc: "応募率向上をAIが支援", Icon: IconSparkle },
                { label: "選考管理", desc: "候補者管理を共同で推進", Icon: IconClipboard },
                { label: "採用分析", desc: "データに基づく改善提案", Icon: IconChart },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border hover:shadow-md transition-shadow">
                  <item.Icon size={24} color="#4f46e5" className="mb-3" />
                  <h4 className="text-sm font-semibold">{item.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gray-950">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              自院ブランドの採用を、今すぐ始めよう
            </h2>
            <p className="mt-5 text-base text-gray-400 max-w-2xl mx-auto">
              NEXOSなら、採用ページの立ち上げから選考完遂まで。
              共同運用とハーネスが、採用活動を壊れず進めます。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent">
                  無料で始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  求人を探す
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
