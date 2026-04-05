import { Metadata } from "next";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight font-serif">利用規約</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          最終更新日: 2026年4月1日
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">第1条（適用）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本規約は、NEXOS（以下「本サービス」）の利用に関する条件を定めるものです。本サービスを利用するすべてのユーザーに適用されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">第2条（サービスの内容）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本サービスは、医療機関の求人情報の掲載、求職者による求人検索・応募、および医療機関による採用管理機能を提供するプラットフォームです。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">第3条（利用者の責任）</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>正確な情報を登録・入力すること</li>
              <li>他者の権利を侵害しないこと</li>
              <li>本サービスの運営を妨害しないこと</li>
              <li>法令および本規約を遵守すること</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">第4条（免責事項）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当社は、本サービスを通じて行われる採用活動の結果について、一切の責任を負いません。求人内容の正確性は各掲載医療機関が責任を負うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">第5条（お問い合わせ）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本規約に関するお問い合わせは、以下までご連絡ください。
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
