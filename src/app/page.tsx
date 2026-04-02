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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0tMjQgMjRjMS42NTYgMCAzLTEuMzQ0IDMtM3MtMS4zNDQtMy0zLTMtMyAxLjM0NC0zIDMgMS4zNDQgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6 text-sm py-1 px-3">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              医療機関のための採用ブランドOS
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              自院ブランドで、
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                採用を変える。
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              NEXOSは、各クリニックが自院名義で採用ページを持ち、求人公開から選考管理まで一気通貫で行える採用プラットフォームです。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="xl" variant="accent" className="w-full sm:w-auto">
                  求人を探す
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800 hover:text-white"
                >
                  クリニック管理画面
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {[
              { label: "掲載クリニック数", value: `${clinics.length}院`, icon: Building2 },
              { label: "公開求人数", value: `${activeJobs.length}件`, icon: Briefcase },
              { label: "職種カテゴリ", value: `${categories.length}種`, icon: Users },
              { label: "応募完了率", value: "68%", icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Clinics */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              掲載クリニック
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
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <div
                        className={`h-32 bg-gradient-to-r ${clinic.brand.coverImageGradient} flex items-center justify-center`}
                      >
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
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="mb-14">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
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
                    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
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
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              NEXOSが実現すること
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              表は各院ブランド、裏はNEXOS共通基盤
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
                title: "自院ブランドの採用ページ",
                description:
                  "各クリニックが自院の世界観で採用ページを持てます。ブランドカラー、理念、文化を求職者に伝えます。",
              },
              {
                icon: Users,
                title: "一気通貫の選考管理",
                description:
                  "応募から内定まで、候補者の選考プロセスをダッシュボードで管理。チームでの共有もスムーズです。",
              },
              {
                icon: Shield,
                title: "共通基盤で効率化",
                description:
                  "求人公開、応募管理、分析機能をNEXOSが共通提供。各院は採用活動に集中できます。",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border-0 shadow-none bg-muted/50">
                  <CardContent className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-5">
                      <item.icon className="h-6 w-6 text-accent" />
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
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              利用の流れ
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              3ステップで自院ブランドの採用活動を開始できます
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
                title: "採用ページを作成",
                description:
                  "自院のブランドカラー、理念、文化を反映した採用ページをかんたんに作成。テンプレートではなく、自院だけの採用ページが完成します。",
              },
              {
                step: "02",
                title: "求人を公開",
                description:
                  "医師、看護師、医療事務など、募集したいポジションの求人を作成・公開。NEXOSの共通求人ボードにも同時掲載されます。",
              },
              {
                step: "03",
                title: "応募者を管理",
                description:
                  "応募から選考、内定まで一気通貫で管理。必要に応じてNecoが共同運用し、採用活動を支援します。",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="relative">
                  <div className="text-6xl font-bold text-accent/10 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold -mt-2">{item.title}</h3>
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
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} viewport={{ once: true }}>
              <Badge variant="warning" className="mb-4 text-sm py-1 px-3">
                NEXOSの特徴
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                一人で抱えない。
                <br />
                共同運用という選択肢。
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                NEXOSは単なるセルフサーブのSaaSではありません。
                採用ページの作成、求人票の改善、応募者対応まで、
                必要に応じてNecoが共同で運用に入ることができます。
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                各医療機関が「自院の採用子会社を持ったような」体験を、
                ソフトウェアとチームの力で実現します。
              </p>
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button variant="accent" size="lg">
                    管理画面を体験する
                    <ArrowRight className="h-4 w-4" />
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
                { label: "採用ページ編集", desc: "自院でもNecoでも編集可能", Icon: IconPageEdit },
                { label: "求人票の改善", desc: "応募率向上をNecoが支援", Icon: IconSparkle },
                { label: "選考管理", desc: "候補者管理を共同で推進", Icon: IconClipboard },
                { label: "採用分析", desc: "データに基づく改善提案", Icon: IconChart },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <item.Icon size={28} color="#2563eb" className="mb-3" />
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
      <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              採用を、自院ブランドで始めよう
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              NEXOSなら、最短で自院の採用ページを立ち上げられます。
              まずは管理画面から始めてみてください。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="xl" variant="accent">
                  管理画面を見る
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 hover:text-white"
                >
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
