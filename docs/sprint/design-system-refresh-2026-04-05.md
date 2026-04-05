# スプリント計画: デザインシステム刷新 (Editorial Medical)

## 概要
既存のAIスロップデザイン（Inter/シアン/グラデ/glass/glow）を排除し、
DESIGN.mdに定義したEditorial Medicalデザインシステムに全面刷新する。

## タスク一覧

### タスク1: globals.css デザイントークン刷新
- 説明: カラーパレット、フォント、角丸、ユーティリティクラスをDESIGN.md準拠に変更
- 受け入れ基準: AI-slop系ユーティリティ全削除、新カラートークン反映
- 優先度: 高（全てのタスクの基盤）

### タスク2: layout.tsx フォント変更
- 説明: Inter → Cormorant Garamond + Noto Sans JP
- 受け入れ基準: Google Fontsのリンク更新、CSS変数に反映
- 優先度: 高

### タスク3: UIコンポーネント刷新
- 説明: button, card, badge, input, select, textarea を新デザインに
- 受け入れ基準: rounded-xl→rounded-md/lg、シアン→deep-teal、glass削除
- 優先度: 高

### タスク4: ヘッダー・フッター改修
- 説明: glass効果削除、シアン→deep-teal、Editorial Medicalトーン
- 受け入れ基準: glass/glow/シアン完全排除
- 優先度: 高

### タスク5: ランディングページ改修
- 説明: gradient-mesh/glow/pulse/glass/text-gradient全削除、Editorial風レイアウト
- 受け入れ基準: Anti-AI-Slopチェック全項目合格
- 優先度: 高

### タスク6: 求人一覧ページ改修
- 説明: glass/gradient-mesh削除、新デザイントークン適用
- 受け入れ基準: Anti-AI-Slopチェック全項目合格
- 優先度: 中

### タスク7: ログインページ改修
- 説明: float/glow/glass/gradient全削除、クリーンなログインフォーム
- 受け入れ基準: Anti-AI-Slopチェック全項目合格
- 優先度: 中

### タスク8: ダッシュボードレイアウト改修
- 説明: rounded-xl/2xl/glass削除
- 受け入れ基準: Anti-AI-Slopチェック全項目合格
- 優先度: 中

### タスク9: ビルド検証 + デザインレビュー
- 説明: npm run build + 全ページの目視確認
- 受け入れ基準: ビルドエラーゼロ、Anti-AI-Slop全項目合格
- 優先度: 高

## 技術的な制約
- Tailwind CSS v4 + PostCSS環境
- Framer Motionは維持（ただし装飾アニメは削除）
- Lucide Reactアイコンは維持

## 完了の定義
- [ ] 全タスクの受け入れ基準を満たしている
- [ ] npm run build が成功する
- [ ] Anti-AI-Slopチェックリスト全項目合格
- [ ] デザイントークンがDESIGN.md準拠
