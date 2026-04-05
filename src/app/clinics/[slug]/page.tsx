"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clinics, jobPostings } from "@/data/seed";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import {
  MapPin,
  Users,
  Calendar,
  Heart,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ClinicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const clinic = clinics.find((c) => c.slug === slug);

  if (!clinic) return notFound();

  const clinicJobs = jobPostings.filter(
    (j) => j.clinicId === clinic.id && j.isActive
  );

  // Use pageSections to determine what to show and in what order
  const visibleSections = clinic.pageSections
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero with clinic brand */}
      <section className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${clinic.brand.coverImageGradient} py-20 sm:py-32`}
        >
          <div className="absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                <ClinicLogo clinicId={clinic.id} size={72} color="white" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {clinic.name}
              </h1>
              {clinic.brand.heroTagline && (
                <p className="mt-3 text-lg sm:text-xl text-white/90 font-medium">
                  {clinic.brand.heroTagline}
                </p>
              )}
              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {clinic.mission}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {clinic.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {clinic.employeeCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {clinic.foundedYear}年設立
                </span>
              </div>
              {clinicJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <a href="#positions">
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                    >
                      <Briefcase className="h-4 w-4" />
                      {clinicJobs.length}件の求人を見る
                    </Button>
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {visibleSections.map((section, idx) => {
          if (section.type === "hero") return null; // already rendered above

          if (section.type === "about") {
            return (
              <motion.section
                key={section.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-3xl text-base">
                  {clinic.description}
                </p>

                {/* Key info cards */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" style={{ color: clinic.brand.brandColor }} />
                      診療科目
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {clinic.specialties.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" style={{ color: clinic.brand.brandColor }} />
                      基本情報
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {clinic.location}
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        従業員数 {clinic.employeeCount}
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {clinic.foundedYear}年設立
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" style={{ color: clinic.brand.brandColor }} />
                      採用実績
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>公開中の求人: {clinicJobs.length}件</li>
                      <li>
                        職種:{" "}
                        {[...new Set(clinicJobs.map((j) => j.category))].join(
                          "、"
                        ) || "—"}
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>
            );
          }

          if (section.type === "culture") {
            return (
              <motion.section
                key={section.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="h-5 w-5" style={{ color: clinic.brand.brandColor }} />
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {clinic.culture.map((c, i) => (
                    <div
                      key={c}
                      className="p-5 rounded-lg border hover:shadow-sm transition-shadow"
                      style={{ borderLeftWidth: 3, borderLeftColor: clinic.brand.brandColor }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: clinic.brand.brandColor }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium">{c}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          }

          if (section.type === "benefits") {
            return (
              <motion.section
                key={section.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {clinic.benefits.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2
                        className="h-4.5 w-4.5 shrink-0"
                        style={{ color: clinic.brand.brandColor }}
                      />
                      <span className="text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          }

          if (section.type === "jobs") {
            return (
              <motion.section
                key={section.id}
                id="positions"
                {...fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <p className="mt-2 text-muted-foreground">
                      {clinicJobs.length}件の求人を公開しています
                    </p>
                  </div>
                </div>

                {clinicJobs.length === 0 ? (
                  <div className="text-center py-16 bg-muted/30 rounded-lg">
                    <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      現在、公開中の求人はありません
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clinicJobs.map((job, i) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                      >
                        <Link href={`/jobs/${job.id}`}>
                          <Card
                            className="group hover:shadow-lg transition-all duration-300"
                            style={{
                              borderLeftWidth: 3,
                              borderLeftColor: clinic.brand.brandColor,
                            }}
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                    {job.title}
                                  </h3>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="secondary">
                                      {job.category}
                                    </Badge>
                                    <Badge variant="accent">
                                      {job.type === "full-time"
                                        ? "常勤"
                                        : job.type === "part-time"
                                          ? "非常勤"
                                          : "契約"}
                                    </Badge>
                                  </div>
                                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-primary">
                                      <DollarSign className="h-3.5 w-3.5" />
                                      {(job.salaryMin / 10000).toFixed(0)}万〜
                                      {(job.salaryMax / 10000).toFixed(0)}万円
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  className="shrink-0 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all"
                                >
                                  詳細を見る
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>
            );
          }

          return null;
        })}
      </div>

      {/* CTA */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: clinic.brand.brandColorLight }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {clinic.name}で働きませんか？
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            私たちと一緒に、医療の未来を創りましょう。
            ご応募をお待ちしています。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {clinicJobs.length > 0 && (
              <a href="#positions">
                <Button size="lg" variant="accent">
                  求人を見る
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            )}
            <a href="mailto:contact@necofindjob.com">
              <Button size="lg" variant="outline">
                お問い合わせ
              </Button>
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
