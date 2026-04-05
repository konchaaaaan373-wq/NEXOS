# DESIGN.md - NEXOS Design System

## Design Philosophy: "Editorial Medical"

NEXOSは医療機関向けの採用OSである。
デザインの方向性は「医療×雑誌的洗練」。信頼感・専門性・洗練の3つを軸とする。
中途半端な「きれいなデザイン」ではなく、Editorial/Magazine方向に振り切る。

---

## Anti-AI-Slop Rules (最重要)

以下のパターンは**絶対に使用しない**。これらは「AIが生成した感」を生む典型的な要素である。

### 禁止フォント
- Inter
- Roboto
- Arial
- システムフォントのみの指定

### 禁止カラーパターン
- 紫グラデーション + 白背景
- シアン/ティールのグロー効果
- 虹色・多色グラデーション
- 彩度の高すぎるネオンカラー

### 禁止レイアウトパターン
- 均等3列カードグリッド（情報量に関係なく3列に並べるパターン）
- 意味のない汎用アイコンの添え物
- 過度な角丸（16px以上の丸み）
- 無意味に広い余白（高級感の偽装）
- 「Get Started」「Learn More」等の定型CTAボタン
- フローティングアニメーション（ふわふわ浮遊）
- グラスモーフィズム（すりガラス効果）
- グラデーションメッシュ背景
- グロー・パルス・光彩アニメーション

---

## Typography

### フォント構成
```
見出し: "Cormorant Garamond", "Noto Serif JP", Georgia, serif
本文:   "Noto Sans JP", "Helvetica Neue", sans-serif
コード: "JetBrains Mono", "Fira Code", monospace
```

### ウェイトの使い方
- **見出し**: 300 (Light) または 700 (Bold) — 極端な組み合わせで個性を出す
- **本文**: 400 (Regular) のみ — 読みやすさ最優先
- **ラベル・キャプション**: 500 (Medium) — 本文との差別化
- **強調**: 700 (Bold) — 使いすぎない

### フォントサイズスケール
```
xs:   0.75rem (12px) — キャプション、注釈
sm:   0.875rem (14px) — ラベル、補助テキスト
base: 1rem (16px) — 本文
lg:   1.125rem (18px) — リード文
xl:   1.25rem (20px) — セクション見出し
2xl:  1.5rem (24px) — ページ見出し
3xl:  1.875rem (30px) — ヒーロー副題
4xl:  2.25rem (36px) — ヒーロー主題
5xl:  3rem (48px) — インパクト見出し（Landing用）
```

### 行間・字間
- 本文 line-height: 1.8（日本語に最適化）
- 見出し line-height: 1.3
- 見出しの letter-spacing: -0.02em（タイトに）
- 本文の letter-spacing: 0.02em（日本語に余裕を）

---

## Color Palette

### Primary Colors
```
ink:         #1a1f36  — メインテキスト、見出し
paper:       #faf9f7  — 背景（純白ではなくウォームオフホワイト）
paper-alt:   #f3f1ed  — セクション交互背景
```

### Accent Colors
```
deep-teal:   #0d7377  — プライマリアクション、リンク
teal-light:  #e6f4f4  — アクセント背景、ホバー状態
gold:        #b8860b  — 強調、バッジ、重要マーク
gold-light:  #fdf6e3  — ゴールド背景
```

### Functional Colors
```
success:     #2d6a4f  — 完了、合格（森のグリーン）
success-bg:  #f0f7f4
warning:     #b45309  — 注意、期限（琥珀）
warning-bg:  #fef9ee
error:       #9b2c2c  — エラー、削除（深い赤）
error-bg:    #fef2f2
info:        #1e5f8a  — 情報、ヒント（紺青）
info-bg:     #f0f7fc
```

### Neutral Scale
```
gray-50:     #fafaf9
gray-100:    #f5f5f4
gray-200:    #e7e5e4
gray-300:    #d6d3d1
gray-400:    #a8a29e
gray-500:    #78716c
gray-600:    #57534e
gray-700:    #44403c
gray-800:    #292524
gray-900:    #1c1917
```

