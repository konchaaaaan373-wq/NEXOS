# NEXOS データベース保守要件定義

## 1. データベース構成
- PostgreSQL (Neon Serverless)
- Prisma ORM v6
- Connection: pooled (DATABASE_URL) + direct (DIRECT_DATABASE_URL)

## 2. バックアップ戦略
### 自動バックアップ
- Neon自動バックアップ: 7日間の Point-in-Time Recovery
- 日次論理バックアップ: pg_dump による毎日のフルバックアップ
- バックアップ保持期間: 30日
- バックアップ先: S3互換ストレージ

### バックアップ運用
- 毎日 03:00 JST に自動実行
- バックアップ完了/失敗時にSlack通知
- 月次でリストアテスト実施

## 3. マイグレーション戦略
### 開発フロー
1. `prisma migrate dev` でローカル開発
2. PR レビューでマイグレーションSQL確認
3. ステージング環境で `prisma migrate deploy` テスト
4. 本番環境で `prisma migrate deploy` 適用

### マイグレーションルール
- 破壊的変更（カラム削除、型変更）は2段階デプロイ
- 大テーブルのALTERはメンテナンスウィンドウ（日曜 02:00-04:00 JST）
- ロールバック用の逆マイグレーションを常に準備
- マイグレーション前にバックアップ取得必須

## 4. モニタリング
### メトリクス
- 接続プール使用率（閾値: 80%）
- クエリ実行時間（閾値: 500ms）
- デッドロック発生数
- テーブルサイズ推移
- インデックス使用率

### アラート
- 接続プール枯渇: Critical
- スロークエリ（1s超）: Warning
- ディスク使用量80%超: Warning
- マイグレーション失敗: Critical
- レプリケーション遅延: Warning

## 5. パフォーマンス最適化
### インデックス戦略
```sql
-- 主要クエリ用インデックス
CREATE INDEX idx_job_postings_clinic_active ON "JobPosting" ("clinicId", "isActive");
CREATE INDEX idx_job_postings_category ON "JobPosting" ("category");
CREATE INDEX idx_applications_clinic_stage ON "Application" ("clinicId", "stage");
CREATE INDEX idx_applications_job_stage ON "Application" ("jobId", "stage");
CREATE INDEX idx_event_metrics_clinic_date ON "EventMetric" ("clinicId", "date");
CREATE INDEX idx_candidate_notes_application ON "CandidateNote" ("applicationId");
CREATE INDEX idx_clinic_members_user ON "ClinicMember" ("userId");
```

### クエリ最適化
- N+1問題の防止: Prisma include/select を活用
- ページネーション: cursor-based pagination 推奨
- キャッシュ: 頻繁アクセスデータはRedis/Upstash活用
- コネクションプーリング: Neon pooler経由で接続

## 6. データ整合性
### 制約
- 外部キー制約: CASCADE DELETE（Clinic削除時に関連データ一括削除）
- ユニーク制約: email, slug, [userId+clinicId], [clinicId+date]
- NOT NULL制約: 必須フィールドすべてに適用

### データクレンジング
- 月次: 6ヶ月以上前の EventMetric を集約・アーカイブ
- 月次: 未完了のアップロード（24時間以上）を削除
- 四半期: 非アクティブユーザー（90日以上ログインなし）の確認

## 7. セキュリティ
- 接続はSSL/TLS必須
- 最小権限の原則: アプリユーザーにはCRUD権限のみ
- パスワードハッシュ: bcrypt (cost factor 12)
- SQL Injection対策: Prisma パラメータバインディング
- 個人情報の暗号化: applicantEmail, applicantPhone は暗号化推奨
- 監査ログ: 管理操作（ステージ変更、ノート追加）はすべてログ記録

## 8. 障害復旧計画 (DRP)
### RTO/RPO
- RTO (Recovery Time Objective): 1時間
- RPO (Recovery Point Objective): 1時間（Neon PITR）

### 復旧手順
1. 障害検知（モニタリングアラート）
2. 影響範囲の確認
3. Neon PITR でリストア
4. データ整合性チェック
5. アプリケーション接続確認
6. サービス復旧宣言

## 9. スケーリング計画
### フェーズ1（〜50クリニック）
- Neon Free/Pro tier
- 単一リージョン（ap-northeast-1）

### フェーズ2（50〜200クリニック）
- Neon Scale tier
- リードレプリカ追加
- Redis キャッシュ導入

### フェーズ3（200クリニック〜）
- マルチリージョン対応
- テナント分離（スキーマベース or データベースベース）
- 専用コネクションプール

## 10. 運用チェックリスト
### 日次
- [ ] バックアップ成功確認
- [ ] アラート確認・対応
- [ ] スロークエリログ確認

### 週次
- [ ] テーブルサイズ確認
- [ ] インデックス使用率確認
- [ ] コネクション使用推移確認

### 月次
- [ ] バックアップリストアテスト
- [ ] データクレンジング実行
- [ ] パフォーマンスレビュー
- [ ] セキュリティパッチ確認

### 四半期
- [ ] DRPリハーサル
- [ ] 容量計画レビュー
- [ ] インデックス最適化レビュー
