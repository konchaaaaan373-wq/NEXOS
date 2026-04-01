"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          エラーが発生しました
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          ページの読み込み中に問題が発生しました。
          再試行いただくか、トップページからやり直してください。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="accent" size="lg" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            再試行する
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="h-4 w-4" />
              トップページへ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