### 配色ルール
- **支配色**: ink(#1a1f36) + paper(#faf9f7) で全体の90%を構成する
- **アクセント**: deep-teal を控えめに使う（CTAボタン、リンク、アイコン）
- **ゴールド**: 本当に強調したい要素にだけ使う（バッジ、重要タグ、数字）
- 色を均等に配分しない。メリハリをつける

---

## Spacing & Layout

### スペーシングスケール
```
4px  — 要素内の微小間隔
8px  — 関連要素間の間隔
12px — コンパクトなパディング
16px — 標準パディング
24px — セクション内の間隔
32px — セクション間の間隔
48px — 大セクション間
64px — ページセクション間
96px — ヒーローセクション
```

### レイアウト原則
- **非対称を恐れない**: 2:1、3:1のグリッド比率を活用する
- **左寄せ基本**: テキストは左寄せ。中央揃えはヒーローのみ
- **コンテンツ幅**: max-w-6xl (1152px)。フルワイドは背景色のみ
- **カード**: 2列または1列。3列均等は使わない
- **余白に意味を持たせる**: 関連性の高い要素は近く、低い要素は遠く

---

## Border & Shape

### 角丸
```
none: 0px    — テーブル、区切り線
sm:   4px    — バッジ、小さなタグ
md:   6px    — ボタン、入力フィールド
lg:   8px    — カード、モーダル
```
- 16px以上の角丸は使用しない
- rounded-full はアバターのみ

### ボーダー
```
border-default: 1px solid #e7e5e4 (gray-200)
border-strong:  1px solid #d6d3d1 (gray-300)
border-accent:  2px solid #0d7377 (deep-teal) — フォーカス、選択状態
```

---

## Motion & Animation

### 原則
- アニメーションは「状態変化の説明」のためだけに使う
- 装飾的なアニメーション（浮遊、グロー、パルス）は使わない
- ユーザーのアクションに応じたフィードバックのみ

### 許可するアニメーション
```
hover:     transform scale(1.02), 200ms ease
focus:     box-shadow ring, 150ms ease
enter:     opacity 0→1 + translateY(8px→0), 300ms ease-out
exit:      opacity 1→0, 200ms ease-in
page:      staggered fade-in（要素が順番に表示）, 各100ms遅延
```

### 禁止するアニメーション
- 無限ループアニメーション（float, pulse, glow）
- 3D変換、回転
- bounce、elastic系イージング
- スクロールに連動した視差効果（parallax）

---

## Components

### Button
- 角丸: 6px (rounded-md)
- パディング: px-5 py-2.5
- フォント: 500 weight, 14px
- Primary: bg-deep-teal, text-white, hover時にdarken
- Secondary: bg-transparent, border-gray-300, text-ink
- Ghost: bg-transparent, text-deep-teal, hover時にteal-light背景
- CTAテキスト: 具体的な動詞を使う（「求人を公開する」「応募する」等）

### Card
- 背景: white
- ボーダー: 1px solid gray-200
- 角丸: 8px (rounded-lg)
- シャドウ: shadow-sm（hover時のみshadow-md）
- パディング: p-6
- ホバー: shadow-md + border-gray-300（translateYは使わない）

### Badge
- 角丸: 4px (rounded-sm)
- パディング: px-2 py-0.5
- フォント: 12px, 500 weight
- 背景: 各色のlight版を使用

### Input
- ボーダー: 1px solid gray-300
- 角丸: 6px (rounded-md)
- パディング: px-3 py-2.5
- フォーカス: 2px solid deep-teal + ring-2 ring-teal-light
- ラベル: 上に配置、14px, 500 weight

### Table
- ヘッダー: bg-gray-50, font-500, text-gray-600
- 行: hover時にbg-gray-50
- ボーダー: 行間にborder-bottom gray-200
- 角丸: テーブル全体にはつけない

---

## Iconography

- ライブラリ: Lucide React（現在使用中、継続）
- サイズ: 16px（インライン）、20px（ボタン内）、24px（ナビ）
- アイコンは必ずテキストと併用する（アイコンだけで意味を伝えない）
- 装飾目的のアイコンは使わない
- ストローク幅: 1.5px（デフォルト）

---

## Page-Specific Guidelines

### Landing Page (/)
- ヒーロー: ダーク背景(ink) + 大きなセリフ体見出し + 控えめなサブテキスト
- 特徴セクション: paper-alt背景 + 2列非対称レイアウト（テキスト:ビジュアル = 3:2）
- 数字の強調: 大きなセリフ体 + gold色
- CTAは1つに絞る（迷わせない）

### Job Listings (/jobs)
- フィルターは上部に横並び（サイドバー不要）
- カードは1列または2列。求人情報の密度を優先
- 給与・勤務地・雇用形態はバッジで表示

### Dashboard
- サイドバー: ink背景 + white テキスト（現行を踏襲しつつ角丸を抑える）
- メトリクスカード: 数字を大きく表示。装飾不要
- テーブル中心のレイアウト。カード化しすぎない

### Clinic Branded Pages (/clinics/[slug])
- 各クリニックのブランドカラーをアクセントとして使用
- ただしベースのTypographyとLayout原則は維持
- ブランドカラーはCTAボタンとアクセント要素のみに適用

---

## Responsive Design

### ブレイクポイント
```
sm:  640px   — モバイル横向き
md:  768px   — タブレット
lg:  1024px  — デスクトップ
xl:  1280px  — ワイドデスクトップ
```

### モバイル対応原則
- モバイルファースト
- カードは1列スタック
- ナビはハンバーガーメニュー
- テーブルは横スクロールまたはカード化
- タッチターゲット: 最低44px

---

## Figma MCP Integration

Figma MCPが利用可能な場合:
1. デザイントークン（色、フォント、スペーシング）はFigmaから読み取る
2. コンポーネントの構造はFigmaのAuto Layoutを参照する
3. 実装後のUIはFigmaのデザインと照合する
4. 差異がある場合はDesigner agentが指摘する

---

## Clinic Brand Configuration

各クリニックのブランドは以下の範囲でカスタマイズ可能:
- アクセントカラー（1色のみ）
- ロゴ画像
- カバー画像
- キャッチコピー

以下はカスタマイズ不可（統一する）:
- フォント
- レイアウト構造
- ボーダー・角丸
- アニメーション
