"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { clinics, jobPostings } from "@/data/seed";
import { ClinicLogo } from "@/components/icons/clinic-logos";
import { MapPin, Search, Briefcase, Building2, DollarSign, Sparkles } from "lucide-react";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const activeJobs = jobPostings.filter((j) => j.isActive);
  const categories = [...new Set(activeJobs.map((j) => j.category))];

  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const clinic = clinics.find((c) => c.id === job.clinicId);
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || job.category === selectedCategory;
      const matchesClinic =
        !selectedClinic || job.clinicId === selectedClinic;
      const matchesType = !selectedType || job.type === selectedType;

      return matchesSearch && matchesCategory && matchesClinic && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedClinic, selectedType, activeJobs]);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 sm:py-20">
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm text-indigo-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI搭載の医療採用プラットフォーム
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              あなたに合った{" "}
              <span className="text-gradient">医療の仕事</span>
              を見つける
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              {activeJobs.length}件の求人から、あなたの経験とスキルにマッチする職場を見つけてください
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 glass rounded-2xl p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white"
              >
                <option value="">すべての職種</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
              <Select
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className="bg-white"
              >
                <option value="">すべてのクリニック</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </Select>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white"
              >
                <option value="">すべての雇用形態</option>
                <option value="full-time">常勤</option>
                <option value="part-time">非常勤</option>
                <option value="contract">契約</option>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length}件の求人が見つかりました
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchQuery}-${selectedCategory}-${selectedClinic}-${selectedType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20">
                  <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">
                    条件に合う求人が見つかりませんでした
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    検索条件を変更してお試しください
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedClinic("");
                      setSelectedType("");
                    }}
                  >
                    フィルターをクリア
                  </Button>
                </div>
              ) : (
                filteredJobs.map((job, i) => {
                  const clinic = clinics.find((c) => c.id === job.clinicId)!;
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link href={`/jobs/${job.id}`}>
                        <Card className="group hover:shadow-lg hover:border-accent/30 transition-all duration-300 border-0 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                                style={{
                                  backgroundColor: clinic.brand.brandColorLight,
                                }}
                              >
                                <ClinicLogo clinicId={clinic.id} size={28} color={clinic.brand.brandColor} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                    {job.title}
                                  </h3>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary" className="rounded-lg">
                                      {job.category}
                                    </Badge>
                                    <Badge variant="accent" className="rounded-lg">
                                      {job.type === "full-time"
                                        ? "常勤"
                                        : job.type === "part-time"
                                          ? "非常勤"
                                          : "契約"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {clinic.name}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                  {job.description}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {job.location}
                                  </span>
                                  <span className="flex items-center gap-1 font-medium">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {(job.salaryMin / 10000).toFixed(0)}万〜
                                    {(job.salaryMax / 10000).toFixed(0)}万円
                                  </span>
                                </div>
                              </div>
                              <div className="hidden sm:block shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all"
                                >
                                  詳細を見る
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
