.PHONY: help up down logs restart build clean db-reset test

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make up        - 環境を起動"
	@echo "  make down      - 環境を停止"
	@echo "  make logs      - ログを表示"
	@echo "  make restart   - 環境を再起動"
	@echo "  make build     - イメージを再構築して起動"
	@echo "  make clean     - 全てのコンテナとボリュームを削除"
	@echo "  make db-reset  - データベースをリセット"
	@echo "  make test      - APIテスト"

# 環境を起動
up:
	docker compose up -d
	@echo "環境が起動しました。http://localhost:3008 でアクセスできます。"

# 環境を停止
down:
	docker compose down

# ログを表示
logs:
	docker compose logs -f

# 環境を再起動
restart:
	docker compose restart

# イメージを再構築して起動
build:
	docker compose up --build -d

# 全てのコンテナとボリュームを削除
clean:
	docker compose down -v
	docker system prune -f

# データベースをリセット
db-reset:
	docker compose down -v
	docker compose up -d postgres
	@echo "データベースがリセットされました。"
	@sleep 5
	docker compose up -d app

# APIテスト
test:
@echo "APIテストを実行中..."
@echo "1. ヘルスチェック"
curl -s http://localhost:3008/health | jq .
@echo "\n2. ユーザー一覧取得"
curl -s http://localhost:3008/users | jq .
@echo "\n3. 投稿一覧取得"
curl -s http://localhost:3008/posts | jq .
@echo "\n4. 新しいユーザー作成"
curl -s -X POST http://localhost:3008/users \
-H "Content-Type: application/json" \
-d '{"name": "テストユーザー", "email": "test@example.com"}' | jq .
@echo "\nAPIテストが完了しました。"
