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
import { NECO_FOR_MEDICAL_URL } from "@/lib/neco-links";
import {
  ArrowRight,
  Building2,
  MapPin,
  Target,
  Network,
} from "lucide-react";

/* 控えめなフェードイン（装飾アニメなし） */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
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
    <div className="min-h-screen bg-paper">
      <PublicHeader />

      {/* Hero: ダーク背景 + セリフ体の大きな見出し */}
      <section className="relative bg-ink pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-medium text-accent-light tracking-wide mb-6">
              Next-Generation Recruitment OS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.15] tracking-tight font-serif">
              すべての医療機関に、
              <br />
              <span className="font-bold">専属の採用チームを。</span>
            </h1>
            <p className="mt-8 text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl">
              NEXOSは、各医療機関が自院名義で採用ページ・求人・選考を運営できる採用OS。
              まるで自社の人材紹介部門を持ったかのように、採用活動のすべてを自院で完結できます。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent" className="w-full sm:w-auto">
                  自院の採用を始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={NECO_FOR_MEDICAL_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500"
                >
                  求人を探す
                </Button>
              </a>
            </div>
          </motion.div>

          {/* 数値: ゴールド色でインパクト */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-16 flex items-start gap-12 sm:gap-20"
          >
            {[
              { label: "導入医療機関", value: `${clinics.length}院` },
              { label: "公開求人数", value: `${activeJobs.length}件` },
              { label: "対応職種", value: `${categories.length}カテゴリ` },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-gold font-serif">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* プロダクトプレビュー: シンプルなカード */}
      <section className="py-16 sm:py-20 bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-paper-alt">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white border border-border rounded-md py-1 px-3 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                    yourclinic.nexos.jp/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "公開中求人", value: `${activeJobs.length}件`, color: "text-accent" },
                  { label: "応募者数", value: "7名", color: "text-info" },
                  { label: "面接設定率", value: "71%", color: "text-success" },
                  { label: "採用進捗", value: "順調", color: "text-gold" },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-paper-alt border border-border p-4 text-center">
                    <p className={`text-xl font-bold font-serif ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-paper-alt border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-3">選考パイプライン</p>
                  <div className="space-y-2">
                    {["応募済み", "書類選考", "面接", "内定"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">{s}</span>
                        <div className="flex-1 h-2 rounded-sm bg-border overflow-hidden">
                          <div
                            className="h-full rounded-sm bg-accent"
                            style={{ width: `${[60, 40, 25, 10][i]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-paper-alt border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-3">次のアクション</p>
                  <div className="space-y-2">
                    {[
                      { text: "面接日程調整 (2件)", color: "bg-accent" },
                      { text: "書類選考 (3件)", color: "bg-info" },
                      { text: "内定通知準備 (1件)", color: "bg-success" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                        <span className="text-muted-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* コンセプト: 非対称2カラムレイアウト */}
      <section className="py-20 sm:py-28 section-alt">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-medium text-accent tracking-wide mb-3">Why NEXOS</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
              採用ページも、求人管理も、選考も。
              <br className="hidden sm:block" />
              <span className="font-bold">自院の名前で、自院が運営する。</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground max-w-2xl leading-relaxed">
              人材紹介会社に頼り切りにならない。自院が主体となって採用活動を行える基盤を、NEXOSが提供します。
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: Building2,
                num: "01",
                title: "自院ブランドの採用ページ",
                description: "病院・クリニックごとに独自の採用ページを構築。自院の理念、文化、魅力を直接求職者に届けられます。",
                features: ["自院名義の採用サイト", "ブランドカラー反映", "セクション自由編集"],
              },
              {
                icon: Target,
                num: "02",
                title: "求人から内定まで一気通貫",
                description: "求人作成・公開・応募管理・選考進行をすべて自院のダッシュボードで管理。採用の全工程を自分たちの手で。",
                features: ["求人作成・公開管理", "応募者パイプライン", "SLA監視・タスク管理"],
              },
              {
                icon: Network,
                num: "03",
                title: "必要な時だけ、Necoが伴走",
                description: "すべてを自力でやる必要はありません。求人改善や選考サポートが必要な時、Necoがパートナーとして共同運用に入ります。",
                features: ["共同編集・共同運用", "運用改善アドバイス", "AI求人最適化"],
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                {/* 非対称レイアウト: テキスト3 : 余白2 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-1">
                    <span className="text-3xl font-serif font-light text-gold/40">{item.num}</span>
                  </div>
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10">
                        <item.icon className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.features.map((f) => (
                        <Badge key={f} variant="secondary">{f}</Badge>
                      ))}
                    </ul>
                  </div>
                </div>
                {i < 2 && <div className="border-b border-border mt-8" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 導入医療機関: 2カラム */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-sm font-medium text-accent tracking-wide mb-3">Partner Clinics</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
              自院の採用ページを運営する<span className="font-bold">医療機関たち</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl">
              NEXOSを導入した各院が、自分たちの名前とブランドで採用活動を行っています
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {clinics.map((clinic) => {
              const clinicJobs = jobPostings.filter(
                (j) => j.clinicId === clinic.id && j.isActive
              );
              return (
                <motion.div key={clinic.id} variants={fadeUp}>
                  <Link href={`/clinics/${clinic.slug}`}>
                    <Card className="group h-full">
                      <div
                        className="h-32 flex items-center justify-center"
                        style={{ backgroundColor: clinic.brand.brandColorLight }}
                      >
                        <ClinicLogo clinicId={clinic.id} size={48} color={clinic.brand.brandColor} />
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

      {/* 最新の求人 */}
      <section className="py-20 sm:py-28 section-alt">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="mb-14">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-accent tracking-wide mb-3">Latest Jobs</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
                  各院が公開中の<span className="font-bold">求人</span>
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  医療機関が直接発信する求人情報
                </p>
              </div>
              <Link href="/jobs" className="hidden sm:block">
                <Button variant="outline">
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {activeJobs.slice(0, 6).map((job) => {
              const clinic = clinics.find((c) => c.id === job.clinicId)!;
              return (
                <motion.div key={job.id} variants={fadeUp}>
                  <Link href={`/jobs/${job.id}`}>
                    <Card className="group h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                            style={{ backgroundColor: clinic.brand.brandColorLight }}
                          >
                            <ClinicLogo clinicId={clinic.id} size={22} color={clinic.brand.brandColor} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              {clinic.name}
                            </p>
                            <h3 className="text-base font-bold mt-0.5 group-hover:text-accent transition-colors">
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
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="mb-16">
            <p className="text-sm font-medium text-accent tracking-wide mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
              3ステップで、自院専属の<span className="font-bold">採用チームが稼働</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {[
              {
                step: "01",
                title: "採用ページを立ち上げる",
                description: "自院のブランドカラー・理念・写真を使った採用ページを作成。求職者に直接メッセージを届けるメディアを持てます。",
              },
              {
                step: "02",
                title: "求人を公開し、応募を受ける",
                description: "求人作成・公開。NEXOSの共通求人ボードにも同時掲載され、自院への応募を直接受け付けます。",
              },
              {
                step: "03",
                title: "選考を進め、採用を完遂する",
                description: "応募者管理、面接調整、内定までをダッシュボードで管理。タスク漏れを防ぎ、採用活動を最後まで完遂します。",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-2">
                    <span className="text-5xl font-serif font-light text-gold/30">{item.step}</span>
                  </div>
                  <div className="md:col-span-6">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 共同運用セクション: 非対称2カラム */}
      <section className="py-20 sm:py-28 section-alt">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div {...fadeUp} viewport={{ once: true }} className="lg:col-span-7">
              <p className="text-sm font-medium text-accent tracking-wide mb-3">Co-Operation</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight leading-tight">
                人材紹介会社に丸投げしない。
                <br />
                <span className="font-bold">でも、一人で抱えない。</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                自院が採用の主体となりながら、必要に応じてNecoが共同で運用に入る。
                求人票の改善、応募者対応、歩留まり分析まで、パートナーとして伴走します。
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                各医療機関が「自社の人材紹介部門を持ったような」体験を実現するのが、NEXOSの設計思想です。
              </p>
              <div className="mt-8">
                <Link href="/login">
                  <Button variant="accent" size="lg">
                    管理画面を体験する
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div {...fadeUp} viewport={{ once: true }} className="lg:col-span-5 space-y-4">
              {[
                { label: "採用ページ編集", desc: "自院でもNecoでも編集可能", Icon: IconPageEdit },
                { label: "AI求人最適化", desc: "応募率向上をAIが支援", Icon: IconSparkle },
                { label: "選考管理", desc: "候補者管理を共同で推進", Icon: IconClipboard },
                { label: "採用分析", desc: "データに基づく改善提案", Icon: IconChart },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white border border-border card-hover">
                  <item.Icon size={20} color="#0d7377" className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">{item.label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA: ダーク背景、シンプル */}
      <section className="py-20 sm:py-28 bg-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} viewport={{ once: true }} className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight leading-tight">
              自院専属の採用チームを、
              <br />
              <span className="font-bold">今日から立ち上げよう。</span>
            </h2>
            <p className="mt-6 text-base text-gray-400 leading-relaxed">
              採用ページの構築から、求人公開、選考管理、そして採用完遂まで。
              NEXOSが、あなたの医療機関の採用インフラになります。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
              <Link href="/login">
                <Button size="lg" variant="accent">
                  無料で始める
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500">
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
