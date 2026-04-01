import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                N
              </div>
              <span className="text-lg font-bold">NEXOS</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              各医療機関が自院ブランドで採用できる状態を実装する、
              医療機関向け採用プラットフォーム。
              分散した医療機関の採用主権を支える共通インフラを目指しています。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">求職者の方へ</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  求人を探す
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  職種から探す
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  エリアから探す
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">医療機関の方へ</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  管理画面
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@necofindjob.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 NEXOS by neco. All rights reserved. 医療機関の採用主権を支える共通インフラ。
          </p>
        </div>
      </div>
    </footer>
  );
}
