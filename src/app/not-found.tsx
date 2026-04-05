import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NECO_FOR_MEDICAL_URL } from "@/lib/neco-links";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
          <FileQuestion className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          ページが見つかりません
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          お探しのページは存在しないか、移動した可能性があります。
          URLをご確認いただくか、以下のリンクからお進みください。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="accent" size="lg">
              <Home className="h-4 w-4" />
              トップページへ
            </Button>
          </Link>
          <a href={NECO_FOR_MEDICAL_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              <Search className="h-4 w-4" />
              求人を探す
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
