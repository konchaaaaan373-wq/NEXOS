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
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = jobPostings.find((j) => j.id === id);

  if (!job) return notFound();

  const clinic = clinics.find((c) => c.id === job.clinicId)!;
  const otherJobs = jobPostings.filter(
    (j) => j.clinicId === clinic.id && j.id !== job.id && j.isActive
  );

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/jobs" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              求人一覧
            </Link>
            <span>/</span>
            <span className="text-primary truncate">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <Link href={`/clinics/${clinic.slug}`}>
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg hover:scale-105 transition-transform"
                    style={{ backgroundColor: clinic.brand.brandColorLight }}
                  >
                    <ClinicLogo clinicId={clinic.id} size={32} color={clinic.brand.brandColor} />
                  </div>
                </Link>
                <div>
                  <Link
                    href={`/clinics/${clinic.slug}`}
                    className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  >
                    {clinic.name}
                  </Link>
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
                    {job.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="accent">
                      {job.type === "full-time"
                        ? "常勤"
                        : job.type === "part-time"
                          ? "非常勤"
                          : "契約"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Key info */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">勤務地</p>
                    <p className="text-sm font-medium">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">年収</p>
                    <p className="text-sm font-medium">
                      {(job.salaryMin / 10000).toFixed(0)}万〜
                      {(job.salaryMax / 10000).toFixed(0)}万円
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">掲載日</p>
                    <p className="text-sm font-medium">
                      {formatDate(job.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">仕事内容</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">応募要件</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to have */}
              {job.niceToHave.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold mb-4">歓迎条件</h2>
                  <ul className="space-y-2.5">
                    {job.niceToHave.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Star className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">待遇・福利厚生</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {job.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Apply CTA */}
            <Card className="border-2 border-accent/20 bg-accent/5 sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">この求人に応募する</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {clinic.name}が直接選考を行います
                </p>
                <Link href={`/apply/${job.id}`}>
                  <Button variant="accent" className="w-full mt-4" size="lg">
                    応募する
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Clinic info */}
            <Card>
              <CardContent className="p-6">
                <Link href={`/clinics/${clinic.slug}`} className="group">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: clinic.brand.brandColorLight }}
                    >
                      <ClinicLogo clinicId={clinic.id} size={28} color={clinic.brand.brandColor} />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-accent transition-colors">
                        {clinic.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {clinic.location} · {clinic.employeeCount}
                      </p>
                    </div>
                  </div>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {clinic.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {clinic.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
                <Link href={`/clinics/${clinic.slug}`}>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    クリニック採用ページを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Other jobs */}
            {otherJobs.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">
                    {clinic.name}の他の求人
                  </h3>
                  <div className="space-y-3">
                    {otherJobs.map((oj) => (
                      <Link
                        key={oj.id}
                        href={`/jobs/${oj.id}`}
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium">{oj.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {oj.category} ·{" "}
                          {(oj.salaryMin / 10000).toFixed(0)}万〜
                          {(oj.salaryMax / 10000).toFixed(0)}万円
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
