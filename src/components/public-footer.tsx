import Link from "next/link";
import { NexosLogo } from "@/components/icons/clinic-logos";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <NexosLogo size={32} />
              <span className="text-lg font-bold tracking-tight">NEXOS</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              すべての医療機関に、専属の採用チームを。
              自院ブランドで採用ページ・求人・選考を運営できる、
              次世代の採用プラットフォーム。
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="mailto:contact@necofindjob.com"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                contact@necofindjob.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 text-slate-300">求職者の方へ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  求人を探す
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=医師"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  医師の求人
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=看護師"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  看護師の求人
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 text-slate-300">医療機関の方へ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  管理画面
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/ai-agent"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  AI Agent
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@necofindjob.com"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>

            <h4 className="text-sm font-semibold mb-4 mt-8 text-slate-300">その他</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 NEXOS by Neco. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Next-Generation Recruitment OS for Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
