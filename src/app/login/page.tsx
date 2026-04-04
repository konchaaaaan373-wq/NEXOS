"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogIn, ArrowLeft, Shield, Building2, Users, ChevronRight } from "lucide-react";
import { NexosLogo } from "@/components/icons/clinic-logos";
import { adminUsers } from "@/data/seed";
import type { AdminUser } from "@/data/types";
import { ROLE_LABELS } from "@/data/types";

const DEMO_PASSWORD = "nexos2026";

// All demo accounts grouped by role type
const demoAccounts = [
  {
    group: "Neco（プラットフォーム運営）",
    accounts: [
      { user: adminUsers[0], description: "全クリニック横断管理・最高権限", icon: Shield, iconBg: "bg-amber-100 text-amber-700" },
      { user: adminUsers[1], description: "共同編集・運用サポート担当", icon: Users, iconBg: "bg-violet-100 text-violet-700" },
    ],
  },
  {
    group: "クリニック管理者",
    accounts: [
      { user: adminUsers[2], description: "メディカルフロンティア渋谷", icon: Building2, iconBg: "bg-blue-100 text-blue-700" },
      { user: adminUsers[4], description: "さくら在宅クリニック", icon: Building2, iconBg: "bg-rose-100 text-rose-700" },
      { user: adminUsers[5], description: "ニューロサイエンス東京", icon: Building2, iconBg: "bg-indigo-100 text-indigo-700" },
    ],
  },
  {
    group: "クリニック編集者",
    accounts: [
      { user: adminUsers[3], description: "メディカルフロンティア渋谷 院長", icon: Building2, iconBg: "bg-slate-100 text-slate-600" },
    ],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"demo" | "login">("demo");

  function handleDemoLogin(user: AdminUser) {
    setLoadingUser(user.id);
    setError("");
    sessionStorage.setItem("nexos_demo_user", JSON.stringify(user));
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Try NextAuth first (when DB is connected), fallback to demo
    try {
      // Attempt NextAuth login
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
    } catch {
      // NextAuth not available or failed — try demo mode
    }

    // Demo mode fallback
    const user = adminUsers.find((u) => u.email === email);
    if (!user) {
      setError("メールアドレスが見つかりません");
      setIsLoading(false);
      return;
    }
    if (password !== DEMO_PASSWORD) {
      setError("パスワードが正しくありません");
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("nexos_demo_user", JSON.stringify(user));
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute inset-0 gradient-mesh-dark" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <NexosLogo size={40} />
              <span className="text-xl font-bold text-white">NEXOS</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">ログイン</h1>
            <p className="mt-2 text-sm text-gray-400">
              Healthcare Workforce Operations OS
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-gray-800/50">
            <button
              onClick={() => setMode("demo")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                mode === "demo"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              デモアカウント
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              メール/パスワード
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {mode === "demo" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <p className="text-xs text-gray-500">
                アカウントを選択してダッシュボードを体験できます。パスワード: <code className="text-gray-400">nexos2026</code>
              </p>

              {demoAccounts.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-medium text-gray-500 mb-2 px-1">
                    {group.group}
                  </p>
                  <div className="space-y-1.5">
                    {group.accounts.map(({ user, description, icon: Icon, iconBg }) => (
                      <button
                        key={user.id}
                        onClick={() => handleDemoLogin(user)}
                        disabled={loadingUser !== null}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-800 hover:bg-gray-800/70 hover:border-gray-700 transition-all cursor-pointer disabled:opacity-50 group text-left"
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <Badge className="bg-gray-700 text-gray-400 border-0 text-[10px] shrink-0">
                              {ROLE_LABELS[user.role]}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{description}</p>
                        </div>
                        {loadingUser === user.id ? (
                          <Loader2 className="h-4 w-4 text-gray-400 animate-spin shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="rounded-2xl bg-gray-800/40 border border-gray-800 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-300">
                      メールアドレス
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@necofindjob.com"
                      required
                      autoComplete="email"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-gray-300">
                      パスワード
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="nexos2026"
                      required
                      autoComplete="current-password"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-600"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        ログイン中...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        ログイン
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    DB未接続時はデモモードで動作します
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    デモパスワード: <code className="text-gray-400">nexos2026</code>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              トップページへ戻る
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
