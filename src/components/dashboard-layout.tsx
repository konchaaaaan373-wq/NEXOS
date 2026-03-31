"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Building2,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clinics } from "@/data/seed";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/jobs", label: "求人管理", icon: Briefcase },
  { href: "/dashboard/candidates", label: "候補者管理", icon: Users },
  { href: "/dashboard/analytics", label: "分析", icon: BarChart3 },
];

// MVP: use clinic-1 as default tenant
const currentClinic = clinics[0];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              N
            </div>
            <span className="font-bold text-lg">NEXOS</span>
          </Link>
        </div>

        {/* Clinic selector */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: currentClinic.brandColorLight }}
            >
              {currentClinic.logoEmoji}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {currentClinic.name}
              </p>
              <p className="text-xs text-muted-foreground">管理画面</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link
            href={`/clinics/${currentClinic.slug}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Building2 className="h-4 w-4" />
            採用ページを見る
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            公開サイトへ戻る
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                    N
                  </div>
                  <span className="font-bold text-lg">NEXOS</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 py-4 border-b">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: currentClinic.brandColorLight }}
                  >
                    {currentClinic.logoEmoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {currentClinic.name}
                    </p>
                    <p className="text-xs text-muted-foreground">管理画面</p>
                  </div>
                </div>
              </div>

              <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile header */}
        <header className="lg:hidden flex h-14 items-center gap-4 border-b bg-white px-4">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white font-bold text-xs">
              N
            </div>
            <span className="font-semibold">NEXOS</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
