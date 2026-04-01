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
import {
  MapPin,
  Users,
  Calendar,
  Heart,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Sparkles,
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

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero with clinic brand */}
      <section className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${clinic.brand.coverImageGradient} py-20 sm:py-28`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <span className="text-6xl mb-6 block">{clinic.brand.logoEmoji}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {clinic.name}
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                {clinic.mission}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
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
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* About */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">クリニックについて</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {clinic.description}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-muted/50">
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
            <div className="p-5 rounded-xl bg-muted/50">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4" style={{ color: clinic.brand.brandColor }} />
                カルチャー
              </h3>
              <ul className="space-y-1.5">
                {clinic.culture.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-muted/50">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: clinic.brand.brandColor }} />
                福利厚生
              </h3>
              <ul className="space-y-1.5">
                {clinic.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="text-sm text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Open positions */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">募集中のポジション</h2>
              <p className="mt-2 text-muted-foreground">
                {clinicJobs.length}件の求人を公開しています
              </p>
            </div>
          </div>

          {clinicJobs.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
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
                    <Card className="group hover:shadow-lg transition-all duration-300"
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
                              <Badge variant="secondary">{job.category}</Badge>
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
      </div>

      <PublicFooter />
    </div>
  );
}
