"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NexosLogo } from "@/components/icons/clinic-logos";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NECO_FOR_MEDICAL_URL } from "@/lib/neco-links";

const navLinks = [
  { href: NECO_FOR_MEDICAL_URL, label: "求人を探す", external: true },
  { href: "/dashboard/ai-agent", label: "AI Agent", external: false },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-sm shadow-slate-200/50"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <NexosLogo size={36} />
          <span className="text-xl font-bold tracking-tight">NEXOS</span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-cyan-600"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            )
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              ログイン
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="accent" size="sm" className="shadow-sm shadow-cyan-500/15">
              管理画面
            </Button>
          </Link>
        </nav>

        {/* モバイルメニュー */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t glass px-4 py-4 space-y-3"
        >
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium py-2 text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-sm font-medium py-2",
                  pathname.startsWith(link.href)
                    ? "text-cyan-600"
                    : "text-primary"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link href="/login" className="block" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">ログイン</Button>
          </Link>
          <Link href="/dashboard" className="block" onClick={() => setMobileOpen(false)}>
            <Button variant="accent" size="sm" className="w-full">管理画面</Button>
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
