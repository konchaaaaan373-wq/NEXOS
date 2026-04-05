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
// DB接続があればNextAuthを使う
const hasDatabase = !!process.env.NEXT_PUBLIC_HAS_DATABASE;

const quickLoginUsers = [
  { user: adminUsers[0], description: "全クリニック横断管理", icon: Shield, gradient: "from-amber-500 to-orange-500" },
  { user: adminUsers[1], description: "共同編集・運用サポート", icon: Sparkles, gradient: "from-violet-500 to-purple-500" },
  { user: adminUsers[2], description: "メディカルフロンティア渋谷", icon: Building2, gradient: "from-blue-500 to-cyan-500" },
  { user: adminUsers[4], description: "さくら在宅クリニック", icon: Building2, gradient: "from-pink-500 to-rose-500" },
  { user: adminUsers[5], description: "ニューロサイエンス東京", icon: Building2, gradient: "from-indigo-500 to-violet-500" },
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
    // デモ認証：sessionStorageにユーザーを保存
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
      // 本番モード：NextAuth signInを使用
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

    // デモモード：シードデータで検証
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
      <div className="absolute inset-0 gradient-mesh-dark" />
      <div className="absolute top-20 right-[20%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-[50%] left-[60%] w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <NexosLogo size={44} />
              <span className="text-2xl font-bold text-white">NEXOS</span>
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              管理画面にログイン
            </h1>
            <p className="mt-2 text-slate-400">
              医療機関のAI搭載採用OSへアクセス
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("demo")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                mode === "demo"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4 inline mr-1.5" />
              デモログイン
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4 inline mr-1.5" />
              メール/パスワード
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {mode === "demo" ? (
            /* Demo Quick Login */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-400 mb-4">
                アカウントを選択してすぐにダッシュボードを体験できます
              </p>
              {quickLoginUsers.map(({ user, description, icon: Icon, gradient }) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleDemoLogin(user)}
                  disabled={loadingUser !== null}
                  className="w-full glass-dark rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50 group"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${gradient} shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</p>
                  </div>
                  {loadingUser === user.id ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin shrink-0" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-white rotate-180 transition-colors shrink-0" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* Email/Password Login */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 glass-dark">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-300">
                        メールアドレス
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        autoComplete="email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-slate-300">
                        パスワード
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
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
                    <p className="text-xs text-slate-500 text-center mb-2">
                      デモ用パスワード: <span className="font-mono text-slate-400">nexos2026</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-white transition-colors inline-flex items-center gap-1.5"
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
