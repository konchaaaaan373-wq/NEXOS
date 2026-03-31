# NEXOS — 医療機関のための採用ブランドOS

<p align="center">
  <strong>表は各院ブランド、裏はNEXOS共通基盤</strong>
</p>

NEXOSは、各クリニックが自院ブランドで採用できる状態を実装する、医療機関向け採用プラットフォームです。単なる求人サイトではなく、各医療機関の採用主権を支える共通インフラを目指しています。

---

## クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアクセスできます。

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

### API

| ルート | メソッド | 説明 |
|--------|---------|------|
| `/api/applications` | POST | 応募データの受け付け |

---

## 主要な導線

### 求職者フロー
1. トップページ → 求人一覧 → 求人詳細 → 応募フォーム → 応募完了
2. トップページ → クリニック採用ページ → 求人詳細 → 応募

### クリニック管理フロー
1. ダッシュボード → 候補者確認 → 候補者詳細 → ステータス更新
2. ダッシュボード → 求人管理 → 新規求人作成
3. ダッシュボード → 分析 → ファネル確認

---

## データモデル

```
Clinic
├── id, name, slug, description, mission
├── brandColor, coverImageGradient, logoEmoji
├── location, employeeCount, foundedYear
├── specialties[], benefits[], culture[]
│
├── JobPosting (1:N)
│   ├── id, title, type, category, location
│   ├── salaryMin, salaryMax, description
│   ├── requirements[], niceToHave[], benefits[]
│   ├── viewCount, applyStartCount, applyCompleteCount
│   │
│   └── Application (1:N)
│       ├── applicantName, email, phone
│       ├── currentPosition, yearsOfExperience, motivation
│       ├── stage (applied → screening → interview → offer → hired/rejected)
│       └── CandidateNote[] (1:N)
│
└── EventMetric (日次メトリクス)
    └── date, views, applyStarts, applyCompletes
```

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
- **Mock認証**: ダッシュボードはclinic-1（メディカルフロンティア渋谷）固定。認証フロー構築より導線体験を優先
- **クリニックブランド差分**: グラデーション、ブランドカラー、ロゴ絵文字で視覚的に差別化
- **選考パイプライン**: Kanbanではなくリスト＋バッジ方式。一覧性を優先
- **API Route**: 応募データの送信はNext.js API Routeで処理

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
