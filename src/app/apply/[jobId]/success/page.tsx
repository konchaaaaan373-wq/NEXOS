"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clinics, jobPostings } from "@/data/seed";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

export default function ApplySuccessPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const job = jobPostings.find((j) => j.id === jobId);
  if (!job) return notFound();

  const clinic = clinics.find((c) => c.id === job.clinicId)!;

  return (
    <div className="min-h-screen bg-muted/30">
      <PublicHeader />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center">
            <CardContent className="p-8 sm:p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2,
                }}
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-6"
                  style={{ backgroundColor: clinic.brand.brandColorLight }}
                >
                  <CheckCircle2
                    className="h-10 w-10"
                    style={{ color: clinic.brand.brandColor }}
                  />
                </div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                応募が完了しました
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-md mx-auto">
                {clinic.name}の「{job.title}」への応募を受け付けました。
                選考結果は、ご登録いただいたメールアドレスにご連絡いたします。
              </p>

              <div className="mt-8 p-4 rounded-xl bg-muted/50 max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: clinic.brand.brandColorLight }}
                  >
                    <ClinicLogo clinicId={clinic.id} size={24} color={clinic.brand.brandColor} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground">{job.title}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/jobs">
                  <Button variant="accent" size="lg">
                    他の求人を見る
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    <Home className="h-4 w-4" />
                    トップへ戻る
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <PublicFooter />
    </div>
  );
}
