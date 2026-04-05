"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/clinic-context";
import { ROLE_LABELS } from "@/data/types";
import { ClinicLogo, NexosLogo } from "@/components/icons/clinic-logos";
import { UserAvatar } from "@/components/icons/feature-icons";
import { NECO_BASE_URL, NECO_ADMIN_URL } from "@/lib/neco-links";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  FileEdit,
  ChevronLeft,
  Menu,
  X,
  ChevronDown,
  Check,
  Building2,
  ExternalLink,
  Shield,
  UserCircle,
  Bot,
  Sparkles,
  LogOut,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ClinicSwitcher() {
  const { currentClinic, accessibleClinics, setClinicById } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: currentClinic.brand.brandColorLight }}
        >
          <ClinicLogo clinicId={currentClinic.id} size={22} color={currentClinic.brand.brandColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{currentClinic.name}</p>
          <p className="text-xs text-muted-foreground">管理画面</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-1.5">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                クリニックを切り替え
              </p>
              {accessibleClinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => {
                    setClinicById(clinic.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    clinic.id === currentClinic.id
                      ? "bg-accent/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: clinic.brand.brandColorLight }}
                  >
                    <ClinicLogo clinicId={clinic.id} size={20} color={clinic.brand.brandColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {clinic.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {clinic.location}
                    </p>
                  </div>
                  {clinic.id === currentClinic.id && (
                    <Check className="h-4 w-4 text-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserSwitcher() {
  const { currentUser, setCurrentUser, allUsers } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
      >
        <UserAvatar name={currentUser.name} role={currentUser.role} size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABELS[currentUser.role]}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 bottom-full mb-1 bg-white border rounded-xl shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto"
          >
            <div className="p-1.5">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                ユーザーを切り替え（デモ用）
              </p>
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    user.id === currentUser.id
                      ? "bg-accent/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <UserAvatar name={user.name} role={user.role} size={24} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                  {user.id === currentUser.id && (
                    <Check className="h-4 w-4 text-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentClinic, isNeco, currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ナビゲーションをグループ分けして分かりやすく
  const navGroups = [
    {
      items: [
        { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      label: "採用管理",
      items: [
        { href: "/dashboard/jobs", label: "求人管理", icon: Briefcase },
        { href: "/dashboard/candidates", label: "候補者管理", icon: Users },
      ],
    },
    {
      label: "運営",
      items: [
        { href: "/dashboard/facilities", label: "拠点・人員配置", icon: Building2 },
        { href: "/dashboard/operations", label: "オペレーション", icon: AlertTriangle },
        { href: "/dashboard/analytics", label: "分析", icon: BarChart3 },
      ],
    },
    {
      label: "ツール",
      items: [
        { href: "/dashboard/ai-agent", label: "AI補助", icon: Bot },
        { href: "/dashboard/page-editor", label: "採用ページ", icon: FileEdit },
      ],
    },
    ...(isNeco ? [{
      label: "管理",
      items: [
        { href: "/dashboard/admin", label: "Neco管理", icon: Shield },
      ],
    }] : []),
  ];

  const sidebarContent = (
    <>
      {/* Neco mode banner */}
      {isNeco && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {currentUser.role === "neco_admin" ? "Neco 管理モード" : "Neco 共同編集モード"}
            </span>
          </div>
        </div>
      )}

      {/* Clinic selector */}
      <div className="px-4 py-4 border-b">
        <ClinicSwitcher />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = ("exact" in item && item.exact)
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
                        : "text-muted-foreground hover:bg-gray-100 hover:text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t">
        {/* User switcher */}
        <div className="px-3 py-3 border-b">
          <UserSwitcher />
        </div>

        <div className="p-4 space-y-1">
          <Link
            href={`/clinics/${currentClinic.slug}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
          >
            <ExternalLink className="h-4 w-4" />
            採用ページを見る
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
          >
            <ChevronLeft className="h-4 w-4" />
            公開サイトへ戻る
          </Link>
          {isNeco && (
            <a
              href={NECO_ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
            >
              <ExternalLink className="h-4 w-4" />
              Neco管理サイト
            </a>
          )}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <NexosLogo size={32} />
            <span className="font-bold text-lg">NEXOS</span>
          </Link>
        </div>
        {sidebarContent}
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
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r lg:hidden flex flex-col"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                    N
                  </div>
                  <span className="font-bold text-lg">NEXOS</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="メニューを閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile header */}
        <header className="lg:hidden flex h-14 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="メニューを開く"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <NexosLogo size={28} />
              <span className="font-semibold">NEXOS</span>
            </div>
          </div>
          {isNeco && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200">
              <Shield className="h-3 w-3 text-amber-700" />
              <span className="text-xs font-medium text-amber-700">Neco</span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
