"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogIn, ArrowLeft, Shield, Building2, Sparkles, Bot } from "lucide-react";
import { NexosLogo } from "@/components/icons/clinic-logos";
import { adminUsers } from "@/data/seed";
import type { AdminUser } from "@/data/types";
import { ROLE_LABELS } from "@/data/types";

const DEMO_PASSWORD = "nexos2026";
const hasDatabase = !!process.env.NEXT_PUBLIC_HAS_DATABASE;

const quickLoginUsers = [
  { user: adminUsers[0], description: "全クリニック横断管理", icon: Shield },
  { user: adminUsers[1], description: "共同編集・運用サポート", icon: Sparkles },
  { user: adminUsers[2], description: "メディカルフロンティア渋谷", icon: Building2 },
  { user: adminUsers[4], description: "さくら在宅クリニック", icon: Building2 },
  { user: adminUsers[5], description: "ニューロサイエンス東京", icon: Building2 },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"demo" | "login">("demo");

  function handleDemoLogin(user: AdminUser) {
    setLoadingUser(user.id);
    setError("");
    sessionStorage.setItem("nexos_demo_user", JSON.stringify(user));
    setTimeout(() => {
      router.push(callbackUrl);
    }, 600);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (hasDatabase) {
      try {
        const { signIn } = await import("next-auth/react");
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError("メールアドレスまたはパスワードが正しくありません");
          setIsLoading(false);
          return;
        }
        router.push(callbackUrl);
      } catch {
        setError("ログインに失敗しました。もう一度お試しください。");
        setIsLoading(false);
      }
      return;
    }

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
      router.push(callbackUrl);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* ヘッダー */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <NexosLogo size={40} />
              <span className="text-xl font-bold text-white font-serif">NEXOS</span>
            </Link>
            <h1 className="text-3xl font-serif font-light text-white tracking-tight">
              管理画面に<span className="font-bold">ログイン</span>
            </h1>
            <p className="mt-2 text-gray-400 text-sm">
              医療機関の採用OSへアクセス
            </p>
          </div>

          {/* モード切替タブ */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("demo")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "demo"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4 inline mr-1.5" />
              デモログイン
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4 inline mr-1.5" />
              メール/パスワード
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {mode === "demo" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <p className="text-sm text-gray-400 mb-4">
                アカウントを選択してすぐにダッシュボードを体験できます
              </p>
              {quickLoginUsers.map(({ user, description, icon: Icon }) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => handleDemoLogin(user)}
                  disabled={loadingUser !== null}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-4 flex items-center gap-4 text-left hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-50 group"
                >
                  <div className="p-2 rounded-md bg-accent/20 shrink-0">
                    <Icon className="h-4 w-4 text-accent-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{user.email}</p>
                  </div>
                  {loadingUser === user.id ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin shrink-0" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-white rotate-180 transition-colors shrink-0" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-300">
                      メールアドレス
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-accent/50"
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
                      placeholder="********"
                      required
                      autoComplete="current-password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-accent/50"
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

                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center mb-2">
                    デモ用パスワード: <span className="font-mono text-gray-400">nexos2026</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1.5"
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
