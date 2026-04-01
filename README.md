# NEXOS — 医療機関のための採用ブランドOS

<p align="center">
  <strong>表は各院ブランド、裏はNEXOS共通基盤</strong><br/>
  <a href="https://nexos.necofindjob.com">https://nexos.necofindjob.com</a>
</p>

NEXOSは、各クリニックが自院ブランドで採用できる状態を実装する、医療機関向け採用プラットフォームです。単なる求人サイトではなく、各医療機関の採用主権を支える共通インフラを目指しています。

**お問い合わせ**: [contact@necofindjob.com](mailto:contact@necofindjob.com)

---

## クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアクセスできます。

本番環境: https://nexos.necofindjob.com

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| UIコンポーネント | 独自コンポーネント (shadcn/ui互換) |
| アニメーション | Framer Motion |
| アイコン | Lucide React |
| バリデーション | Zod (拡張用に導入済み) |
| データストア | インメモリ Seed データ (MVP) |

---

## ルート構成

### 求職者向け（パブリック）

| ルート | 説明 |
|--------|------|
| `/` | トップページ / ランディングページ |
| `/jobs` | 共通求人一覧（検索・絞り込み付き） |
| `/jobs/[id]` | 求人詳細ページ |
| `/clinics/[slug]` | クリニックごとの採用ページ |
| `/apply/[jobId]` | 応募フォーム |
| `/apply/[jobId]/success` | 応募完了画面 |

### クリニック管理画面（ダッシュボード）

| ルート | 説明 |
|--------|------|
| `/dashboard` | ダッシュボード概要 |
| `/dashboard/jobs` | 求人管理一覧 |
| `/dashboard/jobs/new` | 新規求人作成 |
| `/dashboard/jobs/[id]/edit` | 求人編集 |
| `/dashboard/candidates` | 候補者管理 |
| `/dashboard/candidates/[id]` | 候補者詳細・ステージ更新・メモ |
| `/dashboard/analytics` | 分析ダッシュボード |
| `/dashboard/page-editor` | 採用ページ編集（共同編集対応） |

### 法務・インフラ

| ルート | 説明 |
|--------|------|
| `/privacy` | プライバシーポリシー |
| `/terms` | 利用規約 |
| `/sitemap.xml` | 動的サイトマップ |

### API

| ルート | メソッド | 説明 |
|--------|---------|------|
| `/api/applications` | POST | 応募データの受け付け（Zod検証、レート制限） |
| `/api/applications/stage` | PATCH | 選考ステージ更新 |
| `/api/applications/notes` | POST | 候補者メモ追加（投稿者ロール記録） |
| `/api/jobs` | POST | 求人作成 |

---

## 主要な導線

### 求職者フロー
1. トップページ → 求人一覧 → 求人詳細 → 応募フォーム → 応募完了
2. トップページ → クリニック採用ページ → 求人詳細 → 応募

### クリニック管理フロー
1. ダッシュボード → 候補者確認 → 候補者詳細 → ステータス更新
2. ダッシュボード → 求人管理 → 新規求人作成
3. ダッシュボード → 分析 → ファネル確認
4. ダッシュボード → 採用ページ編集 → セクション編集 → 保存

### Neco共同管理フロー
1. ユーザー切替（デモ用） → Necoオペレーターを選択
2. クリニック切替 → 任意のクリニックを選択
3. 求人・ページ・候補者を共同編集
4. メモ投稿時にNeco編集者としてロールが記録される

---

## データモデル

```
AdminUser
├── id, name, email, role (neco_admin | neco_editor | clinic_admin | clinic_editor)
├── clinicIds[] (アクセス可能なクリニック)
└── avatarEmoji

Clinic
├── id, name, slug, description, mission
├── brand: { logoEmoji, coverImageGradient, brandColor, brandColorLight, heroTagline }
├── location, employeeCount, foundedYear
├── specialties[], benefits[], culture[]
├── pageSections[]: { type, title, content, order, isVisible, lastEditedBy, lastEditedAt }
│
├── JobPosting (1:N)
│   ├── id, title, type, category, location
│   ├── salaryMin, salaryMax, description
│   ├── requirements[], niceToHave[], benefits[]
│   ├── viewCount, applyStartCount, applyCompleteCount
│   ├── lastEditedBy, lastEditedAt
│   │
│   └── Application (1:N)
│       ├── applicantName, email, phone
│       ├── currentPosition, yearsOfExperience, motivation
│       ├── stage (applied → screening → interview → offer → hired/rejected)
│       └── CandidateNote[] (1:N)
│           └── authorId, authorName, authorRole (Neco/クリニック識別)
│
└── EventMetric (日次メトリクス)
    └── date, views, applyStarts, applyCompletes
```

### 権限ロール

| ロール | 説明 | アクセス範囲 |
|--------|------|------------|
| `neco_admin` | Necoプラットフォーム管理者 | 全クリニック横断 |
| `neco_editor` | Neco共同編集者 | 割り当てられたクリニック |
| `clinic_admin` | クリニック管理者 | 自院のみ |
| `clinic_editor` | クリニック編集者 | 自院のみ（限定） |

---

## Seed データ

3つの性格の違うクリニックが入っています：

| クリニック | 特徴 | ブランドカラー |
|-----------|------|--------------|
| メディカルフロンティア渋谷 | 都市型総合クリニック（内科・皮膚科・美容） | Blue |
| さくら在宅クリニック | 訪問診療・在宅医療特化 | Rose |
| ニューロサイエンス東京 | 脳神経内科専門 | Purple |

それぞれ2-3件の求人と、リアリティのある候補者データが含まれています。

---

## 設計判断

### 採用したもの
- **インメモリデータストア**: MVP段階ではDB不要。起動即使用可能な状態を優先
- **Mock認証 + ユーザー切替**: デモ用に全ユーザーをサイドバーから切替可能。ロール別の表示差分を確認できる
- **共同管理構造**: Necoオペレーターとクリニック管理者の両方がダッシュボードを操作可能。メモ・編集履歴にロールが記録される
- **クリニックブランド差分**: `ClinicBrandConfig` でグラデーション、ブランドカラー、キャッチコピーを分離管理
- **ページセクション構造**: `ClinicPageSection` で採用ページの構成をデータ化。将来のページビルダー拡張に対応
- **選考パイプライン**: Kanbanではなくリスト＋バッジ方式。一覧性を優先
- **Zod検証 + レート制限**: 全APIにバリデーション。応募APIにレート制限

### 将来の拡張ポイント
- **認証**: NextAuth.js + Supabase Auth でマルチテナント認証
- **DB**: Prisma + PostgreSQL / Supabase へ移行
- **AI推薦**: 候補者と求人のマッチングスコア
- **求人改善AI**: 求人文面の改善提案
- **ATS強化**: 面接日程調整、メール送信、評価シート
- **マルチテナント**: テナント切り替え、権限管理
- **分析強化**: リアルタイムダッシュボード、コホート分析

---

## 未完了項目

- [ ] 認証・ログイン機能
- [ ] DB接続（Prisma / Supabase）
- [ ] 画像アップロード（クリニックロゴ、カバー画像）
- [ ] メール通知（応募完了時、ステータス更新時）
- [ ] 面接日程調整
- [ ] レスポンシブ最終調整
- [ ] E2Eテスト
- [ ] パフォーマンス最適化
- [ ] i18n対応

---

## ビルド

```bash
npm run build   # プロダクションビルド
npm run start   # プロダクションサーバー起動
```

---

## ライセンス

Private
