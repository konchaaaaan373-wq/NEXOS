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
  Shield,
  MapPin,
  Zap,
  Layers,
  Target,
  Network,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
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
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-soft" />
              <span className="text-xs font-medium text-cyan-300 tracking-wide">
                Next-Generation Recruitment OS
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.12] tracking-tight">
              すべての医療機関に、
              <br />
              <span className="text-gradient">専属の採用チームを。</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              NEXOSは、各医療機関が自院名義で採用ページ・求人・選考を運営できる採用OS。
              まるで自社の人材紹介部門を持ったかのように、採用活動のすべてを自院で完結できます。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent" className="w-full sm:w-auto shadow-lg shadow-cyan-500/20">
                  自院の採用を始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                >
                  求人を探す
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* プロダクトプレビュー */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-black/30 overflow-hidden glow-cyan">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-800/80 rounded-lg py-1 px-3 text-xs text-slate-500 text-center max-w-xs mx-auto">
                    yourclnic.nexos.jp/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "公開中求人", value: `${activeJobs.length}件`, color: "text-cyan-400" },
                  { label: "応募者数", value: "7名", color: "text-blue-400" },
                  { label: "面接設定率", value: "71%", color: "text-teal-400" },
                  { label: "採用進捗", value: "順調", color: "text-emerald-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-4 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-xl bg-slate-800/30 border border-slate-700/20 p-4">
                  <p className="text-xs text-slate-500 mb-3">選考の進み具合</p>
                  <div className="space-y-2">
                    {["応募済み", "書類選考", "面接", "内定"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-16">{s}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${[60, 40, 25, 10][i]}%`,
                              background: `linear-gradient(90deg, #06b6d4, #3b82f6)`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-800/30 border border-slate-700/20 p-4">
                  <p className="text-xs text-slate-500 mb-3">次のアクション</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="text-slate-400">面接日程調整 (2件)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-slate-400">書類選考 (3件)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span className="text-slate-400">内定通知準備 (1件)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 数値 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-14 flex items-center justify-center gap-8 sm:gap-16 text-center"
          >
            {[
              { label: "導入医療機関", value: `${clinics.length}院` },
              { label: "公開求人数", value: `${activeJobs.length}件` },
              { label: "対応職種", value: `${categories.length}カテゴリ` },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* コンセプト: 自院専属の採用チーム */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 grid-pattern-light" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 mb-4">
              <span className="text-xs font-medium text-cyan-700 tracking-wide">Why NEXOS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              採用ページも、求人管理も、選考も。
              <br className="hidden sm:block" />
              <span className="text-gradient">自院の名前で、自院が運営する。</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              人材紹介会社に頼り切りにならない。自院が主体となって採用活動を行える基盤を、NEXOSが提供します。
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
                title: "自院ブランドの採用ページ",
                description: "病院・クリニックごとに独自の採用ページを構築。自院の理念、文化、魅力を直接求職者に届けられます。",
                features: ["自院名義の採用サイト", "ブランドカラー反映", "セクション自由編集"],
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Target,
                num: "02",
                title: "求人から内定まで一気通貫",
                description: "求人作成・公開・応募管理・選考進行をすべて自院の管理画面で管理。採用の全工程を自分たちの手で。",
                features: ["求人作成・公開管理", "応募者の選考進捗", "対応期限の管理"],
                gradient: "from-blue-500 to-violet-500",
              },
              {
                icon: Network,
                num: "03",
                title: "必要な時だけ、Necoが伴走",
                description: "すべてを自力でやる必要はありません。求人改善や選考サポートが必要な時、Necoがパートナーとして共同運用に入ります。",
                features: ["共同編集・共同運用", "運用改善アドバイス", "AI求人最適化"],
                gradient: "from-violet-500 to-fuchsia-500",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border border-slate-200/80 shadow-none hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-sm`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-300">{item.num}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <ul className="mt-5 space-y-2">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient} shrink-0`} />
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

      {/* 導入医療機関 */}
      <section className="py-24 sm:py-32 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 mb-4">
              <span className="text-xs font-medium text-blue-700 tracking-wide">Partner Clinics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              自院の採用ページを運営する医療機関たち
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
              NEXOSを導入した各院が、自分たちの名前とブランドで採用活動を行っています
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
                    <Card className="group overflow-hidden card-hover h-full border border-slate-200/80 shadow-none hover:shadow-lg hover:shadow-slate-200/50">
                      <div
                        className={`h-36 bg-gradient-to-br ${clinic.brand.coverImageGradient} flex items-center justify-center relative`}
                      >
                        <div className="absolute inset-0 bg-black/5 grid-pattern" />
                        <ClinicLogo clinicId={clinic.id} size={56} color="white" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold group-hover:text-cyan-600 transition-colors">
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
                          <span className="text-sm font-medium text-cyan-600">
                            {clinicJobs.length}件の求人
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
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

      {/* 最新の求人 */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="mb-14">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 mb-4">
                  <span className="text-xs font-medium text-teal-700 tracking-wide">Latest Jobs</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  各院が公開中の求人
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  医療機関が直接発信する求人情報
                </p>
              </div>
              <Link href="/jobs" className="hidden sm:block">
                <Button variant="outline" className="border-slate-300 hover:border-cyan-300 hover:text-cyan-700">
                  すべて見る
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
                    <Card className="group card-hover h-full border border-slate-200/80 shadow-none hover:shadow-lg hover:shadow-slate-200/50">
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
                            <h3 className="text-base font-semibold mt-0.5 group-hover:text-cyan-600 transition-colors">
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

      {/* 利用の流れ */}
      <section className="py-24 sm:py-32 relative bg-slate-50/50">
        <div className="absolute inset-0 grid-pattern-light" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 mb-4">
              <span className="text-xs font-medium text-violet-700 tracking-wide">How it works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              3ステップで、自院専属の採用チームが稼働
            </h2>
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
                title: "採用ページを立ち上げる",
                description: "自院のブランドカラー・理念・写真を使った採用ページを作成。求職者に直接メッセージを届けるメディアを持てます。",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                step: "02",
                title: "求人を公開し、応募を受ける",
                description: "求人作成・公開。NEXOSの共通求人ボードにも同時掲載され、自院への応募を直接受け付けます。",
                gradient: "from-blue-500 to-violet-500",
              },
              {
                step: "03",
                title: "選考を進め、採用を完遂する",
                description: "応募者の管理、面接調整、内定までを管理画面で確認。対応漏れを防ぎ、採用活動を最後まで完遂します。",
                gradient: "from-violet-500 to-fuchsia-500",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="relative">
                  <div className={`text-6xl font-black mb-4 leading-none bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent opacity-20`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 共同運用セクション */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 mb-5">
                <span className="text-xs font-medium text-cyan-700 tracking-wide">Co-Operation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                人材紹介会社に丸投げしない。
                <br />
                <span className="text-gradient">でも、一人で抱えない。</span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                自院が採用の主体となりながら、必要に応じてNecoが共同で運用に入る。
                求人票の改善、応募者対応、歩留まり分析まで、パートナーとして伴走します。
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                各医療機関が「自社の人材紹介部門を持ったような」体験を実現するのが、NEXOSの設計思想です。
              </p>
              <div className="mt-8">
                <Link href="/login">
                  <Button variant="accent" size="lg" className="shadow-lg shadow-cyan-500/20">
                    管理画面を体験する
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div {...fadeUp} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[
                { label: "採用ページ編集", desc: "自院でもNecoでも編集可能", Icon: IconPageEdit, color: "#0891b2" },
                { label: "AI求人最適化", desc: "応募率向上をAIが支援", Icon: IconSparkle, color: "#3b82f6" },
                { label: "選考管理", desc: "応募者の対応を共同で推進", Icon: IconClipboard, color: "#8b5cf6" },
                { label: "数字で見る採用", desc: "現状把握に基づく改善提案", Icon: IconChart, color: "#06b6d4" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border border-slate-200/80 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                  <item.Icon size={24} color={item.color} className="mb-3" />
                  <h4 className="text-sm font-semibold">{item.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-[-100px] right-[-50px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              自院専属の採用チームを、
              <br />
              今日から立ち上げよう。
            </h2>
            <p className="mt-5 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              採用ページの構築から、求人公開、選考管理、そして採用完遂まで。
              NEXOSが、あなたの医療機関の採用インフラになります。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent" className="shadow-lg shadow-cyan-500/20">
                  無料で始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600">
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
