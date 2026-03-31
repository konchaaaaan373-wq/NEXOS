"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
            N
          </div>
          <span className="text-xl font-bold tracking-tight">NEXOS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            求人を探す
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            検索
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              クリニック管理画面
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t bg-white px-4 py-4 space-y-3"
        >
          <Link
            href="/jobs"
            className="block text-sm font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            求人を探す
          </Link>
          <Link
            href="/dashboard"
            className="block text-sm font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            クリニック管理画面
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
