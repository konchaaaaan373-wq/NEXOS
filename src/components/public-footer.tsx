import Link from "next/link";
import { NexosLogo } from "@/components/icons/clinic-logos";
import { NECO_FOR_MEDICAL_URL } from "@/lib/neco-links";

export function PublicFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* 左カラム: ブランド情報（非対称レイアウト） */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <NexosLogo size={32} />
              <span className="text-lg font-bold tracking-tight font-serif">NEXOS</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              すべての医療機関に、専属の採用チームを。
              自院ブランドで採用ページ・求人・選考を運営できる、
              次世代の採用プラットフォーム。
            </p>
            <div className="mt-5">
              <a
                href="mailto:contact@necofindjob.com"
                className="text-sm text-accent-light hover:text-white transition-colors"
              >
                contact@necofindjob.com
              </a>
            </div>
          </div>

          {/* 中カラム */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium mb-5 text-gray-300">求職者の方へ</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={NECO_FOR_MEDICAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  求人を探す（Neco）
                </a>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  NEXOS掲載求人
                </Link>
              </li>
            </ul>
          </div>

          {/* 右カラム */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-medium mb-5 text-gray-300">医療機関の方へ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  管理画面
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/ai-agent"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  AI Agent
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@necofindjob.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>

            <h4 className="text-sm font-medium mb-4 mt-8 text-gray-300">その他</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 NEXOS by Neco. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Next-Generation Recruitment OS for Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
