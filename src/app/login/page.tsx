"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
              N
            </div>
            <span className="text-2xl font-bold">NEXOS</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">ログイン</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            管理画面にアクセスするにはログインしてください
          </p>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                  パスワード
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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

            {/* Demo mode hint */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center mb-3">
                デモ用アカウント
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span>Neco管理者</span>
                  <span className="font-mono">admin@necofindjob.com</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span>クリニック管理者</span>
                  <span className="font-mono">sato@medical-frontier.example.com</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                パスワード: <span className="font-mono">nexos2026</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            トップページへ戻る
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
