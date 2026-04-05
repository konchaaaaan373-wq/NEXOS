"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/clinic-context";
import { facilities, vacancyImpacts, jobPostings, applications } from "@/data/seed";
import { FACILITY_TYPES } from "@/data/types";
import type { ComplianceRule, StaffingRequirement } from "@/data/types";
import {
  Building2, Users, AlertTriangle, CheckCircle2, Shield, ArrowRight,
  TrendingDown, MapPin, Briefcase, ChevronRight,
} from "lucide-react";

// ============================================================
// Helpers
// ============================================================

function formatRevenue(yen: number): string {
  const man = yen / 10000;
  return man.toLocaleString() + "万円";
}

function getRiskBadge(riskLevel: ComplianceRule["riskLevel"]) {
  switch (riskLevel) {
    case "safe":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-0">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          安全
        </Badge>
      );
    case "at_risk":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-0">
          <AlertTriangle className="h-3 w-3 mr-1" />
          リスクあり
        </Badge>
      );
    case "critical":
      return (
        <Badge className="bg-red-100 text-red-700 border-0">
          <AlertTriangle className="h-3 w-3 mr-1" />
          危険
        </Badge>
      );
  }
}

function getTypeBadge(type: ComplianceRule["type"]) {
  switch (type) {
    case "facility_standard":
      return (
        <Badge variant="outline" className="text-xs text-slate-600">
          施設基準
        </Badge>
      );
    case "additional_fee":
      return (
        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
          加算
        </Badge>
      );
  }
}

// ============================================================
// Page Component
// ============================================================

export default function FacilitiesPage() {
  const { currentClinic, isNeco } = useAuth();

  // Filter facilities by clinic or show all for Neco
  const filteredFacilities = isNeco
    ? facilities
    : facilities.filter((f) => f.clinicId === currentClinic.id);

  const filteredImpacts = isNeco
    ? vacancyImpacts
    : vacancyImpacts.filter((vi) => {
        const fac = facilities.find((f) => f.id === vi.facilityId);
        return fac?.clinicId === currentClinic.id;
      });

  // Summary calculations
  const totalFacilities = filteredFacilities.length;

  const totalVacancies = filteredFacilities.reduce((sum, fac) => {
    return (
      sum +
      fac.staffingRequirements.reduce((s, sr) => {
        const shortage = sr.requiredCount - sr.currentCount;
        return s + (shortage > 0 ? shortage : 0);
      }, 0)
    );
  }, 0);

  const totalRevenueAtRisk = filteredImpacts.reduce(
    (sum, vi) => sum + vi.totalMonthlyImpact,
    0
  );

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* ====== Header ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 shrink-0">
          <Building2 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">拠点・人員配置管理</h1>
          <p className="text-muted-foreground mt-1">
            各拠点の人員配置状況、施設基準の充足状況、欠員による収益リスクを管理します
          </p>
        </div>
      </motion.div>

      {/* ====== Summary Cards ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">管理拠点数</p>
                <p className="text-2xl font-bold">{totalFacilities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">総欠員数</p>
                <p className="text-2xl font-bold text-red-600">{totalVacancies}名</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">月間収益リスク</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatRevenue(totalRevenueAtRisk)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Facility Cards ====== */}
      {filteredFacilities.map((facility, facIdx) => {
        const facImpacts = filteredImpacts.filter(
          (vi) => vi.facilityId === facility.id
        );

        return (
          <motion.div
            key={facility.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + facIdx * 0.05 }}
          >
            <Card className="border shadow-sm overflow-hidden">
              {/* --- Facility Header --- */}
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 shrink-0">
                      <Building2 className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{facility.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {FACILITY_TYPES[facility.type]}
                        </Badge>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {facility.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-0">
                {/* --- Staffing Requirements Table --- */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    人員配置状況
                  </h3>
                  <div className="rounded-lg border overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                      <div className="col-span-3">職種</div>
                      <div className="col-span-2 text-center">現員/必要数</div>
                      <div className="col-span-5">充足状況</div>
                      <div className="col-span-2 text-center">ステータス</div>
                    </div>
                    {facility.staffingRequirements.map((sr) => {
                      const shortage = sr.requiredCount - sr.currentCount;
                      const isShort = shortage > 0;
                      const fillPercent = Math.min(
                        (sr.currentCount / sr.requiredCount) * 100,
                        100
                      );

                      return (
                        <div
                          key={sr.id}
                          className="px-4 py-3 grid grid-cols-12 gap-2 items-center border-t text-sm"
                        >
                          <div className="col-span-3 flex items-center gap-1.5">
                            <span className="font-medium">{sr.qualificationName}</span>
                            {sr.isComplianceCritical && (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                基準必須
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            <span className={isShort ? "text-red-600 font-semibold" : "text-slate-700"}>
                              {sr.currentCount}
                            </span>
                            <span className="text-muted-foreground">/{sr.requiredCount}名</span>
                          </div>
                          <div className="col-span-5">
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isShort ? "bg-red-400" : "bg-emerald-400"
                                }`}
                                style={{ width: `${fillPercent}%` }}
                              />
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            {isShort ? (
                              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                {shortage}名不足
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                                充足
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --- Compliance Rules --- */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    施設基準・加算の充足状況
                  </h3>
                  <div className="space-y-2">
                    {facility.complianceRules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`rounded-lg border p-4 ${
                          rule.riskLevel === "critical"
                            ? "border-l-4 border-l-red-400 bg-red-50/40"
                            : rule.riskLevel === "at_risk"
                            ? "border-l-4 border-l-amber-400 bg-amber-50/40"
                            : "border-l-4 border-l-emerald-400 bg-emerald-50/40"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{rule.name}</span>
                              {getTypeBadge(rule.type)}
                              {getRiskBadge(rule.riskLevel)}
                            </div>
                            <p className="text-xs text-muted-foreground">{rule.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              必要体制: {rule.requiredStaffing}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">月額収益影響</p>
                            <p className={`text-sm font-bold ${
                              rule.riskLevel === "critical"
                                ? "text-red-600"
                                : rule.riskLevel === "at_risk"
                                ? "text-amber-600"
                                : "text-slate-600"
                            }`}>
                              {formatRevenue(rule.monthlyRevenueImpact)}/月
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- Vacancy Impacts --- */}
                {facImpacts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      欠員による影響と対応策
                    </h3>
                    <div className="space-y-2">
                      {facImpacts.map((impact, idx) => (
                        <div
                          key={`${impact.facilityId}-${impact.qualificationName}-${idx}`}
                          className="rounded-lg border bg-gray-50 p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-sm">
                                  {impact.qualificationName}
                                </span>
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  {impact.shortage}名不足
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {impact.affectedRules.map((ar, arIdx) => (
                                  <span
                                    key={arIdx}
                                    className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
                                      ar.riskLevel === "critical"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {ar.ruleName}: -{formatRevenue(ar.monthlyImpact)}/月
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {impact.recommendedAction}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-muted-foreground">月間影響額</p>
                              <p className="text-lg font-bold text-red-600">
                                {formatRevenue(impact.totalMonthlyImpact)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* ====== Empty State ====== */}
      {filteredFacilities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">管理対象の拠点がありません</p>
        </motion.div>
      )}
    </div>
  );
}
