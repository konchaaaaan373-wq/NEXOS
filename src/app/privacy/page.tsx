import { Metadata } from "next";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          プライバシーポリシー
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          最終更新日: 2026年4月1日
        </p>

        <div className="mt-8 prose prose-slate prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. 個人情報の取得</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NEXOSは、求人への応募時にお名前、メールアドレス、電話番号、現在の職種、経験年数、志望動機等の個人情報を取得します。これらの情報は、応募先クリニックでの採用選考の目的でのみ使用されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. 個人情報の利用目的</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>採用選考プロセスの遂行</li>
              <li>応募者への選考結果の連絡</li>
              <li>採用に関する事務連絡</li>
              <li>サービスの改善・向上</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. 個人情報の第三者提供</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              応募者の個人情報は、応募先として選択されたクリニックにのみ提供されます。法令に基づく場合を除き、応募者の同意なく第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. 個人情報の管理</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当社は、個人情報の漏洩、滅失、き損の防止その他の安全管理のために必要な措置を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. お問い合わせ</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              メール:{" "}
              <a href="mailto:contact@necofindjob.com" className="text-accent hover:underline">
                contact@necofindjob.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
