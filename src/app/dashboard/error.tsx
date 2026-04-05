"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-md mx-auto text-center py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          ページの読み込みに失敗しました
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "予期しないエラーが発生しました。再試行してください。"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            エラーID: {error.digest}
          </p>
        )}
        <Button variant="accent" onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          再試行する
        </Button>
      </div>
    </div>
  );
}
