# Deno + Hono + PostgreSQL Docker環境 + 外部API連携

このプロジェクトは、Deno、Hono、PostgreSQLを使用したAPIサーバーのDocker環境に、外部APIモックサーバーを追加したものです。日別のジャンル投稿数統計データを外部APIに送信する機能が含まれています。

## 必要なソフトウェア

- Docker
- Docker Compose
- Deno（モックサーバー単体実行用）

## 環境の起動

### 全てのサービス（推奨）
```bash
# 全てのサービスを起動（メインAPI + モックサーバー + PostgreSQL）
docker compose up -d

# ログの確認
docker compose logs -f

# 特定のサービスのログを確認
docker compose logs -f app          # メインAPIサーバー
docker compose logs -f mock-server  # モックサーバー
docker compose logs -f postgres     # PostgreSQL

# 環境の停止
docker compose down

# 環境の再構築
docker compose down -v
docker compose up --build
```

### 個別サービス起動（開発用）
```bash
# メインAPIサーバーのみ起動
docker compose up -d postgres app

# モックサーバーのみ起動
docker compose up -d mock-server

# または、Denoで直接起動
cd mock-server
deno run --allow-net --allow-env --allow-read main.ts
```

## API エンドポイント

### メインAPIサーバー (http://localhost:3008)

#### 基本情報
- `GET /` - API情報
- `GET /health` - ヘルスチェック

#### ユーザー関連
- `GET /users` - ユーザー一覧取得
- `GET /users/:id` - 特定のユーザー取得
- `POST /users` - ユーザー作成

#### 投稿関連
- `GET /posts` - 投稿一覧取得
- `POST /posts` - 投稿作成

#### 統計関連
- `GET /stats/posts-by-genre` - ジャンル毎の投稿数統計
- `GET /stats/posts-by-genre-daily` - 日別ジャンル投稿数統計
- `POST /stats/send-to-external-api` - 外部APIに日別ジャンル統計データを送信

### 外部APIモックサーバー (http://localhost:4000)

#### 基本情報
- `GET /` - サーバー情報
- `GET /health` - ヘルスチェック
- `GET /openapi.yaml` - OpenAPI仕様書

#### 統計データ受信・管理
- `POST /api/v1/stats/daily-genre` - 日別ジャンル統計データ受信
- `GET /api/v1/stats/daily-genre` - 受信した統計データ一覧
- `GET /api/v1/stats/daily-genre/latest` - 最新の統計データ
- `GET /api/v1/stats/daily-genre/:date` - 特定日の統計データ
- `DELETE /api/v1/stats/daily-genre` - 統計データをクリア
- `GET /api/v1/stats/summary` - 統計サマリー

## 使用例

### 基本的な使用方法

#### 1. ユーザー一覧取得
```bash
curl http://localhost:3008/users
```

#### 2. 新しいユーザー作成
```bash
curl -X POST http://localhost:3008/users \
  -H "Content-Type: application/json" \
  -d '{"name": "新規ユーザー", "email": "newuser@example.com"}'
```

#### 3. 新しい投稿作成
```bash
curl -X POST http://localhost:3008/posts \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "genre_id": 1, "title": "新しい投稿", "content": "投稿の内容です"}'
```

#### 4. 日別ジャンル投稿数統計を取得
```bash
curl http://localhost:3008/stats/posts-by-genre-daily
```

#### 5. 外部APIに統計データを送信
```bash
curl -X POST http://localhost:3008/stats/send-to-external-api \
  -H "Content-Type: application/json"
```

#### 6. 外部APIで受信したデータを確認
```bash
curl http://localhost:4000/api/v1/stats/daily-genre
```

#### 7. OpenAPI仕様書の確認
```bash
# OpenAPI仕様書をダウンロード
curl http://localhost:4000/openapi.yaml

# または、ブラウザで確認
open http://localhost:4000/openapi.yaml
```

### 自動テストスクリプト

プロジェクトには、外部API連携の動作を確認するためのテストスクリプトが含まれています。

```bash
# テストスクリプトの実行
./test-api.sh
```

このスクリプトは以下の処理を自動で行います：
1. メインAPIサーバーのヘルスチェック
2. 外部APIモックサーバーのヘルスチェック
3. 日別ジャンル投稿数統計の取得
4. 外部APIへの統計データ送信
5. 外部APIで受信したデータの確認
6. 統計サマリーの確認

## 外部API連携の仕組み

### データフロー
1. メインAPIサーバーがデータベースから日別ジャンル投稿数統計を取得
2. 統計データを外部APIモックサーバーに送信
3. 外部APIモックサーバーがデータを受信・保存
4. 受信したデータの確認・管理が可能

### データ形式
送信されるデータの形式：
```json
[
  {
    "date": "2025-07-14",
    "genre": "プログラミング",
    "count": 5
  },
  {
    "date": "2025-07-14",
    "genre": "日記",
    "count": 3
  }
]
```

## 設定

### 環境変数
- `EXTERNAL_API_URL`: 外部APIのURL（デフォルト: http://localhost:4000）

### 設定例
```bash
# 外部APIのURLを変更する場合
export EXTERNAL_API_URL="https://api.example.com"
```

## データベース接続

PostgreSQLには以下の設定で接続できます：

- Host: localhost
- Port: 5432
- Database: myapp
- Username: postgres
- Password: password

## プロジェクト構成

```
.
├── docker-compose.yml       # Docker Compose設定
├── db/
│   └── init.sql            # データベース初期化スクリプト
├── src/
│   └── main.ts             # メインアプリケーション
├── mock-server/
│   ├── main.ts             # 外部APIモックサーバー
│   └── openapi.yaml        # OpenAPI仕様書
├── test-api.sh             # API連携テストスクリプト
└── README.md               # このファイル
```

## OpenAPI仕様書

外部APIモックサーバーのOpenAPI仕様書が `mock-server/openapi.yaml` に含まれています。

### 機能
- 完全なAPIドキュメント
- リクエスト/レスポンスのスキーマ定義
- サンプルデータとエラーハンドリング
- ページネーション対応

### 確認方法
```bash
# サーバー起動後にブラウザで確認
open http://localhost:4000/openapi.yaml

# または、Swagger UIなどのツールで表示
# 例：VS Code の OpenAPI (Swagger) Editor拡張機能
```

## 開発

- Denoアプリケーションは `--watch` フラグで起動されるため、ファイルを変更すると自動的に再起動されます
- `src/` ディレクトリ内のファイルを編集して開発を行います
- 外部APIモックサーバーは `mock-server/main.ts` で設定できます

## トラブルシューティング

### ポートが使用中の場合
```bash
# 使用中のポートを確認
lsof -i :3008  # メインAPIサーバー
lsof -i :4000  # 外部APIモックサーバー
lsof -i :5432  # PostgreSQL

# プロセスを終了
kill -9 <PID>
```

### データベースをリセットしたい場合
```bash
docker compose down -v
docker compose up -d
```

### 外部API連携がうまくいかない場合
1. 両方のサーバーが起動していることを確認
2. `./test-api.sh` を実行してエラーを確認
3. 外部APIモックサーバーのログを確認
4. 環境変数 `EXTERNAL_API_URL` の設定を確認

## 本番環境での使用

本番環境では、以下の点を考慮してください：

1. **セキュリティ**: 認証・認可機能の実装
2. **エラーハンドリング**: より堅牢なエラー処理
3. **ログ記録**: 詳細なログ記録とモニタリング
4. **レート制限**: API呼び出しのレート制限
5. **データ永続化**: 外部APIモックサーバーの実際のデータベース接続
6. **環境変数**: 本番用の設定管理
